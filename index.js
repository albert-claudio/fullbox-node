const express = require("express")
const app = express()
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const path = require("path")
require('dotenv').config();
const cors = require("cors")

app.use(express.json())
app.use(cors())

const urlDB = process.env.DATABASE_URL;


// DATABASE CONNECTION WITH MONGODB
mongoose.connect(urlDB)
mongoose.connect(urlDB, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Error connecting to MongoDB:', err));
const PORT = process.env.PORT || 4000;

//API CREATE
app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

//IMAGE STORAGE ENGINE
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//CREATING UPLOAD ENDPOINT FOR IMAGES
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    const imageUrl = 'http://localhost:4000/images/${req.file.filename}'
    res.json({
        success:1,
    image_url: imageUrl
    })
})


//SCHEMA FOR CREATING PRODUCTS
const Product = mongoose.model("Product", {
    id:{ type:Number, required:true, },
    name:{ type:String, required:true,},
    image:{ type:String, required: true,},
    category:{type:String,required:true,},
    new_price:{type:Number,required:true,},
    old_price:{type:Number,required:true,},
    date:{type:Date, default:Date.now,},
    avilable:{ type:Boolean, default:true, },
})

app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({})
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0]
        id = last_product.id+1
    }else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    console.log(product)
    await product.save()
    console.log("Saved")
    res.json({
        sucess:true,
        name:req.body.name,
    })
})

//CREATING API FOR DELETING PRODUCTS
app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id})
    console.log("Removed")
    res.json({
        success:true,
        name:req.body.name
    })
})
//CREATING API FOR GETTING ALL PRODUCTS
app.get('/allproducts', async(req,res)=>{
    let products = await Product.find({})
    console.log("All Products Fetched")
    res.send(products)
})

//SCHEMA CREATING USER MODEL
const Users = mongoose.model("Users",{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique: true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//CREATING ENDPOINT FOR REGISTERING USER
app.post('/signup', async(req,res)=>{
    let check = await Users.findOne({email:req.body.email})
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart = {}
    for (let i = 0; i < 300; i++) {
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save()
    const data = {
        user:{
            id:user.id,
        }
    }
    const token = jwt.sign(data,'secret_ecom')
    res.json({success:true,token})

})

//CREATING ENDPOINT FOR USER LOGIN
app.post('/login', async(req,res)=>{
    let user = await Users.findOne({email:req.body.email})
    if(user){
        const passCompare = req.body.password === user.password
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom')
            res.json({success:true,token})
        }
        else{
            res.json({success:false, errors:"Wrong Password"})
        }
    }
    else{
        res.json({success:false, errors:"No User Found"})
    }
})

//CREATING ENDPOINT FOR NEWCOLLECTION DATA
app.get('/newcollections', async (req,res)=>{
    let products = await Product.find({})
    let newcollection = products.slice(1).slice(-8)
    console.log("NewCollection Fetched")
    res.send(newcollection)
})

//CREATING ENDPOINT FOR POPULAR IN WOMEN SECTION
app.get('/popularinwomen', async(req,res)=>{
    let products = await Product.find({category: "women"})
    let popular_in_women = products.slice(0,4)
    console.log("Popular in women fetched")
    res.send(popular_in_women)

})

//CREATING MIDDELWARE TO FETCH USER
    const fetchUser = async (req,res,next)=>{
        const token = req.header('auth-token')
        if(!token){
            res.status(401).send({errors:"Please authenticate using valid token"})
        }else{
            try{
                const data = jwt.verify(token,'secret_ecom')
                req.user = data.user
                next()
            }catch(error){
                res.status(401).send({errors:"please authenticate a valid token"})
            }
        }
    }

//CREATING ENDPOINT FOR ADDING PRODUCTS IN CARTDATA

app.post('/addtocart', fetchUser,async(req,res)=>{
    console.log("Added", req.body.itemId)
    let userData = await Users.findOne({_id:req.user.id})
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Added")
})

//CREATING ENDPOINT TO REMOVE PRODUCT FROM CARTDATA
app.post('/removefromcart', fetchUser, async(req,res)=>{
    console.log("removed", req.body.itemId)
    let userData = await Users.findOne({_id:req.user.id})
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Removed")
})

//CREATING ENDPOINT GET CARTDATA
app.post('/getcart', fetchUser, async(req,res)=>{
    console.log("GetCart")
    let userData = await Users.findOne({_id:req.user.id})
    res.json(userData.cartData)
})

app.listen(PORT,(error)=>{
    if(!error){
        console.log(`Server Running on Port ${PORT}`)
    }else{
        console.log("Error: "+error)
    }
})

module.exports = app;
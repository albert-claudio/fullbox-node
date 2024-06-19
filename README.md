# E-commerce Backend API

Este projeto é um backend para um aplicativo de e-commerce, construído utilizando Node.js, Express, e MongoDB. Ele fornece várias APIs para operações de produtos e usuários, incluindo registro de usuários, login, upload de imagens, e manipulação de dados de carrinho.

## Funcionalidades

- Conexão com o banco de dados MongoDB.
- Registro e login de usuários com autenticação JWT.
- CRUD de produtos.
- Upload e gerenciamento de imagens de produtos.
- Manipulação de dados de carrinho de compras.

## Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/meu-projeto-node.git
    cd meu-projeto-node
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
    ```env
    DATABASE_URL=mongodb://seu_usuario:senha@localhost:27017/sua_base_de_dados
    PORT=5000
    ```

4. Inicie o servidor:
    ```bash
    node index.js
    ```

## Endpoints

### 1. API Raiz
- **GET /** 
    - Resposta: "Express App is Running"

### 2. Upload de Imagens
- **POST /upload**
    - Body (multipart/form-data): 
        - `product`: arquivo de imagem.
    - Resposta: URL da imagem carregada.

### 3. Produtos
- **POST /addproduct**
    - Adiciona um novo produto.

- **POST /removeproduct**
    - Remove um produto pelo ID.

- **GET /allproducts**
    - Retorna todos os produtos.

- **GET /newcollections**
    - Retorna os 8 produtos mais recentes.

- **GET /popularinwomen**
    - Retorna os 4 produtos mais populares na categoria "women".

### 4. Usuários
- **POST /signup**
    - Registra um novo usuário.

- **POST /login**
    - Faz login de um usuário existente.

### 5. Carrinho
- **POST /addtocart**
    - Adiciona um produto ao carrinho do usuário.

- **POST /removefromcart**
    - Remove um produto do carrinho do usuário.

- **POST /getcart**
    - Retorna os dados do carrinho do usuário.

## Estrutura do Projeto

```plaintext
.
├── upload/                    # Diretório para armazenar imagens carregadas.
├── .env                       # Arquivo de configuração de variáveis de ambiente.
├── .gitignore                 # Arquivo para ignorar node_modules e .env.
├── index.js                   # Arquivo principal do servidor.
├── package.json               # Arquivo de configuração do npm.
└── README.md                  # Este arquivo.
````

## Dependencias
- express
- mongoose
- jsonwebtoken
- multer
- path
- dotenv
- cors

## Quer Contribuir
1.Fork o projeto.

2.Crie uma nova branch (git checkout -b feature/nova-feature).

3.Commit suas mudanças (git commit -m 'Adiciona nova feature').

4.Push para a branch (git push origin feature/nova-feature).

5.Abra um Pull Request.

## Licença
Este projeto está licenciado sob a licença MIT.

```explication
Este `README.md` fornece uma visão geral do projeto, instruções de instalação, lista de funcionalidades e endpoints da API, estrutura do projeto, dependências e informações sobre como contribuir.
```

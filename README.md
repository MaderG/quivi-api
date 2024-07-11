# Quiví API

## Visão Geral

Bem-vindo ao Quiví! Nossa empresa está desenvolvendo uma plataforma web inovadora que simplifica a contratação de freelancers. A plataforma resolve as dificuldades na avaliação de habilidades e na escolha do profissional ideal através de um algoritmo de Match Inteligente.

Este repositório contém a API da nossa plataforma, responsável por gerenciar as operações de backend, incluindo a gestão de usuários, freelancers, projetos, entre outros.

## Estrutura do Projeto

A estrutura do projeto está organizada da seguinte forma:

- `src/`
  - `index.js`: Ponto de entrada da aplicação.
  - `routes/`
    - `client.routes.js`: Rotas relacionadas aos clientes.

## Tecnologias Utilizadas

- **Node.js**: Plataforma de desenvolvimento.
- **Express**: Framework web para Node.js.
- **Prisma**: ORM para manipulação do banco de dados.
- **PostgreSQL**: Banco de dados relacional.
- **Docker**: Ferramenta de contêinerização.
- **Zod**: Biblioteca de validação de esquemas.

## Requisitos

- Node.js (versão 14 ou superior)
- Docker

## Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/sua-empresa/quivi-api.git
    cd quivi-api
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Configure o banco de dados com Docker:

    ```bash
    npm run docker:start
    ```

4. Gere os arquivos do Prisma:

    ```bash
    npm run prisma:generate
    npm run prisma:migrate
    ```

## Scripts Disponíveis

- `start`: Inicia a aplicação.
- `dev`: Inicia a aplicação em modo de desenvolvimento com `nodemon`.
- `docker:start`: Inicia os serviços Docker definidos no `docker-compose.yml`.
- `docker:stop`: Para os serviços Docker.
- `docker:delete`: Remove os serviços Docker.
- `prisma:generate`: Gera o cliente Prisma.
- `prisma:migrate`: Executa as migrações do Prisma.

## Uso

1. Inicie a aplicação:

    ```bash
    npm start
    ```

2. A aplicação estará disponível em `http://localhost:3000`.

## Rotas Disponíveis

### Clientes

- `GET /clients`: Retorna a lista de clientes.
- `POST /clients`: Cria um novo cliente.
- `GET /clients/:id`: Retorna um cliente específico.
- `PUT /clients/:id`: Atualiza um cliente específico.
- `DELETE /clients/:id`: Remove um cliente específico.

## Contribuição

Sinta-se à vontade para contribuir com o projeto através de pull requests. Todas as contribuições são bem-vindas!

## Licença

Este projeto está licenciado sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

---

**Autores**: Equipe de Desenvolvimento Quiví

**Contato**: [email@example.com](mailto:email@example.com)

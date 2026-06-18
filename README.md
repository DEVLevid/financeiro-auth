# financeiro-auth

Microserviço de autenticação do sistema financeiro. Responsável por cadastro, login, validação de token e logout. Os tokens ficam em memória no processo e o banco PostgreSQL é compartilhado via repositório `[financeiro_db](https://github.com/TzuChaeDahy/financeiro_db)`.

## Stack


| Tecnologia        | Uso                      |
| ----------------- | ------------------------ |
| Node.js 22+       | Runtime                  |
| TypeScript        | Linguagem                |
| Express           | HTTP server              |
| PostgreSQL (`pg`) | Persistência de usuários |
| Swagger UI        | Documentação interativa  |
| dotenv            | Variáveis de ambiente    |


## Estrutura do projeto

```
financeiro-auth/
├── src/
│   ├── index.ts                    # Bootstrap do servidor
│   ├── app.ts                      # Configuração Express, rotas e middlewares
│   ├── config.ts                   # PORT e DATABASE_URL
│   ├── db.ts                       # Pool de conexão PostgreSQL
│   ├── types.ts                    # Tipos de domínio (User, TokenSession)
│   │
│   ├── controllers/
│   │   └── auth.controller.ts      # Camada HTTP (request/response)
│   │
│   ├── services/
│   │   ├── auth.service.ts         # Regras de negócio
│   │   └── token.service.ts        # Gerenciamento de tokens em memória
│   │
│   ├── repositories/
│   │   └── user.repository.ts      # Queries no banco (users)
│   │
│   ├── validators/
│   │   └── auth.validator.ts       # Validação de entrada
│   │
│   ├── dtos/
│   │   └── auth.dto.ts             # Contratos de request/response
│   │
│   ├── errors/
│   │   └── app.error.ts            # Erros tipados (400, 401, 409)
│   │
│   ├── middlewares/
│   │   ├── async-handler.ts        # Wrapper para rotas async
│   │   └── error-handler.ts        # Tratamento centralizado de erros
│   │
│   ├── routes/
│   │   └── auth.routes.ts          # Definição das rotas /auth/*
│   │
│   └── swagger/
│       ├── swagger.ts              # Especificação OpenAPI 3.0
│       └── setup.ts                # Montagem do Swagger UI
│
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

## Arquitetura

```
Request
   │
   ▼
Routes ──► Controller ──► Validator
   │              │
   │              ▼
   │         AuthService ──► UserRepository ──► PostgreSQL
   │              │
   │              ▼
   │         TokenService (Map em memória)
   │
   ▼
ErrorHandler ◄── AppError (400 / 401 / 409)
```


| Camada           | Responsabilidade                                      |
| ---------------- | ----------------------------------------------------- |
| **Routes**       | Mapeia URL → controller                               |
| **Controller**   | Recebe HTTP, delega ao service, retorna status        |
| **Validator**    | Valida campos obrigatórios do body                    |
| **Service**      | Regras de negócio (cadastro, login, validate, logout) |
| **Repository**   | Acesso ao banco (`users`)                             |
| **TokenService** | Cria, valida e revoga tokens em memória               |


## Pré-requisitos

- Node.js >= 18
- pnpm (ou npm)
- Docker (para o banco PostgreSQL)

## Configuração

### 1. Subir o banco de dados

```bash
cd ../financeiro_db
docker compose up -d
```

O `init.sql` cria automaticamente a tabela `users`:

```sql
users (id, name, email, password)
```

### 2. Configurar o serviço

```bash
cd ../financeiro-auth
pnpm install
cp .env.example .env
```

### Variáveis de ambiente


| Variável       | Descrição                    | Padrão                                                         |
| -------------- | ---------------------------- | -------------------------------------------------------------- |
| `PORT`         | Porta HTTP do serviço        | `3001`                                                         |
| `DATABASE_URL` | Connection string PostgreSQL | `postgresql://financeiro:financeiro@localhost:5434/financeiro` |


> **Atenção:** o Postgres do Docker expõe a porta **5434** no host (mapeamento `5434:5432`).

### 3. Executar

```bash
# Desenvolvimento (hot reload)
pnpm dev
```

Servidor disponível em: `http://localhost:3001`

## Documentação interativa (Swagger)


| Recurso      | URL                                                                        |
| ------------ | -------------------------------------------------------------------------- |
| Swagger UI   | [http://localhost:3001/api/docs](http://localhost:3001/api/docs)           |
| OpenAPI JSON | [http://localhost:3001/api/docs.json](http://localhost:3001/api/docs.json) |


## Endpoints

Base URL: `http://localhost:3001`


| Método | Rota             | Descrição                           |
| ------ | ---------------- | ----------------------------------- |
| `GET`  | `/health`        | Health check                        |
| `POST` | `/auth/register` | Cadastro de usuário                 |
| `POST` | `/auth/login`    | Login (retorna token)               |
| `POST` | `/auth/validate` | Validar token (uso do orquestrador) |
| `POST` | `/auth/logout`   | Encerrar sessão (revoga token)      |


---

### `GET /health`

Verifica se o serviço está rodando.

**Response `200`:**

```json
{ "status": "ok" }
```

---

### `POST /auth/register`

Cria um novo usuário.

**Request:**

```json
{
  "email": "vinicius@email.com",
  "senha": "123456"
}
```

**Response `201`:**

```json
{
  "id": 1,
  "email": "vinicius@email.com"
}
```

**Erros:**


| Status | Body                                               |
| ------ | -------------------------------------------------- |
| `400`  | `{ "message": "email and password are required" }` |
| `409`  | `{ "message": "email already registered" }`        |


---

### `POST /auth/login`

Autentica o usuário e retorna um token de acesso.

**Request:**

```json
{
  "email": "vinicius@email.com",
  "senha": "123456"
}
```

**Response `200`:**

```json
{
  "token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Erros:**


| Status | Body                                               |
| ------ | -------------------------------------------------- |
| `400`  | `{ "message": "email and password are required" }` |
| `401`  | `{ "message": "invalid credentials" }`             |


---

### `POST /auth/validate`

Valida um token. **Rota de uso exclusivo do orquestrador.**

**Request:**

```json
{
  "token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Response `200` (token válido):**

```json
{
  "valid": true,
  "userId": 1,
  "email": "vinicius@email.com"
}
```

**Response `401` (token inválido):**

```json
{
  "valid": false
}
```

---

### `POST /auth/logout`

Revoga o token e encerra a sessão.

**Request:**

```json
{
  "token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Response `200`:**

```json
{
  "message": "logged out successfully"
}
```

**Erros:**


| Status | Body                                 |
| ------ | ------------------------------------ |
| `400`  | `{ "message": "token is required" }` |


---

## Exemplos com curl

```bash
# Health check
curl http://localhost:3001/health

# Registrar
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"vinicius@email.com","senha":"123456"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vinicius@email.com","senha":"123456"}'

# Validar token (orquestrador)
curl -X POST http://localhost:3001/auth/validate \
  -H "Content-Type: application/json" \
  -d '{"token":"SEU_TOKEN"}'

# Logout
curl -X POST http://localhost:3001/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"token":"SEU_TOKEN"}'
```

## Integração com o orquestrador

Fluxo esperado:

```
Cliente ──► Orquestrador ──► POST /auth/validate
                                  │
                    valid: true ──┤──► prossegue (transação, notificação, etc.)
                    valid: false ─┘──► retorna 401 ao cliente
```

1. O cliente faz login em `/auth/login` e recebe o `token`.
2. O cliente envia o `token` em todas as requisições ao **orquestrador**.
3. O orquestrador chama `POST /auth/validate` neste serviço.
4. Se `valid: true`, usa `userId` e `email` para as próximas operações.
5. No logout, o cliente chama `POST /auth/logout` para invalidar o token.

## Observações

- **Senhas** são armazenadas em texto plano (MVP para entrega rápida).
- **Tokens** ficam em memória — reiniciar o serviço invalida todas as sessões ativas.
- O campo `name` na tabela `users` é derivado automaticamente da parte local do e-mail (ex: `vinicius@email.com` → `vinicius`).

## Scripts disponíveis


| Script  | Comando      | Descrição                      |
| ------- | ------------ | ------------------------------ |
| `dev`   | `pnpm dev`   | Desenvolvimento com hot reload |
| `build` | `pnpm build` | Compila TypeScript → `dist/`   |
| `start` | `pnpm start` | Executa build de produção      |



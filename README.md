# Chat Server (Express + Socket.IO + Mongo + Redis + JWT)

## 起動（ローカル）
1. `.env` を作成して `.env.example` を参考に設定
2. `npm ci`
3. `node src/server.js` または `npm start`

## Docker
`docker-compose up --build`

- HTTP API:
  - POST /api/register { username, password }
  - POST /api/login { username, password } => { token, username }
  - GET /api/messages/recent?n=100

- Socket.IO:
  - クライアントは接続時に `auth: { token }` を含めてください。
  - イベント:
    - server -> client: `message` { from, text, createdAt }
    - server -> client: `system` text
    - server -> client: `users` [username,...]
    - client -> server: `message` text

## 注意
- 本番では JWT_SECRET を安全に管理し、HTTPS を必須にしてください。
- rate-limit / input validation を忘れずに。

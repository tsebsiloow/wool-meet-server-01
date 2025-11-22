import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

import connectMongo from "./config/mongo.js";
import redis from "./config/redis.js";
import authMiddleware from "./middleware/auth.js";
import authRouter from "./routes/auth.js";
import messageRouter from "./routes/messages.js";

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));
app.use(express.json());

connectMongo();
redis.connect().catch(console.error);

app.use("/auth", authRouter);
app.use("/messages", messageRouter);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// 認証付き Socket
io.use(authMiddleware);

io.on("connection", async (socket) => {
  console.log("user connected:", socket.user.username);

  socket.join("global");

  socket.on("message", async (text) => {
    const msg = {
      text,
      user: socket.user.username,
      time: Date.now(),
    };

    await redis.lpush("messages", JSON.stringify(msg));
    io.to("global").emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 3000;

// Render 用：0.0.0.0 で待機する
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});

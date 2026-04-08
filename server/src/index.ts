import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/notes.js";
import { healthCheck } from "./controllers/health.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import { PORT } from "./constants/env.js";
import logger from "./lib/logger.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is working" });
});

app.get("/health", healthCheck);

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.use(notFound);
app.use(errorHandler);

io.on("connection", (socket) => {
  logger.info(`A user connected: ${socket.id}`);

  socket.on("join-note", (noteId) => {
    socket.join(`note-${noteId}`);
    logger.info(`User joined note: ${noteId}`);
  });

  socket.on("edit-note", (data) => {
    socket.to(`note-${data.noteId}`).emit("note-updated", data);
  });

  socket.on("disconnect", () => {
    logger.info("User disconnected");
  });
});

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("[Unhandled Rejection]", { reason });
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  logger.error("[Uncaught Exception]", { error: err });
  process.exit(1);
});

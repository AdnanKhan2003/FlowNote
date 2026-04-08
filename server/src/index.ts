import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);


io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-note', (noteId) => {
    socket.join(`note-${noteId}`);
    console.log(`User joined note: ${noteId}`);
  });

  socket.on('edit-note', (data) => {

    socket.to(`note-${data.noteId}`).emit('note-updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

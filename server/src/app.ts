import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { connectToDatabase } from './tools/database';
import authRoutes from './routes/authRoutes';
import dataRoutes from './routes/dataRoutes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { handleSocket } from './socket/socket.io';


dotenv.config({
  path: process.env.NODE_ENV === 'test' ? ".env.test" : ".env",
});


export const app = express();
const server = http.createServer(app);


app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


export const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});
app.use(express.json({ limit: "50mb" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', handleSocket);


app.use('/auth', authRoutes);
app.use('/api', dataRoutes);


app.use((req, res, next) => {
  res.status(404).json({ 
    success: false, 
    message: "Endpoint not found" 
  });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: "Internal server error" 
  });
});


connectToDatabase()
  .then(() => console.log('Connected to database successfully'))
  .catch(err => console.error('Database connection error:', err));


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  console.log(`Socket.IO is ready for connections`);
});
import * as dotenv from 'dotenv';
dotenv.config();


import express from 'express';
// import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import './db/conn';
import cors from 'cors';
import {router} from './Routes/router';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';

const PORT = 5004;
const app = express();
const server = createServer(app);
// const io = new SocketIOServer(server);

app.use(cors());
app.use(express.json());
app.use(router);



// io.on('connection', (socket: socketIO.Socket) => {
//   console.log('A user connected');

//   socket.on('disconnect', () => {
//       console.log('A user disconnected');
//   });

//   socket.on('login', async (data: { email: string, password: string }) => {
//       const { email, password } = data;

//       if (!email || !password) {
//           return socket.emit('login_error', { error: 'All fields are mandatory' });
//       }

//       try {
//           const user = await users.findOne({ email: email });

//           if (!user) {
//               return socket.emit('login_error', { error: 'Invalid username or password' });
//           }

//           const isPasswordValid = await bcrypt.compare(password, user.password);

//           if (!isPasswordValid) {
//               return socket.emit('login_error', { error: 'Invalid username or password' });
//           }

//           const token = jwt.sign({ userId: user._id }, process.env.jwtSecret as string, {
//               expiresIn: process.env.jwtExpiresIn,
//           });

//           socket.emit('login_success', { message: 'Login successful', token });
//       } catch (error) {
//         if (error instanceof Error) {
//           console.error("An error occurred:", error.message);
//       } else {
//           console.error("An unknown error occurred:", error);
//       }
//       }
//   });
// });







app.listen(PORT, ()=>{
    console.log(`server start at Port No ${PORT}`)
});

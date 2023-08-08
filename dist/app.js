"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
// import { Server as SocketIOServer } from 'socket.io';
const http_1 = require("http");
require("./db/conn");
const cors_1 = __importDefault(require("cors"));
const router_1 = require("./Routes/router");
const PORT = 5004;
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// const io = new SocketIOServer(server);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(router_1.router);
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
app.listen(PORT, () => {
    console.log(`server start at Port No ${PORT}`);
});

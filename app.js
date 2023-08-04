require("dotenv").config();
const express = require("express");
const socketIO = require('socket.io');
const http = require('http');
const app = express();
require("./db/conn");
const cors = require("cors");
const router = require("./Routes/router");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = 5004;
const server = http.createServer(express);
const io = socketIO(server);
app.use(cors());
app.use(express.json());
app.use(router);



io.on('connection', (socket) => {
    console.log('A user connected');
   
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  
    socket.on('login', async (data) => {
      const { email, password } = data;
  
      if (!email || !password) {
        return socket.emit('login_error', { error: 'All fields are mandatory' });
      }
  
      try {
        const user = await User.findOne({ email: email });
  
        if (!user) {
          return socket.emit('login_error', { error: 'Invalid username or password' });
        }
  
        const isPasswordValid = await bcrypt.compare(password, user.password);
  
        if (!isPasswordValid) {
          return socket.emit('login_error', { error: 'Invalid username or password' });
        }
  
        const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
          expiresIn: config.jwtExpiresIn,
        });
  
        socket.emit('login_success', { message: 'Login successful', token });
      } catch (error) {
        socket.emit('login_error', { error: error.message });
        console.log("catch block error:", error.message);
      }
    });
  });
  


// app.get("/", (req,res)=>{
//     res.status(200).json("start server");
// });







app.listen(PORT, ()=>{
    console.log(`server start at Port No ${PORT}`)
});

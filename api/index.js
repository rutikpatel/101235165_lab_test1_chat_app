const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')
const http = require('http')
const mongoose = require('mongoose');
const router = require('./router')

const app = express()
app.use(cors())
app.use(express.json())
const server = http.createServer(app)
const io = socketio(server)
app.listen(9000, async function () {
    console.log(`Listening on port ${9000}`);
    console.log(`Connecting to mongo...`);
    // const { MONGO_PORT, MONGO_DB_NAME, MONGO_HOST } = config
    try {
        await mongoose.connect(`mongodb://localhost:27017/labtest`);
        console.log("Connected to mongo");
    } catch (e) {
        console.error(e);
    }
})

io.on('connection',(socket)=>{
    console.log("we have a new connection")

    socket.on('disconnect',()=>{
        console.log('user had left')
    })
})


app.use(router)

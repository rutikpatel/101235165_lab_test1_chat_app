var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
const app = require('express')()
const http = require('http').createServer(app)
const cors = require('cors')

const { Socket } = require('socket.io')
const PORT = 3001


app.use(express.static(__dirname));
// import models
const User = require('./models/user.js')
const GroupMessage = require('./models/group_message')
const PrivateMessage = require('./models/private_message')

const io = require('socket.io')(http)

app.use(cors())
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// default, login page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

app.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ userName });
        if (user === null) {
            throw new Error("This Username not associated with our record");   
        }
        if (user.password !== password) {
            throw new Error("Password is incorrect");
        }
        res.status(200).send({user})
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html')
})

app.post('/register', async(req, res) => {
    try {
        const {userName,firstName,lastName,password} = req.body
        const takenUsername = await User.findOne({ userName})
        if (takenUsername !== null) {
            throw new Error('Username already is use')
        }
        const newUser = new User({
            userName,firstName,lastName,password
        })
        const user = await newUser.save();
        res.status(200).send( {user:user._doc} )
    }
    catch(e){
        res.status(400).send({ error: e.message });
    }
    
})
;
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html')
})
app.get('/chatroom', (req, res) => {
    res.sendFile(__dirname + '/chatRoom.html')
})

// socket io stuff
// client requests
io.on('connection', (socket) => {
    console.log('connection created...')

    // welcome message
    const welcomeMessage = {
        userName: 'admin',
        message: 'Welcome to the chat application'
    }
    socket.emit('welcome', welcomeMessage)

    // join room
    socket.on('join', (roomName,userName) => {
        socket.join(roomName)
        socket.broadcast.to(roomName).emit('userJoined',userName)
    })
    socket.on('left', (roomName, userName) => {
        socket.broadcast.to(roomName).emit('userHasLeft', userName)
    })


    // send message to room
    socket.on('messageToRoom', async (data) => {
        const message = {
            userName: data.userName,
            message: data.message
        }
        socket.broadcast.to(data.room).emit('newMessage', message)

        console.log(`${data.userName} send a message to ${data.room}`)
        try{
        const newMsg = GroupMessage({
            fromUser: data.userName,
            room: data.room,
            message:data.message
        })
        await newMsg.save()
        }   
        catch(e){
            throw new Error(e.message)
        }
        // socket.broadcast.to(data.room).emit('newMessage', message)
    })

    // disconnect
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected...`)
    })

})


const dbURL = "mongodb://localhost:27017/labtest"

// connect to database
mongoose
    .connect(dbURL)
    .then(() => console.log(`Database connection successful`))
    .catch((err) => console.log(`Database connection error ${err}`));

//Start HTTP server
http.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`)
})

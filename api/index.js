// const express = require('express')
// const socketio = require('socket.io')
// const cors = require('cors')
// const app = express()
// const http = require('http').createServer(app)
// const req = require('express/lib/request')
// const res = require('express/lib/response')
// const { Socket } = require('socket.io')
// const PORT = 3001
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser')
// app.use(cors())
// app.use(express.json())

// const io = require('socket.io')(http)

// const User = require('./models/user')
// const privateMsg = require('./models/private_message')
// const grpMsg = require('./models/group_message')


// app.get('/',(req,res)=>{
//     // res.send("welcome to app")
//     res.sendFile(__dirname +'/Login.html')
// })
// app.get("/Register.html", (req, res) => {
//     res.sendFile(__dirname + '/Register.html')
// })
// app.get("/Chat.html", (req, res) => {
//     res.sendFile(__dirname + '/Chat.html')
// })

// app.post('/login',async(req,res)=>{
//     if(req != null && req.body != null){
//         const user = await User.findOne({userName:req.body.userName})
//         if(user.password === req.body.password){
//             localStorage.setItem("userName",user.userName)
//             res.writeHead(301,
//                 { Location: `http://localhost:${PORT}/chat` }
//             );
//             res.end();
//         }
//         else{
//             res.writeHead(301,
//             {Location :`http://localhost:${PORT}/`}
//             );
//             res.end();
//         }
//     }
// })
// app.post('/register', async (req, res) => {
//     const userAuth = await User.findOne({ userName: req.body.userName})
//     if(userAuth != null){
//         res.json({msg:"Username already taken"})
//         res.end();
//     }
//     else{
//         const newUser = new User({
//             userName:req.body.userName,
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             password: req.body.password
//         })
//         newUser.save()  
//         res.writeHead(301,
//             { Location: `http://localhost:${PORT}/` }
//         );
//         res.end();
//     }
// })

// io.on('connection', (socket) => {
//     console.log('new connection has been establised..')

//     const welcomeMessage = {
//         username: 'Admin',
//         message: 'Welcome to the chat app'
//     }
//     socket.emit('welcome', welcomeMessage)

//     socket.on('join', (roomName) => {
//         console.log(`user has joined ${roomName}`)
//         socket.join(roomName)
//     })

//     socket.on('messageRoom', (data) => {
//         const message = {
//             userName: data.userName,
//             message: data.message
//         }
//         console.log(`${data.userName} send a message to ${data.room}`)
//         socket.broadcast.to(data.room).emit('newMessage', message)
//     })

//     // disconnect
//     socket.on('disconnect', () => {
//         console.log(`${socket.id} disconnected...`)
//     })

// })

    
// try {
//     mongoose.connect(`mongodb://localhost:27017/labtest`);
//     console.log(`Connecting to mongo...`);
//     console.log("Connected to mongo");
// } catch (e) {
//     console.error(e);
// }
// http.listen(PORT, () => {
//     console.log(`Server running at PORT ${PORT}`)
// })

const app = require('express')()
const http = require('http').createServer(app)
const cors = require('cors')
const req = require('express/lib/request')
const res = require('express/lib/response')
const { Socket } = require('socket.io')
const PORT = 3001
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')


// import models
const User = require('./models/user.js')
const GroupMessage = require('./models/group_message')

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
            throw new Error("Username is not in use");
            
        }
        if (user.password !== password) {
            throw new Error("Password is incorrect");
        }
        res.status(200).send({
            user
        })
    } catch (e) {
        res.status(400).send({
            error: e.message
        })
    }
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html')
})

app.post('/register', async (req, res) => {
    const {userName,firstName,lastName,password} = req.body
    const takenUsername = await User.findOne({ userName})
    if (takenUsername) {
        res.json({ message: 'Username already is use' })
    } else {
        try{
        const newUser = new User({
            userName,
            firstName,
            lastName,
            password
        })
        await newUser.save();
            res.status(200).send({ newUser })
    }
    catch(e){
        res.status(400).send(e.message);
    }
    }
})

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html')
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
        console.log(`${userName} joined ${roomName}`)
        socket.join(roomName)
    })

    // send message to room
    socket.on('messageToRoom', async (data) => {
        const message = {
            userName: data.userName,
            message: data.message
        }
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
        socket.broadcast.to(data.room).emit('newMessage', message)
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

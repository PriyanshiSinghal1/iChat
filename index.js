// Node Server which will handle the socket io connections

// Initialising io
// const io=require('socket.io')(8000)      
// //socket.io server will listen incoming events

// const users={};

// // if connection comes, then run the => function
// // socket is a particular connection
// // io.on is an instance of socket.on
// io.on('connection',socket =>{
//     socket.on('new-user-joined', Name =>{
//     console.log("New user: ",Name);
//     users[socket.id]=Name;
//     socket.broadcast.emit('user-joined',Name); 
//      //will notify all other person on the chat beside the person who is joining
//     });

//     socket.on('send',message=>{
//     socket.broadcast.emit('receive',{message:message, Name: users[socket.id]})
//     });
// })

const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT=process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.static(__dirname+'/public'))

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})


const io=require('socket.io')(http)

const users = {};

io.on('connection', (socket) => {
    console.log('connected...')
    socket.on('new-user-joined', (Name) => {
        // console.log("New user:", Name);
        users[socket.id] = Name;
        socket.broadcast.emit('user-joined', Name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, Name: users[socket.id] });
    });

    socket.on('disconnect',(message)=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
});




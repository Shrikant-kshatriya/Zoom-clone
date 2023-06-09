const express = require('express');
const ejs = require('ejs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get('/:room', (req, res) => {
    res.status(200).render('room', {roomId: req.params.room});
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
       socket.join(roomId);
       socket.to(roomId).emit('user-connected', userId);

       socket.on('msg', (message) => {
        console.log(message)
        io.to(roomId).emit('create-message', message);
       });
    });
});

server.listen(3000);
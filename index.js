const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let players = {};

io.on('connection', (socket) => {
    console.log('Player joined: ' + socket.id);

    players[socket.id] = { x: 0, y: 0, color: '#ffffff', facingLeft: false, active: false };

    socket.on('playerMove', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].color = data.color;
            players[socket.id].facingLeft = data.facingLeft;
            players[socket.id].active = true;
        }
        io.emit('stateUpdate', players);
    });

    socket.on('disconnect', () => {
        console.log('Player left: ' + socket.id);
        delete players[socket.id];
        io.emit('stateUpdate', players);
    });
});

http.listen(3000, () => {
    console.log('Server is running! Open the preview window.');
});

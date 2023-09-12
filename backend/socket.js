const {createServer} = require('http');
const { Server } = require('socket.io');
const app = require('./app.js');
const server = createServer(app);
const io = new Server(server,{
    cors: {
        origin: "*"
    }
});

const bus = [0, 0];


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('coords', (pos) => {
        [bus[0], bus[1]] = pos;

        io.emit("getCoords", bus);
    });
})

module.exports = server;
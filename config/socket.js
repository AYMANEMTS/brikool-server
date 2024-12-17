const { Server } = require('socket.io');

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000', // Frontend URL
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        // console.log('A user connected:', socket.id);

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            // console.log(`User joined room: ${roomId}`);
        });

        socket.on('leaveRoom', (roomId) => {
            socket.leave(roomId);
            // console.log(`User left room: ${roomId}`);
        });

        socket.on('sendMessage', ({ chatId, message }) => {
            io.to(chatId).emit('receiveMessage', message);
        });

        socket.on('disconnect', () => {
            // console.log('A user disconnected:', socket.id);
        });
    });

    return io;
};

module.exports = initializeSocket;

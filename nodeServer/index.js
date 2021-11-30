// Node server which will handle all our socket io connection
const io = require('socket.io')(8000,{
    cors: {
        origin: '*',
    }
});

const users = {};

io.on('connection', socket => {
    // If any new user joins the chat room, let other users present in the chat room know
    socket.on('new-user-joined', name => {
        // console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('recieve', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat room, let others know
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", ({ username, room }) => {
        if (!username || !room) return;
        socket.username = username;
        socket.room = room;
        socket.join(room);
        console.log(`${username} joined room: ${room}`);
        socket.to(room).emit("message", `${username} joined the chat.`);
    });

    socket.on("message", (data) => {
        io.to(socket.room).emit("message", `${socket.username}: ${data}`);
    });

    socket.on("disconnect", () => {
        if (socket.username && socket.room) {
            socket.to(socket.room).emit("message", `${socket.username} left the chat.`);
        }
        console.log("User disconnected:", socket.id);
    });
});

app.get("/stop", (req, res) => {
    res.send("Server is shutting down...");
    setTimeout(() => {
        process.exit();
    }, 1000);
});

server.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});

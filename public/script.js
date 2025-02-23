const socket = io();
let username = "";
let room = "";

// Login with ENTER key
document.getElementById("room").addEventListener("keypress", (event) => {
    if (event.key === "Enter") joinChat();
});

document.getElementById("message").addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

function joinChat() {
    username = document.getElementById("username").value.trim();
    room = document.getElementById("room").value.trim();

    if (username && room) {
        socket.emit("joinRoom", { username, room });
        document.getElementById("login").classList.add("hidden");
        document.getElementById("chatbox").classList.remove("hidden");
    }
}

function sendMessage() {
    const message = document.getElementById("message").value.trim();
    if (message) {
        socket.emit("message", message);
        document.getElementById("message").value = "";
    }
}

socket.on("message", (msg) => {
    const messages = document.getElementById("messages");
    messages.innerHTML += `<p>${msg}</p>`;
    messages.scrollTop = messages.scrollHeight;
});

document.getElementById("disconnect").addEventListener("click", () => {
    socket.disconnect();
    location.reload();
});

document.getElementById("stop-server").addEventListener("click", () => {
    fetch("/stop");
});


const { io } = require("socket.io-client");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZiMDU2ZjY4MjdkYTNhMDlmY2EwZjNmNiIsInVzZXJuYW1lIjoicHJhY2hpIiwiZW1haWwiOiJwcmFjaGlAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc5NTUyMDUyNSwiZXhwIjoxNzk1NjA2OTI1fQ.Qu4tRovjgU7lwtAhw5UCTIoeoZhXo7X5oPMWeM_lPQM";

const socket = io("http://localhost:5000", {
    auth: {
        token: token
    }
});

socket.on("connect", () => {
    console.log("Connected to Secure Chat!");
    console.log("Socket ID:", socket.id);

    socket.emit("chat:message", {
        message: "Hello! This is my first real-time chat message."
    });
});

socket.on("chat:message", (data) => {
    console.log("New Message Received:", data);
});

socket.on("chat:error", (error) => {
    console.log("Chat Error:", error.message);
});

socket.on("connect_error", (error) => {
    console.log("Connection Error:", error.message);
});

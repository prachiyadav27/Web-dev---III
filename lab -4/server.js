
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");

const { Server } = require("socket.io");

const { connectDB } = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const noteRoutes = require("./src/routes/noteRoutes");

const {
    authenticateSocket
} = require("./src/middleware/socketAuth");

const { eventBus } = require("./src/events/eventBus");

const app = express();
const server = http.createServer(app);

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// HOME ROUTE
app.get("/", (req, res) => {
    res.json({
        message: "Secure Connect Server Running Successfully!"
    });
});

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// SOCKET.IO SETUP
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// SOCKET AUTHENTICATION
io.use(authenticateSocket);

// REAL-TIME CHAT
io.on("connection", (socket) => {

    console.log(
        socket.user.username,
        "connected to chat"
    );

    eventBus.emit("chat:connected", {
        username: socket.user.username
    });

    // RECEIVE CHAT MESSAGE
    socket.on("chat:message", (data) => {

        const message =
            typeof data?.message === "string"
                ? data.message.trim()
                : "";

        if (!message || message.length > 1000) {
            socket.emit("chat:error", {
                message: "Message must contain 1-1000 characters"
            });
            return;
        }

        const chatData = {
            username: socket.user.username,
            senderId: socket.user.id,
            message: message,
            time: new Date()
        };

        // Broadcast message to all connected clients
        io.emit("chat:message", chatData);

        // EventEmitter
        eventBus.emit("chat:message", chatData);

    });

    // DISCONNECT EVENT
    socket.on("disconnect", () => {
        console.log(
            socket.user.username,
            "disconnected from chat"
        );
    });

});

// START SERVER
const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {

        server.listen(PORT, () => {
            console.log(
                `Server running at http://localhost:${PORT}`
            );
        });

    })
    .catch((error) => {

        console.error(
            "Server startup failed:",
            error.message
        );

        process.exit(1);

    });

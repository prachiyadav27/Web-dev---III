
const EventEmitter = require("events");

const eventBus = new EventEmitter();

// Signup event
eventBus.on("user:registered", (user) => {
    console.log("New User Registered:", user.email);
});

// Login event
eventBus.on("user:loggedIn", (user) => {
    console.log("User Logged In:", user.email);
});

// Chat connection event
eventBus.on("chat:connected", (user) => {
    console.log(user.username, "joined the chat");
});

// Chat message event
eventBus.on("chat:message", (message) => {
    console.log(
        "New Chat Message from",
        message.username,
        ":",
        message.message
    );
});

module.exports = { eventBus };

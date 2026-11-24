
const { io } = require("socket.io-client");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZiMDU3OTE3ZmYyOWE1MmFjNjU5NTAxMSIsInVzZXJuYW1lIjoic3R1ZGVudDIiLCJlbWFpbCI6InN0dWRlbnQyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3OTU1MjA4NjEsImV4cCI6MTc5NTYwNzI2MX0.poSic78L11JQW6CNIIlZJ8M47XTCPGYuNBxUynvJFjY";

const socket = io("http://localhost:5000", {
    auth: { token: token }
});

socket.on("connect", () => {
    console.log("Student 2 Connected!");
});

socket.on("chat:message", (data) => {
    console.log("Message received:", data);
});

socket.on("connect_error", (error) => {
    console.log("Connection Error:", error.message);
});

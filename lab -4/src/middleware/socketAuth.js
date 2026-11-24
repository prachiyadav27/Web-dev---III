
const jwt = require("jsonwebtoken");

function authenticateSocket(socket, next) {

    const token = socket.handshake.auth?.token;

    if (!token) {
        return next(new Error("Authentication token required"));
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        socket.user = decoded;

        next();

    } catch (error) {

        next(new Error("Invalid or expired token"));

    }
}

module.exports = { authenticateSocket };

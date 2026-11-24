
const jwt = require("jsonwebtoken");

// JWT TOKEN VERIFICATION
function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    // Extract Bearer token
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Invalid token format"
        });
    }

    try {

        // Verify JWT token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store user information
        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }
}


// ROLE BASED ACCESS CONTROL (RBAC)
function authorizeRoles(...allowedRoles) {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {

            return res.status(403).json({
                message: "Access denied: insufficient permissions"
            });

        }

        next();
    };
}


module.exports = {
    authenticateToken,
    authorizeRoles
};

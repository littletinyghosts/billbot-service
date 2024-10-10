const jwt = require('jsonwebtoken');
// JWT secret key
const jwtSecret = 'your_jwt_secret_key';

// Middleware function to validate JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization']; // Get token from header

    if (!token) {
        return res.status(403).send({
            message: 'No token provided!',
        });
    }

    // Verify token
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!',
            });
        }

        // Save user ID for future use in requests
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;

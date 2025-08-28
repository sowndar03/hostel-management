const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, "SECRET_KEY");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(404).json({ message: "Invalid or expired token" });
    }
}

module.exports = {
    AuthMiddleware,
}
// server/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

// Middleware to protect Express routes
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ msg: "Invalid token payload" });
    }

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};

// Helper for verifying tokens outside of middleware (e.g., in Socket.io)
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

export default authMiddleware;

import { decodedJWT } from "../service/decodedJWT.service.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
  const decoded = decodedJWT(token);
  if (!decoded) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  req.user = decoded;
  next();
};

export const roleMiddleware =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Permission denied" });
    }
    next();
  };

//(...roles): co the truyen vao 1 mang chua nhieu role

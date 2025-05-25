import { decodedJWT } from "../service/decodedJWT.service.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided in auth.middleware.js",
    });
  }
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided in auth.middleware.js",
    });
  }
  const decoded = decodedJWT(token);
  if (!decoded) {
    return res.status(401).json({
      message: "Unauthorized in auth.middleware.js",
    });
  }
  if (decoded.role === "admin" || decoded.role === "member") {
    req.user = decoded;
    return next();
  }
  return res.status(403).json({
    message: "Permission denied in auth.middleware.js",
  });
};

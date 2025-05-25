import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createJWT = (userCurrent) => {
  const token = jwt.sign(
    {
      id: userCurrent._id,
      username: userCurrent.username,
      role: userCurrent.role,
    },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "1h" }
  );
  return token;
};

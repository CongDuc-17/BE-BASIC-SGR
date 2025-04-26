import jwt from "jsonwebtoken";

export const createJWT = (userCurrent) => {
  const token = jwt.sign(
    { id: userCurrent._id, username: userCurrent.username },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "1h" }
  );
  return token;
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return; // Ensure the function stops executing after sending the response
  }

  try {
    let jwtSecret = "your_secret_key";
    const decoded = jwt.verify(token, jwtSecret as string);
    (req as any).user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: "Invalid token." });
  }
};

export default authenticate;

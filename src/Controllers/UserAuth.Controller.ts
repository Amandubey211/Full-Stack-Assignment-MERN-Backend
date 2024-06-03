import { Request, Response } from "express";
import User from "../Models/user.model";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export const validateRegister = [
  body("name").not().isEmpty().escape().withMessage("name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 6 characters long"),
];

export const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User registered" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error registering new user", error });
  }
};

export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),
  body("password").not().isEmpty().withMessage("Password is required"),
];

export const loginUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      "your_secret_key", // Replace 'your_secret_key' with your actual secret key
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "User logged in",
      token,
      user: { email: user.email, name: user.name },
    }); // No need to send token in response body
  } catch (error) {
    res.status(500).json({ success: false, message: "Login error" });
  }
};

export const UserValidate = (req: Request, res: Response): Response | void => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key"); // Use your actual secret key
    return res.json({ success: true, message: "Authenticated", data: decoded });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

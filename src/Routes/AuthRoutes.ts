import express from "express";
import {
  loginUser,
  registerUser,
  validateLogin,
  validateRegister,
  UserValidate,
} from "../Controllers/UserAuth.Controller";

const AuthRouter = express.Router();

AuthRouter.post("/register", validateRegister, registerUser);
AuthRouter.post("/login", validateLogin, loginUser);
AuthRouter.get("/validate", UserValidate);

export default AuthRouter;

import dotenv from "dotenv";
dotenv.config(); // Load environment variables as early as possible

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { FRONTEND_URL, PORT } from "./config";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL || "https://full-stack-assignment-mern.onrender.com",
  })
);
console.log(FRONTEND_URL, process.env.PORT); // Check if variables are loaded correctly
app.use(cookieParser());

import AuthRouter from "./Routes/AuthRoutes";
import InvoiceRouter from "./Routes/InvoiceRoute";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Use routes
app.use("/api/auth", AuthRouter);
app.use("/api/invoice", InvoiceRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

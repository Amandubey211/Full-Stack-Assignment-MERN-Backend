import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { FRONTEND_URL } from "./config";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
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

export default app;

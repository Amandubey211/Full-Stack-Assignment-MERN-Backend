import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// Initialize express app
const app = express();

// Use middleware to parse JSON
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(cookieParser());
// Import routes
import AuthRouter from "./Routes/AuthRoutes";
import InvoiceRouter from "./Routes/InvoiceRoute";

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// Use routes
app.use("/api/auth", AuthRouter);
app.use("/api/invoice", InvoiceRouter);

export default app;

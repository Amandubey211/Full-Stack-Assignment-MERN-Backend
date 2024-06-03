import { Router } from "express";
import { GenerateInvoice } from "../Controllers/Invoice.Controller";
import authenticate from "../Middleware/Auth";

const InvoiceRouter = Router();

// Generate PDF invoice with authentication
InvoiceRouter.post("/generate_invoice", authenticate, GenerateInvoice);

export default InvoiceRouter;

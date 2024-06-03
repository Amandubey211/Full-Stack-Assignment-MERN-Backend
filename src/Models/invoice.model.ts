import { Schema, model } from "mongoose";

interface Product {
  name: string;
  qty: number;
  rate: number;
}

interface Invoice {
  products: Product[];
  total: number;
}

const productSchema = new Schema<Product>({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  rate: { type: Number, required: true },
});

const invoiceSchema = new Schema<Invoice>({
  products: { type: [productSchema], required: true },
  total: { type: Number, required: true },
});

export default model<Invoice>("Invoice", invoiceSchema);

import dotenv from "dotenv";
dotenv.config();
export const DB_URL =
  process.env.DB_URL ||
  "mongodb+srv://amandubey8833:bvhqmQUTUzMlt1uk@mernassignment.hqgjjlm.mongodb.net/?retryWrites=true&w=majority&appName=MERNassignment";
export const PORT = process.env.PORT || 6000;
export const JWT_SECRET =
  process.env.JWT_SECRET || "sdfsdfsdfswdheqwegrtwergfg";
export const FRONTEND_URL = process.env.FRONTEND_URL;

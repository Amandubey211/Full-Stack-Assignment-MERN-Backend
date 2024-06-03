import { Request, Response } from "express";
import Invoice from "../Models/invoice.model";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

// Utility function to calculate total
const calcTotal = (qty: number, rate: number): string => {
  return (qty * rate).toFixed(2);
};

interface Product {
  name: string;
  qty: number;
  rate: number;
}

const getBase64Image = (filePath: string): string => {
  const bitmap = fs.readFileSync(filePath);
  return Buffer.from(bitmap).toString("base64");
};

export const GenerateInvoice = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { products }: { products: Product[] } = req.body;
  const total = products.reduce(
    (acc: number, product: Product) => acc + product.qty * product.rate,
    0
  );
  const grandTotal = (total * 1.18).toFixed(2); // Assuming 18% GST
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30); // Valid for 30 days

  try {
    const invoice = new Invoice({ products, total });
    await invoice.save();

    const logoBase64 = getBase64Image(
      path.join(__dirname, "../Asset/logo.png")
    );

    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice Generator</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            color: #333;
            position: relative;
            min-height: 100vh;
          }
          .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            padding-bottom: 100px; /* for footer spacing */
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .header h1 {
            font-size: 24px;
            margin: 0;
          }
          .header img {
            width: 200px; 
            height: auto;
          }
          .header p {
            margin: 0;
            font-size: 12px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            margin-bottom: 20px;
          }
          .table th, .table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          .table th {
            font-weight: bold;
          }
          .table .highlight {
            color: #4A90E2;
          }
          .totals {
            text-align: right;
            margin-top: 20px;
          }
          .totals div {
            margin-bottom: 10px;
          }
          .totals .grand-total {
            font-weight: bold;
            font-size: 16px;
            margin-top: 10px;
          }
          .totals .grand-total .amount {
            color: #4A90E2;
            font-size: 20px;
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
          }
          .terms {
            background-color: #000;
            color: #fff;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1>INVOICE GENERATOR</h1>
              <p>Sample Output should be this</p>
            </div>
            <img src="data:image/png;base64,${logoBase64}" alt="Levitation Infotech">
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${products
                .map(
                  (product) => `
                    <tr>
                      <td>${product.name}</td>
                      <td class="highlight">${product.qty}</td>
                      <td>${product.rate}</td>
                      <td>INR ${calcTotal(product.qty, product.rate)}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
          <div class="totals">
            <div>Total: INR ${total.toFixed(2)}</div>
          
            <div>GST: 18%</div>
            <br/>
            <hr/>
            <div class="grand-total">Grand Total: <span class="amount">₹ ${grandTotal}</span></div>
            <br/>
            <hr/>
          </div>
          <div class="footer">
            <div>Valid until: ${validUntil.toLocaleDateString()}</div>
          </div>
          <div class="terms">
            <h3>Terms and Conditions</h3>
            <p>We are happy to supply any further information you may need and trust that you call on us to fill your order, which will receive our prompt and careful attention.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlTemplate);
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=invoice.pdf",
    });

    res.status(201).send(pdfBuffer);
  } catch (err) {
    const error = err as Error; // Explicitly cast to Error type
    res.status(500).send({ error: error.message });
  }
};

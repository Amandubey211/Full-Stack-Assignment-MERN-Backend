import app from "./app";
import connectDB from "./DBConfig/mongoConnection";
import { PORT } from "./config";

const startServer = async () => {
  await connectDB();
  app.listen(Number(PORT), () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();

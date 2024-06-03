import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://amandubey8833:bvhqmQUTUzMlt1uk@mernassignment.hqgjjlm.mongodb.net/?retryWrites=true&w=majority&appName=MERNassignment"
      // {
      //   //   useNewUrlParser: true,
      //   //   useUnifiedTopology: true,
      // }
    );
  } catch (error) {
    console.error("MongoDB connection error:");
    process.exit(1);
  }
};

export default connectDB;

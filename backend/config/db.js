import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {

  try {

    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

  } catch (error) {

    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);

  }

};

export default connectDB;
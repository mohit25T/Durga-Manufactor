import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash("Durga@2010", 10);

    const admin = await Admin.create({
      email: "durgamanufactures083@gmail.com",
      password: hashedPassword
    });

    console.log("Admin created successfully");
    console.log(admin);

    process.exit();

  } catch (error) {

    console.error(error);
    process.exit(1);

  }
};

createAdmin();
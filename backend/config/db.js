import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {

  try {

    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    // Programmatically drop leftover 'sku_1' index
    try {
      const db = mongoose.connection.db;
      if (db) {
        const collections = await db.listCollections({ name: "products" }).toArray();
        if (collections.length > 0) {
          const indexes = await db.collection("products").indexes();
          const hasSkuIndex = indexes.some(idx => idx.name === "sku_1");
          if (hasSkuIndex) {
            await db.collection("products").dropIndex("sku_1");
            console.log("✅ Successfully dropped leftover unique index 'sku_1' from 'products' collection");
          }
        }
      }
    } catch (indexError) {
      console.warn("⚠️ Warning: Could not check/drop leftover 'sku_1' index:", indexError.message);
    }

  } catch (error) {

    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);

  }

};

export default connectDB;
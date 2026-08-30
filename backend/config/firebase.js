import admin from "firebase-admin";

let firebaseInitialized = false;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    firebaseInitialized = true;
    console.log("✅ Firebase Admin initialized successfully");
  } else {
    console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT environment variable is not set. Push notifications will be disabled.");
  }
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin:", error.message);
}

export { firebaseInitialized };
export default admin;

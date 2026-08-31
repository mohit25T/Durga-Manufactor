import admin from "firebase-admin";

let firebaseInitialized = false;

try {
  const rawEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (rawEnv && rawEnv.trim().length > 0) {
    let serviceAccount;
    if (typeof rawEnv === "string") {
      try {
        serviceAccount = JSON.parse(rawEnv);
      } catch (parseErr) {
        const sanitized = rawEnv.replace(/[\r\n]+/g, " ");
        serviceAccount = JSON.parse(sanitized);
      }
    } else {
      serviceAccount = rawEnv;
    }

    if (serviceAccount && serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
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

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import fs from 'fs';

// Firebase configuration from src/firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyAhzmKNjZ6z6EeeCyclLxvbKMc-TjKd7Qg",
  authDomain: "sweeto-tech.firebaseapp.com",
  projectId: "sweeto-tech",
  storageBucket: "sweeto-tech.firebasestorage.app",
  messagingSenderId: "936837153970",
  appId: "1:936837153970:web:fc427301fe6cb9c48175ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Read db.json
const dbPath = './backend/db.json';
if (!fs.existsSync(dbPath)) {
    console.error("❌ db.json not found at " + dbPath);
    process.exit(1);
}

const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

async function migrate() {
    console.log("🔐 Authenticating as admin...");
    try {
        await signInWithEmailAndPassword(auth, "SWEETO@SWEETO.COM", "chibuikekene");
        console.log("✅ Authenticated successfully");
    } catch (authError) {
        console.error("❌ Authentication failed:", authError.message);
        process.exit(1);
    }

    console.log("🚀 Starting migration to Firestore...");

    try {
        // 1. Settings (main doc)
        if (dbData.storeSettings && dbData.storeSettings.length > 0) {
            const settings = dbData.storeSettings[0];
            const { id: _, ...settingsBody } = settings;
            await setDoc(doc(db, "storeSettings", "main"), settingsBody);
            console.log("✅ Store settings migrated");
        }

        // 2. Categories
        if (dbData.categories) {
            console.log(`📝 Migrating ${dbData.categories.length} categories...`);
            for (const cat of dbData.categories) {
                const { id, ...body } = cat;
                await setDoc(doc(db, "categories", String(id)), { ...body, id: String(id) });
            }
            console.log("✅ Categories migrated");
        }

        // 3. Products
        if (dbData.products) {
            console.log(`📝 Migrating ${dbData.products.length} products...`);
            for (const prod of dbData.products) {
                const { id, ...body } = prod;
                await setDoc(doc(db, "products", String(id)), { ...body, id: String(id) });
            }
            console.log("✅ Products migrated");
        }

        // 4. Sales Records
        if (dbData.salesRecords) {
            console.log(`📝 Migrating ${dbData.salesRecords.length} sales records...`);
            for (const sale of dbData.salesRecords) {
                const { id, ...body } = sale;
                await setDoc(doc(db, "salesRecords", String(id)), { ...body, id: String(id) });
            }
            console.log("✅ Sales records migrated");
        }

        // 5. Stock Adjustments
        if (dbData.stockAdjustments) {
            console.log(`📝 Migrating ${dbData.stockAdjustments.length} stock adjustments...`);
            for (const adj of dbData.stockAdjustments) {
                const { id, ...body } = adj;
                await setDoc(doc(db, "stockAdjustments", String(id)), { ...body, id: String(id) });
            }
            console.log("✅ Stock adjustments migrated");
        }

        console.log("\n🎉 MIGRATION COMPLETE! All data is now in the cloud.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        console.log("\n💡 TIP: Ensure your Firestore Rules are set to 'allow read, write: if true;' temporarily.");
        process.exit(1);
    }
}

migrate();

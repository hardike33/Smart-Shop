import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAMItvGsrD_IZpMB3EGA52K3dI1oMgp4u0",
    authDomain: "smartshop-eaf23.firebaseapp.com",
    projectId: "smartshop-eaf23",
    storageBucket: "smartshop-eaf23.firebasestorage.app",
    messagingSenderId: "122595043770",
    appId: "1:122595043770:web:d7a8c3e8f8a2b1c0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Force Google to show the account selection screen every time
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export const signInWithGoogle = async () => {
    try {
        console.log("🔥 Firebase: Starting Google Sign-In Popup...");
        if (!auth) {
            throw new Error("Firebase Auth is not initialized!");
        }
        const result = await signInWithPopup(auth, googleProvider);
        console.log("✅ Firebase: Sign-In Success!", result.user.email);
        return result.user;
    } catch (error: any) {
        console.error("❌ Firebase Auth Popup Error:", error.code, error.message);

        if (error.code === 'auth/popup-blocked') {
            console.warn("⚠️ Popup was blocked by the browser. Suggest trying Redirect.");
        }
        throw error;
    }
};

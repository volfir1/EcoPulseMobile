import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase"; // Adjust the path if needed

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user; // Returns the signed-in user
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getAuthInstance } from "../firebase";
import { getApiClient } from "./api";

export const login = async (email: string, password: string) => {
  const auth = getAuthInstance();

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  const token = await user.getIdToken();

  return token;
};

export const validateToken = async () => {
  const response = await getApiClient().get("/auth/validate");
  return response.data;
};

export const logout = async () => {
  const auth = getAuthInstance();
  await signOut(auth);
  localStorage.removeItem("token");
};

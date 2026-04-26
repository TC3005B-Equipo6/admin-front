import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import api from "./api";

export const login = async (email: string, password: string) => {
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
  const response = await api.get("/auth/validate");
  return response.data;
};

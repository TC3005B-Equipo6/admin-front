import { isAxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { AppConfigError } from "../../errors/AppConfigError";
import { login, validateToken } from "../../services/authService";
import styles from "./Login.module.css";

export default function LoginScreen() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = user.trim();

    if (!email || !password) {
      setError("Upsi! Completa todos los campos");
      return;
    }

    try {
      setError("");

      const token = await login(email, password);

      localStorage.setItem("token", token);
      await validateToken();

      navigate("/home");
    } catch (error: unknown) {
      if (error instanceof AppConfigError) {
        if (import.meta.env.DEV) {
          console.error(error);
        }

        setError("Upsi! No fue posible iniciar sesión en este momento");
        return;
      }

      if (error instanceof FirebaseError) {
        if (
          error.code === "auth/invalid-credential" ||
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          setError("Upsi! Correo o contraseña incorrectos");
          return;
        }
      }

      if (isAxiosError(error) && error.response?.status === 401) {
        setError("Upsi! Token inválido");
      } else {
        setError("Upsi! Ocurrió un error");
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.left}>
          <img src="/move360.png" alt="move360" className={styles.logo} />

          <h1>BIENVENIDO</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              label="Correo"
              type="email"
              autoComplete="username"
              placeholder="ejemplo@move360.com"
              value={user}
              onChange={(e) => setUser(e.currentTarget.value)}
            />

            <Input
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              showPasswordToggle
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />

            {error && <p className={styles.error}>{error}</p>}

            <Button type="submit" label="INICIAR SESIÓN" />

            <p className={styles.forgot}>¿Olvidaste tu contraseña?</p>
          </form>
        </div>

        <div className={styles.right}></div>
      </div>
    </div>
  );
}

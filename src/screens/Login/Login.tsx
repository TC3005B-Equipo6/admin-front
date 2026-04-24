import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import styles from "./Login.module.css";
import { login } from "../../services/authService";

export default function LoginScreen() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => { e.preventDefault();

    if (!user || !password) {
      setError("Completa todos los campos");
      return;
    }

    try {
      setError("");

      const token = await login(user, password);

      localStorage.setItem("token", token);

      navigate("/home");
    } catch {
      setError("Usuario o contraseña incorrectos");
    } finally {
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.left}>
          <img
            src="/move360.png"
            alt="move360"
            className={styles.logo}
          />

          <h1>BIENVENIDO</h1>

          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >
            <Input
              label="Usuario"
              placeholder="ejemplo@move360.com"
              value={user}
              onChange={(e) =>
                setUser(e.currentTarget.value)}
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) =>
              setPassword(e.currentTarget.value)}
            />

            {error && (
              <p className={styles.error}>
                {error}
              </p>
            )}

            <Button type="submit" 
            label={"INICIAR SESIÓN"}
            />

            <p>   ¿Olvidaste tu contraseña?</p>
          </form>
        </div>
        <div className={styles.right}></div>
      </div>
    </div>
  );
}
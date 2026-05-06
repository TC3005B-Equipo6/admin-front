import { isAxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { AppConfigError } from "../../errors/AppConfigError";
import { login, validateToken } from "../../services/authService";

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
    <div className="min-h-screen w-screen bg-[#6E7791] flex justify-center items-center p-8 box-border">
      <div className="w-[1080px] max-w-full h-[640px] bg-white rounded-[28px] overflow-hidden grid grid-cols-[48%_52%]">
        <div className="pt-[34px] pb-[34px] px-[58px] flex flex-col">
          <img src="/move360.png" alt="move360" className="w-[145px] mb-[70px]" />

          <h1 className="w-full max-w-[330px] font-[Inter,sans-serif] text-[50px] font-bold leading-none text-black m-0 mb-[42px] text-center">
            BIENVENIDO
          </h1>

          <form className="w-full max-w-[330px] relative" onSubmit={handleSubmit}>
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

            {error && (
              <p className="text-center text-[15px] text-[#d92d20] font-medium mt-1 mb-0">
                {error}
              </p>
            )}

            <Button
              type="submit"
              label="INICIAR SESIÓN"
              className="!w-[180px] !h-[48px] !rounded-[14px] !block mx-auto mt-5"
            />

            <p className="text-center text-[15px] font-bold text-[#6E7791] cursor-pointer mt-[15px] mx-auto mb-0">
              ¿Olvidaste tu contraseña?
            </p>
          </form>
        </div>

        <div className="bg-[url('/city.png')] bg-cover bg-center bg-no-repeat"></div>
      </div>
    </div>
  );
}

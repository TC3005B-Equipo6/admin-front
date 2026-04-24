import { useId, useState, type InputHTMLAttributes } from "react";
import { icons } from "../../icons";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
  showPasswordToggle?: boolean;
}

export function Input({
  label,
  className = "",
  id,
  type,
  showPasswordToggle = false,
  ...props
}: InputProps) {
  const generatedId = useId();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordField = type === "password";
  const canTogglePassword = isPasswordField && showPasswordToggle;
  const inputType =
    canTogglePassword && isPasswordVisible ? "text" : type;
  const PasswordIcon = isPasswordVisible ? icons.eyeOff : icons.eyeOn;
  const inputId = id ?? generatedId;

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>

      <div className={styles.field}>
        <input
          {...props}
          id={inputId}
          type={inputType}
          className={[
            styles.input,
            canTogglePassword ? styles.inputWithToggle : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {canTogglePassword && (
          <button
            type="button"
            className={styles.toggleButton}
            aria-label={
              isPasswordVisible
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
            aria-pressed={isPasswordVisible}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() =>
              setIsPasswordVisible((currentValue) => !currentValue)
            }
          >
            <PasswordIcon aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

import { useId, useState, type InputHTMLAttributes } from "react";
import { icons } from "../../icons";

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

  const inputClasses = [
    "w-full border border-black rounded-lg px-3 py-[10px] text-base font-[Inter,sans-serif] bg-white text-black outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#6E7791] placeholder:text-[#888888]",
    canTogglePassword ? "pr-12" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full mb-6 flex flex-col">
      <label
        className="mb-1.5 text-base font-medium text-[#1f1f1f] font-[Inter,sans-serif]"
        htmlFor={inputId}
      >
        {label}
      </label>

      <div className="relative flex items-center">
        <input
          {...props}
          id={inputId}
          type={inputType}
          className={inputClasses}
        />

        {canTogglePassword && (
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 inline-flex items-center justify-center p-0 border-0 bg-transparent text-[#6E7791] cursor-pointer hover:text-[#56607c] focus-visible:outline-2 focus-visible:outline-[#6E7791] focus-visible:outline-offset-4 focus-visible:rounded"
            aria-label={
              isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            aria-pressed={isPasswordVisible}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() =>
              setIsPasswordVisible((currentValue) => !currentValue)
            }
          >
            <PasswordIcon aria-hidden="true" size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

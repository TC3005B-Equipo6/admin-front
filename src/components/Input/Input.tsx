import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  className?: string;
};

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>

      <input
        {...props}
        className={[styles.input, className].filter(Boolean).join(" ")}
      />
    </div>
  );
}
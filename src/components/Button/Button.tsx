import styles from "./Button.module.css";

export interface ButtonProps {
  variant?: "blue" | "red" | "white";
  size?: "small" | "medium" | "large";
  onPress?: () => void;
  label?: string;
  type?: "button" | "submit" | "reset";
}

export const Button = ({
  variant = "blue",
  size = "medium",
  onPress,
  label = "New Task +",
  type = "button",
}: ButtonProps) => {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} onClick={onPress}>
      {label}
    </button>
  );
};
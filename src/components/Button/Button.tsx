export interface ButtonProps {
  variant?: "blue" | "red" | "white";
  size?: "small" | "medium" | "large";
  onPress?: () => void;
  label?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const Button = ({
  variant = "blue",
  size = "medium",
  onPress,
  label = "New Task +",
  type = "button",
  className = "",
}: ButtonProps) => {
  const base =
    "rounded-lg inline-flex items-center justify-center cursor-pointer transition-[opacity,transform] duration-200 font-[Inter,sans-serif] hover:opacity-90";

  const variants: Record<string, string> = {
    blue: "bg-[#6E7791] text-white font-medium",
    red: "bg-[#ef2b2d] text-white font-medium",
    white: "bg-white text-[#5b6575] border border-[#9CA3AF] font-medium",
  };

  const sizes: Record<string, string> = {
    small: "",
    medium: "px-5 py-[11px] text-sm w-[100px] h-10",
    large: "px-6 py-3 text-base w-[200px] h-[60px]",
  };

  const classes = [base, variants[variant], sizes[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} onClick={onPress}>
      {label}
    </button>
  );
};

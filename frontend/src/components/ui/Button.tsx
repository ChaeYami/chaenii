import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "default" | "primary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  default:
    "border border-purple/40 text-purple bg-purple/15 hover:bg-purple/25 hover:border-purple/60",
  primary:
    "bg-purple/80 text-white hover:bg-purple/70 backdrop-blur-sm",
  ghost:
    "text-text-secondary hover:text-text-primary hover:bg-surface",
  danger:
    "border border-red-500/30 text-red-400/80 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium
          transition-all duration-200 ease-out
          disabled:pointer-events-none disabled:opacity-50
          ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;

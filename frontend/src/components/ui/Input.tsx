import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-lg border border-border bg-surface px-4 py-2.5
          text-sm text-text-primary placeholder:text-text-muted
          transition-colors duration-150
          focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple/30
          ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;

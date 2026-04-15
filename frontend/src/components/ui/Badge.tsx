import { HTMLAttributes, forwardRef } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-md bg-surface-2 px-2.5 py-0.5
          font-mono text-xs font-medium text-[#DBB3C4]
          ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
export default Badge;

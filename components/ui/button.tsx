import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "teal";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variantStyles = {
      default: "bg-teal-500 text-slate-950 hover:bg-teal-400 font-semibold shadow-sm hover:shadow-teal-500/20 active:scale-[0.99]",
      teal: "bg-teal-500 text-slate-950 hover:bg-teal-400 font-semibold shadow-sm hover:shadow-teal-500/20 active:scale-[0.99]",
      outline: "border border-slate-700 bg-slate-900/60 hover:bg-slate-800 hover:text-white text-slate-200",
      secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white",
      ghost: "hover:bg-slate-800/80 hover:text-white text-slate-300",
      destructive: "bg-rose-600 text-white hover:bg-rose-500 font-medium",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-11 rounded-lg px-6 text-base font-semibold",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };

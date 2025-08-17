import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Button variants using class-variance-authority for type-safe styling
const buttonVariants = cva(
  // Base styles that apply to all buttons
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        // Primary button for main actions
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // Secondary button for less important actions
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Destructive button for dangerous actions
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Outline button for subtle actions
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        // Ghost button for minimal styling
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // Link button that looks like a link
        link: "text-primary underline-offset-4 hover:underline",
        // Success button for positive actions
        success: "bg-green-600 text-white hover:bg-green-700",
        // Warning button for caution actions
        warning: "bg-yellow-600 text-white hover:bg-yellow-700",
      },
      size: {
        // Extra small for compact spaces
        xs: "h-7 px-2 text-xs",
        // Small for secondary actions
        sm: "h-8 px-3 text-xs",
        // Default size for most buttons
        default: "h-10 px-4 py-2",
        // Large for prominent actions
        lg: "h-11 px-8",
        // Extra large for hero sections
        xl: "h-12 px-10 text-base",
      },
    },
    // Default variants
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Props interface extending HTML button props and our variants
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // Optional loading state
  loading?: boolean;
  // Optional icon to show before text
  leftIcon?: React.ReactNode;
  // Optional icon to show after text
  rightIcon?: React.ReactNode;
}

// Button component with forwardRef for proper ref handling
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {/* Left icon (shown when not loading) */}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        
        {/* Button text */}
        {children}
        
        {/* Right icon */}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

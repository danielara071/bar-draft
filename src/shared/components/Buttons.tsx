
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const sizes = {
  sm: "px-6 py-2 text-xs",
  md: "px-10 py-4 text-sm",
  lg: "px-14 py-5 text-base",
};

export const PrimaryButton = ({ onClick, children, className = "", size = "md", disabled = false }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${sizes[size]} rounded-full bg-brand-crimson text-white font-bold tracking-wide hover:brightness-110 active:scale-95 transition-all duration-150 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ onClick, children, className = "", size = "md", disabled = false }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${sizes[size]} rounded-full bg-brand-yellow text-black font-bold tracking-wide hover:brightness-105 active:scale-95 transition-all duration-150 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);

export const LoginButton = ({ onClick, children, className = "", size = "md", disabled = false }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${sizes[size]} rounded-full bg-brand-navy text-white font-medium tracking-wide hover:brightness-110 active:scale-95 transition-all duration-150 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);
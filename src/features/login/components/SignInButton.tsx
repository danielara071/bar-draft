type SignInButtonProps = {
  onClick: () => void | Promise<void>;
  label: string;
  logoSrc: string;
  logoAlt: string;
  className: string;
  logoClassName?: string;
};

const SignInButton = ({
  onClick,
  label,
  logoSrc,
  logoAlt,
  className,
  logoClassName = "h-5 w-5",
}: SignInButtonProps) => {
  return (
    <button type="button" onClick={onClick} className={className}>
      <img src={logoSrc} alt={logoAlt} className={logoClassName} />
      {label}
    </button>
  );
};

export default SignInButton;

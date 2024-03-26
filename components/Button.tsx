interface ButtonProps {
  onClick: () => void; // Function that doesn't take arguments and doesn't return anything
  children: any; // Accepts any type of content
}

const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button className="w-full" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

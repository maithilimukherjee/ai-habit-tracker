import "../../styles/button.css"
function Button({
  children,
  onClick,
  type = "button",
  variant = "primary"
}) {

  return (
    <button
      type={type}
      onClick={onClick}
      className={`custom-button ${variant}`}
    >
      {children}
    </button>
  );

}

export default Button;
import clsx from "clsx"; // Replace 'cn' with 'clsx' for className concatenation
import PropTypes from "prop-types";

const Button = ({
  variant = "default",
  className,
  children,
  type = "button",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38b2c8]";

  const variants = {
    default:
      "bg-[#38b2c8] text-white hover:bg-[#2a8896] hover:shadow-[0_0_15px_rgba(56,178,200,0.5)]",
    outline:
      "border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10",
    gradient:
      "bg-gradient-to-r from-[#ff3366] to-[#ff3366]/80 text-white hover:from-[#ff3366]/90 hover:to-[#ff3366]/70",
  };

  return (
    <button
      type={type}
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(["default", "outline", "gradient"]),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
};

export default Button;

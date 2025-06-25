import { cn } from "../lib/utils";

const AboutValue = ({
  title,
  description,
  icon,
  colorClass,
  delay,
  isVisible,
}) => {
  return (
    <div
      className={cn(
        "bg-[#161a2c]/30 backdrop-blur-md rounded-lg p-6 border border-white/10 transition-all duration-700",
        `bg-gradient-to-r ${colorClass}`,
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default AboutValue;

import { useEffect, useState } from "react";

export const StarBackground = () => {
  const [stars, setStars] = useState([]);
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    generateStars();
    generateMeteors();

    const handleResize = () => {
      generateStars();
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const generateStars = () => {
    const numberOfStars = Math.floor(
      (window.innerWidth * window.innerHeight) / 10000
    );

    const newStars = [];

    for (let i = 0; i < numberOfStars; i++) {
      newStars.push({
        id: i,
        size: Math.random() * 3 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.5,
        animationDuration: Math.random() * 4 + 2,
      });
    }

    setStars(newStars);
  };

  const generateMeteors = () => {
    const numberOfMeteors = 4;
    const newMeteors = [];

    for (let i = 0; i < numberOfMeteors; i++) {
      newMeteors.push({
        id: i,
        size: Math.random() * 2 + 1,
        x: Math.random() * 100,
        y: Math.random() * 20,
        delay: Math.random() * 15,
        animationDuration: Math.random() * 3 + 3,
      });
    }

    setMeteors(newMeteors);
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star animate-pulse-subtle bg-white rounded-full absolute"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            animationDuration: `${star.animationDuration}s`,
            backgroundColor: "#ffffff", // Fallback for bg-white
          }}
        />
      ))}

      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          className="meteor animate-meteor bg-gradient-to-r from-white to-transparent absolute"
          style={{
            width: `${meteor.size * 50}px`,
            height: `${meteor.size * 2}px`,
            left: `${meteor.x}%`,
            top: `${meteor.y}%`,
            animationDelay: `${meteor.delay}s`,
            animationDuration: `${meteor.animationDuration}s`,
            background: "linear-gradient(to right, #ffffff, transparent)", // Fallback for bg-gradient-to-r
            transform: "rotate(-45deg)", // Ensure meteor has a diagonal trajectory
          }}
        />
      ))}
    </div>
  );
};

export default StarBackground;

// Note: Ensure `animate-pulse-subtle` and `animate-meteor` are defined in `tailwind.config.js` or CSS:
// tailwind.config.js example:
// ```
// module.exports = {
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {
//       animation: {
//         'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//         'meteor': 'meteor 5s linear infinite',
//       },
//       keyframes: {
//         'pulse-subtle': {
//           '0%, 100%': { opacity: 1 },
//           '50%': { opacity: 0.5 },
//         },
//         meteor: {
//           '0%': { transform: 'translate(0, 0) rotate(-45deg)', opacity: 1 },
//           '100%': { transform: 'translate(300px, 300px) rotate(-45deg)', opacity: 0 },
//         },
//       },
//     },
//   },
//   plugins: [],
// };
// ```

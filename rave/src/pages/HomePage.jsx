import { useEffect, useState, useRef } from "react";
import { cn } from "../lib/utils";

const HomePage = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const words = ["music", "culture", "vibes", "GenZ"];


  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamic text rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % words.length);
    }, 3000); // Change word every 3 seconds

    return () => clearInterval(interval);
  }, [words.length]);

  // Star and meteor animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Stars configuration
    const stars = [];
    const starCount = Math.floor((dimensions.width * dimensions.height) / 3000);

    // Create stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        pulse: Math.random() * 0.1,
        pulseFactor: Math.random() < 0.5 ? 1 : -1,
      });
    }

    // Meteors configuration
    const meteors = [];
    const maxMeteors = 8;

    // Function to create a new meteor
    const createMeteor = () => {
      if (meteors.length < maxMeteors && Math.random() < 0.03) {
        const startX =
          Math.random() * dimensions.width * 1.5 - dimensions.width * 0.25;
        meteors.push({
          x: startX,
          y: -100,
          length: Math.random() * 150 + 50,
          speed: Math.random() * 10 + 5,
          angle:
            Math.PI / 4 +
            ((Math.random() * Math.PI) / 8) *
              (startX > dimensions.width / 2 ? -1 : 1),
          opacity: Math.random() * 0.6 + 0.4,
        });
      }
    };

    // Animation loop
    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star) => {
        star.opacity += star.pulse * star.pulseFactor;
        if (star.opacity > 1 || star.opacity < 0.2) {
          star.pulseFactor *= -1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      // Create new meteors randomly
      createMeteor();

      // Draw and update meteors
      meteors.forEach((meteor, index) => {
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);

        const endX = meteor.x + Math.cos(meteor.angle) * meteor.length;
        const endY = meteor.y + Math.sin(meteor.angle) * meteor.length;

        const gradient = ctx.createLinearGradient(
          meteor.x,
          meteor.y,
          endX,
          endY
        );
        gradient.addColorStop(0, `rgba(56, 178, 200, ${meteor.opacity})`);
        gradient.addColorStop(1, "rgba(56, 178, 200, 0)");

        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;

        if (
          meteor.y > dimensions.height ||
          meteor.x < 0 ||
          meteor.x > dimensions.width
        ) {
          meteors.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [dimensions]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0d16]">
      {/* Canvas for stars and meteors */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#0a0d16]/10 to-[#0a0d16]/60 pointer-events-none" />

      {/* Main content */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        <section className="text-center mt-12 md:mt-24">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            OUTSYDCVLTR{" "}
            <span className="text-[#38b2c8]">a cosmic journey of</span>
            <br />
            <span
              className="inline-block relative dynamic-text-wrapper text-[#38b2c8] font-normal text-4xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: '"Grand Duke", sans-serif' }}
            >
              {words.map((word, index) => (
                <span
                  key={word}
                  className={cn(
                    "dynamic-text absolute left-0",
                    index === activeWordIndex
                      ? "dynamic-text-active"
                      : "dynamic-text-inactive"
                  )}
                >
                  {word}
                </span>
              ))}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            A global collective shaping youth culture, through entertainment and
            media.
          </p>
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              className={cn(
                "px-8 py-3 rounded-full text-lg font-medium",
                "bg-[#38b2c8] text-white hover:bg-[#2a8896]",
                "shadow-lg shadow-[#38b2c8]/20",
                "transition-all duration-300"
              )}
            >
              Explore Music
            </button>
            <button
              className={cn(
                "px-8 py-3 rounded-full text-lg font-medium",
                "bg-transparent border-2 border-[#38b2c8] text-[#38b2c8]",
                "hover:bg-[#38b2c8]/10",
                "transition-all duration-300"
              )}
            >
              Discover Events
            </button>
          </div>
        </section>

       
        <section className="mt-24 md:mt-36">
          
        </section>
      </main>
    </div>
  );
};

export default HomePage;

// CSS for dynamic text animation
const styles = `
  .dynamic-text-wrapper {
    display: inline-block;
    position: relative;
    min-width: 100px; /* Adjust based on longest word */
    height: 1em;
  }
  .dynamic-text {
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .dynamic-text-active {
    opacity: 1;
    transform: translateY(0);
  }
  .dynamic-text-inactive {
    opacity: 0;
    transform: translateY(20px);
    position: absolute;
  }
`;

// Inject styles into the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

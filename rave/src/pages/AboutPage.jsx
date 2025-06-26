import { useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import Vd1 from "../assets/img/Ou.mp4";
import Vd2 from "../assets/img/Outsydcvltr  (4).mp4";
import Vd3 from "../assets/img/Outsydcvltr .mp4";

const AboutPage = () => {
  // Canvas animation for meteors and starlights
  useEffect(() => {
    const canvas = document.getElementById("starlightCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = [];
    const meteors = [];

    // Create stars
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.01,
      });
    }

    // Create meteors
    for (let i = 0; i < 5; i++) {
      meteors.push({
        x: Math.random() * canvas.width,
        y: -10,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.5,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars with twinkling effect
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;
      });

      // Draw meteors
      meteors.forEach((meteor) => {
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - meteor.length, meteor.y + meteor.length);
        ctx.strokeStyle = `rgba(255, 255, 255, ${meteor.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        meteor.y += meteor.speed;
        meteor.x -= meteor.speed * 0.5;
        if (meteor.y > canvas.height || meteor.x < 0) {
          meteor.x = Math.random() * canvas.width;
          meteor.y = -10;
          meteor.speed = Math.random() * 2 + 1;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0d16]">
      {/* Starlight Canvas */}
      <canvas
        id="starlightCanvas"
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      ></canvas>

      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center text-center z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="../assets/aboutvid/aboutVid.mp4"
        >
          Your browser does not support the video tag.
        </video>
        <div className="relative px-4 backdrop-blur-sm bg-[#0a0d16]/30 py-8 rounded-lg z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            About <span className="text-[#38b2c8]">OUTSYDCVLTR</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Gen Z to the World. Through Music. Through Joy. Through Culture.
          </p>
          <a
            href="#about"
            className={cn(
              "inline-block px-8 py-4 rounded-full text-lg font-medium",
              "bg-[#38b2c8] text-white hover:bg-[#2a8896] transition-all duration-300"
            )}
          >
            Discover Our Movement
          </a>
        </div>
      </section>

      {/* About OUTSYDCVLTR Section */}
      <section
        id="about"
        className="relative py-16 bg-[#161a2c]/30 backdrop-blur-md z-10"
      >
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-96 object-cover rounded-lg"
              src={Vd1}
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-8 text-white">
            <h2 className="text-3xl font-semibold mb-4">
              🎧 About OUTSYDCVLTR
            </h2>
            <p className="text-gray-300">
              OUTSYDCVLTR is a global youth-focused collective dedicated to
              celebrating creativity, diversity, and collaboration through
              curated cultural experiences. We design intentional spaces — from
              live events to immersive parties — where individuals can connect,
              unwind, and express themselves freely. 
          
            </p>
            <p className="text-gray-300 mt-4">
            
            </p>
          </div>
        </div>
      </section>

      {/* Our Core */}
      <section className="relative py-16 bg-[#161a2c]/30 backdrop-blur-md z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row-reverse items-center">
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-96 object-cover rounded-lg"
              src={Vd3}
            />
          </div>
          <div className="w-full md:w-1/2 md:pr-8 text-white">
            <h2 className="text-3xl font-semibold mb-4">Our Core</h2>
            <p className="text-gray-300">
              We believe in the power of shared momennts to foster meaninngful connections,
              ad shape the future of the youth culture worldwide.
            </p>
            <p className="text-gray-300 mt-4">
              Through parties, festivals, and creative culture experiences, we
              help young people feel free again. We’re talking music that slaps,
              spaces that feel safe, and moments that remind you what it means
              to just be human.
            </p>
          </div>
        </div>
      </section>

      {/* We Stand For Section */}
      <section className="relative py-16 bg-[#ff3366]/80 text-white text-center z-10 animate-pulse">
        <h2 className="text-3xl font-semibold mb-6">We Stand For</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 max-w-6xl mx-auto">
          {[
            {
              title: "Healing through Rhythm",
              description: "Music as medicine for the mind.",
              icon: (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  className="mx-auto mb-4 animate-pulse animate-bounce"
                  aria-label="Heartbeat rhythm"
                  role="img"
                >
                  <path
                    d="M10 32 L20 20 L30 32 L40 20 L50 32"
                    fill="none"
                    stroke="#ff4500"
                    strokeWidth="4"
                    className="animate-beat"
                  />
                  <style>
                    {`
                @keyframes beat {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.2); }
                }
                .animate-beat {
                  animation: beat 1.2s ease-in-out infinite;
                }
                .animate-pulse {
                  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .animate-bounce {
                  animation: bounce 1s infinite;
                }
                @keyframes pulse {
                  0%, 100% { opacity: n a world full of pressure, deadlines, and digital noise, we
              believe in blowing off steam the right way: <br />
              🎶 Loud music. 🤝 Real f1; }
                  50% { opacity: 0.5; }
                }
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-8px); }
                }
              `}
                  </style>
                </svg>
              ),
            },
            {
              title: "Culture as Identity",
              description:
                "Rooted in Nigerian energy, but made for global Gen Z expression.",
              icon: (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  className="mx-auto mb-4 animate-pulse animate-bounce"
                  aria-label="Global culture swirl"
                  role="img"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="20"
                    fill="none"
                    stroke="#00ced1"
                    strokeWidth="2"
                  />
                  <path
                    d="M32 12 A20 20 0 0 1 52 32 A20 20 0 0 1 32 52"
                    fill="none"
                    stroke="#ff4500"
                    strokeWidth="4"
                    className="animate-swirl"
                  />
                  <style>
                    {`
                @keyframes swirl {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                .animate-swirl {
                  transform-origin: 32px 32px;
                  animation: swirl 4s linear infinite;
                }
                .animate-pulse {
                  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .animate-bounce {
                  animation: bounce 1s infinite;
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.5; }
                }
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-8px); }
                }
              `}
                  </style>
                </svg>
              ),
            },
            {
              title: "Community Over Clout",
              description: "Real connections over followers and filters.",
              icon: (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  className="mx-auto mb-4 animate-pulse animate-bounce"
                  aria-label="Linked hands"
                  role="img"
                >
                  <path
                    d="M20 40 Q24 30 28 40 Q36 30 40 40"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="4"
                    className="animate-shake"
                  />
                  <style>
                    {`
                @keyframes shake {
                  0%, 100% { transform: translateX(0); }
                  25% { transform: translateX(-4px); }
                  75% { transform: translateX(4px); }
                }
                .animate-shake {
                  animation: shake 1.5s ease-in-out infinite;
                }
                .animate-pulse {
                  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .animate-bounce {
                  animation: bounce 1s infinite;
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.5; }
                }
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-8px); }
                }
              `}
                  </style>
                </svg>
              ),
            },
            {
              title: "Joy as Resistance",
              description:
                "Dancing, laughing, and living loud even when the world says 'chill.'",
              icon: (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  className="mx-auto mb-4 animate-pulse animate-bounce"
                  aria-label="Dancing silhouette"
                  role="img"
                >
                  <path
                    d="M32 20 Q28 40 32 50 Q36 40 32 50"
                    fill="none"
                    stroke="#ff4500"
                    strokeWidth="4"
                    className="animate-dance"
                  />
                  <style>
                    {`
                @keyframes dance {
                  0%, 100% { transform: rotate(0deg); }
                  50% { transform: rotate(20deg); }
                }
                .animate-dance {
                  transform-origin: 32px 20px;
                  animation: dance 1s ease-in-out infinite;
                }
                .animate-pulse {
                  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .animate-bounce {
                  animation: bounce 1s infinite;
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.5; }
                }
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-8px); }
                }
              `}
                  </style>
                </svg>
              ),
            },
          ].map((value) => (
            <div
              key={value.title}
              className="bg-[#161a2c]/30 backdrop-blur-md rounded-lg p-6 border border-gray-800/50 hover:border-[#38b2c8] transition-all duration-300"
            >
              {value.icon}
              <h3 className="text-xl font-semibold">{value.title}</h3>
              <p className="text-gray-300 mt-2">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* More Than Vibes Section */}
      <section className="relative py-16 bg-[#161a2c]/30 backdrop-blur-md z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-96 object-cover rounded-lg"
              src={Vd2}
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-8 text-white">
            <h2 className="text-3xl font-semibold mb-4">More Than Vibes</h2>
            <p className="text-gray-300">
               It’s people-first culture. It’s
              finding your tribe, letting go of the stress, and celebrating
              every version of yourself — with sound, style, and soul.
            </p>
            
           
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-16 bg-transparent text-center z-10">
        <h2 className="text-3xl font-semibold text-white mb-4">💌 You In?</h2>
        <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
          We’re just getting started. Pull up, plug in, and let’s take this joy
          global.
        </p>
        <Link
          to="/ticket"
          className={cn(
            "inline-block px-8 py-4 rounded-full text-lg font-medium",
            "bg-[#38b2c8] text-white hover:bg-[#2a8896] transition-all duration-300"
          )}
        >
          Join the Movement
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;

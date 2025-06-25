import { useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { events } from "../assets/events";
import Vd1 from "../assets/img/Ou.mp4";
import Vd2 from "../assets/img/Outsydcvltr .mp4";
import Vd3 from "../assets/img/Outsydcvltr  (2).mp4";

const CulturePage = () => {
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
          src="../assets/culturevid/cultureVid.mp4"
        >
          Your browser does not support the video tag.
        </video>
        <div className="relative px-4 backdrop-blur-sm bg-[#0a0d16]/30 py-8 rounded-lg z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            The Heart of <span className="text-[#38b2c8]"> Culture</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Celebrate Benin City’s vibrant heritage. Connect with your roots,
            dance to the rhythm, and inspire with love and creativity.
          </p>
          <a
            href="#culture"
            className={cn(
              "inline-block px-8 py-4 rounded-full text-lg font-medium",
              "bg-[#38b2c8] text-white hover:bg-[#2a8896] transition-all duration-300"
            )}
          >
            Explore Our Culture
          </a>
        </div>
      </section>

      {/* A Rhythm of Joy*/}
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
            <h2 className="text-3xl font-semibold mb-4">🎶 A Rhythm of Joy</h2>
            <p className="text-gray-300">
              From the heart of Benin City to global stages, music has always
              been a source of joy and cultural pride. It’s more than sound —
              it’s life, love, and a language that unites us. Artists like
              Shallipopi and Rema, who started their journeys in Benin, are
              redefining Afrobeat and street-pop with unique styles rooted in
              their upbringing. Duncan Mighty brought soulful Port Harcourt
              rhythms into mainstream consciousness, blending highlife, reggae,
              and afrobeats into unforgettable hits. Legends like Wizkid and
              Burna Boy took Naija vibes global, lighting up the world with
              stories born from our streets and struggles.
            </p>
          </div>
        </div>
      </section>

      {/* The Rise of Amapiano Section */}
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
            <h2 className="text-3xl font-semibold mb-4">
              🎧 The Rise of Amapiano
            </h2>
            <p className="text-gray-300">
              The rise of Amapiano has added another energetic beat to Nigeria’s
              ever-evolving soundscape — parties and clubs across Lagos, Abuja,
              and PH are vibing non-stop to these South African-inspired log
              drums and vocal chops, fused seamlessly with Naija flavor.
            </p>
          </div>
        </div>
      </section>

      {/* Festivals & Celebrations Section */}
      <section className="relative py-16 bg-[#161a2c]/30 backdrop-blur-md z-10">
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
              🎉 Festivals & Celebrations
            </h2>
            <p className="text-gray-300">
              Festivals like Flytime Music Festival, Felabration, Detty
              December, and Homecoming have become cultural staples, drawing
              thousands together to dance, connect, and celebrate our collective
              rhythm. At Outsydeville, we don’t just follow trends — we spark
              them.
            </p>
          </div>
        </div>
      </section>

      {/* Values for Youth Section */}
      <section className="relative py-16 bg-[#ff3366]/80 text-white text-center z-10 animate-pulse">
        <h2 className="text-3xl font-semibold mb-6">
          Unleash the Nightlife Vibe
        </h2>
        <p className="max-w-3xl mx-auto mb-6">
          At Outsydeville, we bring the ultimate party experience—dance the
          night away, enjoy drinks and good vibes, and let loose in the club
          scene. Our events are all about fun, freedom, and living it up!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
          {[
            {
              title: "Dance All Night",
              description:
                "Hit the floor with epic moves and non-stop beats to keep the party rocking.",
              icon: (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  className="mx-auto mb-4"
                  aria-label="Dancing figures"
                  role="img"
                >
                  <g>
                    <circle
                      cx="20"
                      cy="40"
                      r="8"
                      fill="#ff4500"
                      className="animate-vibe"
                    />
                    <line
                      x1="20"
                      y1="48"
                      x2="20"
                      y2="60"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    <line
                      x1="20"
                      y1="48"
                      x2="12"
                      y2="60"
                      stroke="#fff"
                      strokeWidth="2"
                      className="animate-dance-left"
                    />
                    <line
                      x1="20"
                      y1="48"
                      x2="28"
                      y2="60"
                      stroke="#fff"
                      strokeWidth="2"
                      className="animate-dance-right"
                    />
                    <circle
                      cx="44"
                      cy="40"
                      r="8"
                      fill="#ff4500"
                      className="animate-vibe"
                    />
                    <line
                      x1="44"
                      y1="48"
                      x2="44"
                      y2="60"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    <line
                      x1="44"
                      y1="48"
                      x2="36"
                      y2="60"
                      stroke="#fff"
                      strokeWidth="2"
                      className="animate-dance-left"
                    />
                    <line
                      x1="44"
                      y1="48"
                      x2="52"
                      y2="60"
                      stroke="#fff"
                      strokeWidth="2"
                      className="animate-dance-right"
                    />
                  </g>
                  <style>
                    {`
                @keyframes dance-left {
                  0%, 100% { transform: rotate(0deg); }
                  50% { transform: rotate(-20deg); }
                }
                @keyframes dance-right {
                  0%, 100% { transform: rotate(0deg); }
                  50% { transform: rotate(20deg); }
                }
                @keyframes vibe {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-4px); }
                }
                .animate-dance-left {
                  transform-origin: 20px 48px;
                  animation: dance-left 0.6s ease-in-out infinite;
                }
                .animate-dance-right {
                  transform-origin: 20px 48px;
                  animation: dance-right 0.6s ease-in-out infinite;
                }
                .animate-vibe {
                  animation: vibe 0.8s ease-in-out infinite;
                }
              `}
                  </style>
                </svg>
              ),
            },
            {
              title: "Sip & Celebrate",
              description:
                "Raise a glass with friends, enjoy cocktails, and toast to the good times.",
              icon: (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  className="mx-auto mb-4"
                  aria-label="Cocktail glass"
                  role="img"
                >
                  <g>
                    <path d="M20 40 L44 40 L32 20 Z" fill="#00ced1" />
                    <rect x="28" y="40" width="8" height="16" fill="#fff" />
                    <circle
                      cx="32"
                      y="42"
                      r="4"
                      fill="#ff4500"
                      className="animate-bob"
                    />
                  </g>
                  <style>
                    {`
                @keyframes bob {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-6px); }
                }
                .animate-bob {
                  animation: bob 0.8s ease-in-out infinite;
                }
              `}
                  </style>
                </svg>
              ),
            },
            {
              title: "Smoke & Chill",
              description:
                "Kick back with a smooth vibe, unwind, and enjoy the laid-back party mood.",
              icon: (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  className="mx-auto mb-4"
                  aria-label="Smoking silhouette"
                  role="img"
                >
                  <g>
                    <rect x="28" y="40" width="8" height="16" fill="#808080" />
                    <path
                      d="M20 40 Q24 30 28 40 Q32 30 36 40"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      className="animate-smoke"
                    />
                  </g>
                  <style>
                    {`
                @keyframes smoke {
                  0% { transform: translateY(0); }
                  100% { transform: translateY(-10px); }
                }
                .animate-smoke {
                  animation: smoke 2s ease-out infinite;
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

      {/* Engagement Section */}
      <section className="relative py-16 bg-transparent z-10">
        <h2 className="text-3xl font-semibold text-white text-center mb-8">
          Join the Cultural Movement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
          {events.slice(0, 3).map((event) => (
            <Link
              key={event.id}
              to={`/tickets/${event.id}`}
              className="group bg-[#161a2c]/30 backdrop-blur-md rounded-lg overflow-hidden shadow-lg border border-gray-800/50 hover:border-[#38b2c8] transition-all duration-300"
            >
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4 text-white">
                <h3 className="text-xl font-semibold">{event.name}</h3>
                <p className="text-sm text-gray-400">{event.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Back to Events */}
      <section className="relative text-center py-8 z-10">
        <Link to="/ticket" className="text-[#38b2c8] hover:underline text-lg">
          Back to Events
        </Link>
      </section>
    </div>
  );
};

export default CulturePage;

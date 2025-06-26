import { useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";


import Vd1 from "../assets/img/Ou.mp4";
import Vd2 from "../assets/img/Outsydcvltr  (2).mp4";
import Vd3 from "../assets/img/Outsydcvltr  (3).mp4";

const MusicPage = () => {
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
        
        <div className="relative px-4 backdrop-blur-sm bg-[#0a0d16]/30 py-8 rounded-lg z-10 flex flex-col items-center">
          <div className="relative w-64 h-64 mb-6 mx-auto bg-transparent overflow-hidden">
          
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#0a0d16]/70 to-transparent backdrop-blur-md"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            🎶 Music Is Our <span className="text-[#38b2c8]">Therapy</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Gen Z to the World — From Naija with Vibes.
          </p>
          <a
            href="#music"
            className={cn(
              "inline-block px-8 py-4 rounded-full text-lg font-medium",
              "bg-[#38b2c8] text-white hover:bg-[#2a8896] transition-all duration-300"
            )}
          >
            Feel the Rhythm
          </a>
        </div>
      </section>
      {/* Music Is Our Therapy Section */}
      <section
        id="music"
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
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="w-full md:w-1/2 md:pl-8 text-white">
            <h2 className="text-3xl font-semibold mb-4">
              🎶 Music Is Our Therapy
            </h2>
            <p className="text-gray-300">
              
            </p>
            <p className="text-gray-300 mt-4">
              
            </p>
          </div>
        </div>
      </section>

      {/* We Believe in the Power of Sound Section */}
      <section className="relative py-16 bg-[#161a2c]/30 backdrop-blur-md z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row-reverse items-center">
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-96 object-cover rounded-lg"
              src={Vd2}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="w-full md:w-1/2 md:pr-8 text-white">
            <h2 className="text-3xl font-semibold mb-4">
              🔊 We Believe in the Power of Sound
            </h2>
            <p className="text-gray-300">
            
            </p>
            <ul className="text-gray-300 mt-4 space-y-2">
              
            </ul>
          </div>
        </div>
      </section>

      {/* More Than Just Playlists Section */}
      <section className="relative py-16 bg-[#ff3366]/80 text-white text-center z-10 animate-pulse">
        <h2 className="text-3xl font-semibold mb-6">
          🎧 More Than Just Playlists
        </h2>
        <p className="max-w-3xl mx-auto mb-6">
          Outsydeville curates sounds for every mood:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
          {[
            {
              title: "Party Hard or Cry in the Dark",
              description:
                "From high-energy bangers to soulful tracks for those quiet moments.",
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
                    {/* Dancer 1 */}
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
              title: "Link Up with Squad or Vibe Solo",
              description:
                "Music for epic nights with friends or introspective headphone sessions.",
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
                    {/* Dancer 1 */}
                    <circle
                      cx="20"
                      cy="40"
                      r="8"
                      fill="#00ced1"
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
                    {/* Dancer 2 */}
                    <circle
                      cx="44"
                      cy="40"
                      r="8"
                      fill="#00ced1"
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
              title: "Late Night Cruise or Morning Motivation",
              description:
                "Tunes for cruising under the stars or starting your day with energy.",
              icon: (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  className="mx-auto mb-4"
                  aria-label="Cruising car"
                  role="img"
                >
                  <g>
                    {/* Car Body */}
                    <rect x="20" y="40" width="24" height="12" fill="#228b22" />
                    {/* Wheels */}
                    <circle cx="28" cy="52" r="4" fill="#000" />
                    <circle cx="40" cy="52" r="4" fill="#000" />
                    {/* Headlights */}
                    <circle
                      cx="24"
                      cy="44"
                      r="2"
                      fill="#ffff00"
                      className="animate-pulse"
                    />
                    <circle
                      cx="36"
                      cy="44"
                      r="2"
                      fill="#ffff00"
                      className="animate-pulse"
                    />
                    {/* Roof */}
                    <line
                      x1="24"
                      y1="40"
                      x2="40"
                      y2="40"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  </g>
                </svg>
              ),
            },
          ].map((mood) => (
            <div
              key={mood.title}
              className="bg-[#161a2c]/30 backdrop-blur-md rounded-lg p-6 border border-gray-800/50 hover:border-[#38b2c8] transition-all duration-300"
            >
              {mood.icon}
              <h3 className="text-xl font-semibold">{mood.title}</h3>
              <p className="text-gray-300 mt-2">{mood.description}</p>
            </div>
          ))}
        </div>
      </section>
      {/* The Culture Is Loud Section */}
      <section className="relative py-16 bg-[#161a2c]/30 backdrop-blur-md z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-96 object-cover rounded-lg"
              src={Vd3}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="w-full md:w-1/2 md:pl-8 text-white">
            <h2 className="text-3xl font-semibold mb-4">
              💃🏽 The Culture Is Loud
            </h2>
            <p className="text-gray-300">
            
            </p>
            <h3 className="text-2xl font-semibold mt-6">
              
            </h3>
            <p className="text-gray-300 mt-2">
              
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {/* <section className="relative py-16 bg-transparent z-10">
        <h2 className="text-3xl font-semibold text-white text-center mb-8">
          Upcoming Events
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
      </section> */}

      {/* Call to Action Section */}
      <section className="relative text-center py-8 z-10">
        <Link to="/ticket" className="text-[#38b2c8] hover:underline text-lg">
          Back to Events
        </Link>
      </section>
    </div>
  );
};

export default MusicPage;

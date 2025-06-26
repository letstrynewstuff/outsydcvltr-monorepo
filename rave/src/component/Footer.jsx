import { Link } from "react-router-dom";
import {
  FaXTwitter,
  FaInstagram,
  FaSpotify,
  FaApple,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";
import Logo from "../assets/img/OUTSYDlogo2.png";

const Footer = () => {
  return (
    <footer
      className="text-white py-8 sm:py-10 md:py-12 border-t border-gray-700 z-10 relative"
      style={{
        background:
          "linear-gradient(90deg, rgba(42, 57, 155, 1) 0%, rgba(87, 190, 195, 1) 50%, rgba(237, 221, 83, 1) 100%)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-6 sm:gap-8">
        {/* Social Icons */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xl sm:text-2xl md:text-3xl text-white">
          <a
            href="https://www.instagram.com/outsydcvltr?igsh=cXFsMGozdG5qZjBp&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 hover:scale-110 transition-all duration-200"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.tiktok.com/@outsydcvltr?_t=8qcUXCaFN8n&_r=1"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 hover:scale-110 transition-all duration-200"
            aria-label="TikTok"
          >
            <FaTiktok />
          </a>
          <a
            href="https://x.com/outsydcvltr?s=21"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 hover:scale-110 transition-all duration-200"
            aria-label="X (Twitter)"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://youtube.com/@outsydcvltr?si=8MmVD99ok-P_mzqs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 hover:scale-110 transition-all duration-200"
            aria-label="YouTube"
          >
            <FaYoutube />
          </a>
          <a
            href="https://open.spotify.com/user/outsydcvltr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 hover:scale-110 transition-all duration-200"
            aria-label="Spotify"
          >
            <FaSpotify />
          </a>
          <a
            href="https://music.apple.com/profile/outsydcvltr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 hover:scale-110 transition-all duration-200"
            aria-label="Apple Music"
          >
            <FaApple />
          </a>
        </div>

        {/* Logo */}
        <div>
          <img
            src={Logo}
            alt="Outsydeville Logo"
            className="h-10 sm:h-12 md:h-14 transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/150x50?text=Outsydeville";
              e.target.style.color = "#ffffff";
            }}
          />
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm md:text-base">
          <Link
            to="/culture"
            className="hover:text-gray-200 transition-colors duration-200 relative group"
          >
            Culture
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/music"
            className="hover:text-gray-200 transition-colors duration-200 relative group"
          >
            Music
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/about"
            className="hover:text-gray-200 transition-colors duration-200 relative group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/ticket"
            className="hover:text-gray-200 transition-colors duration-200 relative group"
          >
            Tickets
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs sm:text-sm text-white/80 mt-4">
          © 2025 OUTSYDCVLTR 
        </div>
      </div>
    </footer>
  );
};

export default Footer;

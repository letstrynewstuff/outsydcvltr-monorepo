import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Ticket, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";
import Logo from "../assets/img/OUTSYDlogo2.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50",
        "flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5",
        "relative"
      )}
      style={{
        background:
          "linear-gradient(90deg, rgba(42, 57, 155, 1) 0%, rgba(87, 190, 199, 1) 50%, rgba(237, 221, 83, 1) 100%)",
        filter:
          'progid:DXImageTransform.Microsoft.gradient(startColorstr="#2A399B", endColorstr="#EDDD53", GradientType=1)',
      }}
    >
      {/* Curvy line with gradient and circular overlays */}
      {/* <div
        className="absolute left-0 right-0 bottom-0 h-3 sm:h-4"
        style={{
          background: "linear-gradient(to right, #38b2c8, #2a8896)",
          borderBottomLeftRadius: "50% 10px",
          borderBottomRightRadius: "50% 10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <div className="absolute -right-10 -top-10 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-[#38b2c8] rounded-full opacity-20" />
        <div className="absolute -left-10 -bottom-12 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#2a8896] rounded-full opacity-20" />
      </div> */}

      {/* Logo on the left with subtle hover effect */}
      <div className="flex items-center">
        <Link to="/" className="relative group">
          <img
            src={Logo}
            alt="Outsydeville"
            className="h-8 sm:h-12 md:h-16 w-auto transition-transform duration-300 group-hover:scale-105"
            style={{
              objectFit: "contain",
              background: "transparent",
            }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/150x50?text=Outsydeville";
              e.target.style.color = "#38b2c8";
            }}
          />
        </Link>
      </div>

      {/* Mobile menu button */}
      <button
        className="lg:hidden text-white hover:text-gray-200 transition-transform duration-200"
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <X
            size={24}
            strokeWidth={2}
            className="text-white ring-2 ring-white rounded-full p-1"
          />
        ) : (
          <Menu size={24} />
        )}
      </button>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-8">
        <Link
          to="/music"
          className="text-white hover:text-gray-200 relative font-medium text-sm lg:text-base transition-colors duration-200 group"
        >
          Music
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
        </Link>

        <Link
          to="/culture"
          className="text-white hover:text-gray-200 relative font-medium text-sm lg:text-base transition-colors duration-200 group"
        >
          Culture
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
        </Link>

        <Link
          to="/about"
          className="text-white hover:text-gray-200 relative font-medium text-sm lg:text-base transition-colors duration-200 group"
        >
          About
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
        </Link>

        {/* Shopping bag with subtle animation */}
        <Link
          to="/shop"
          className="text-white hover:text-gray-200 transition-transform duration-200 hover:scale-110"
        >
          <ShoppingBag className="h-5 w-5" />
        </Link>

        {/* Enhanced ticket button */}
        <Link
          to="/ticket"
          className={cn(
            "inline-flex items-center space-x-2 px-4 py-2 rounded-full",
            "bg-white text-[#2a399b] hover:bg-gray-100",
            "shadow-md hover:shadow-lg transition-all duration-300 text-sm lg:text-base"
          )}
        >
          <Ticket className="h-5 w-5" />
          <span className="font-medium">Ticket</span>
        </Link>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          background:
            "linear-gradient(90deg, rgba(42, 57, 155, 1) 0%, rgba(87, 190, 199, 1) 50%, rgba(237, 221, 83, 1) 100%)",
          filter:
            'progid:DXImageTransform.Microsoft.gradient(startColorstr="#2A399B", endColorstr="#EDDD53", GradientType=1)',
        }}
      >
        <div className="flex flex-col h-full pt-16 px-6 pb-8 space-y-6">
          <Link
            to="/music"
            className="text-white hover:text-gray-200 text-lg sm:text-xl font-medium py-2 border-b border-white/20"
            onClick={() => setIsMenuOpen(false)}
          >
            Music
          </Link>
          <Link
            to="/culture"
            className="text-white hover:text-gray-200 text-lg sm:text-xl font-medium py-2 border-b border-white/20"
            onClick={() => setIsMenuOpen(false)}
          >
            Culture
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-gray-200 text-lg sm:text-xl font-medium py-2 border-b border-white/20"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/shop"
            className="text-white hover:text-gray-200 text-lg sm:text-xl font-medium py-2 border-b border-white/20 flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <ShoppingBag className="h-5 w-5" /> Shop
          </Link>
          <Link
            to="/ticket"
            className={cn(
              "inline-flex items-center justify-center space-x-2 px-6 py-3 mt-4 rounded-full",
              "bg-white text-[#2a399b]",
              "shadow-md transition-all duration-300 text-lg sm:text-xl"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <Ticket className="h-5 w-5" />
            <span className="font-medium">Ticket</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

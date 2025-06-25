import { useState } from "react";
import { cn } from "../lib/utils";

const TestimonialCarousel = ({ testimonials }) => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="flex items-center justify-center">
        <div className="bg-[#161a2c]/30 backdrop-blur-md rounded-lg p-6 text-center text-white">
          <img
            src={testimonials[current].image}
            alt={testimonials[current].name}
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-300 italic mb-4">
            "{testimonials[current].text}"
          </p>
          <p className="text-white font-semibold">
            {testimonials[current].name}
          </p>
          <p className="text-gray-400">{testimonials[current].location}</p>
        </div>
      </div>
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#38b2c8]/50 hover:bg-[#38b2c8] text-white p-2 rounded-full"
      >
        ←
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#38b2c8]/50 hover:bg-[#38b2c8] text-white p-2 rounded-full"
      >
        →
      </button>
    </div>
  );
};

export default TestimonialCarousel;

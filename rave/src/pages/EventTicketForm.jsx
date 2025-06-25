import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PaystackButton } from "react-paystack";
import { cn } from "../lib/utils";
import { events } from "../assets/events";

const EventTicketForm = () => {
  const { eventId } = useParams();
  const event = events.find((e) => e.id === parseInt(eventId));
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  const [quantities, setQuantities] = useState(
    event ? event.tickets.map(() => 0) : []
  );
  const [total, setTotal] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (event) {
      const newTotal = event.tickets.reduce(
        (sum, ticket, index) => sum + ticket.price * quantities[index],
        0
      );
      setTotal(newTotal);
    }
  }, [quantities, event]);

  const handleQuantityChange = (index, delta) => {
    setQuantities((prev) =>
      prev.map((qty, i) => (i === index ? Math.max(0, qty + delta) : qty))
    );
  };

  const totalTickets = quantities.reduce((a, b) => a + b, 0);

  const paystackProps = {
    email,
    amount: total * 100, 
    publicKey,
    text: "Buy Tickets",
    onSuccess: (response) => {
      alert("Payment successful! Reference: " + response.reference);
      // You can reset form or redirect here
    },
    onClose: () => alert("Payment closed."),
    disabled: total === 0 || !email,
    className: cn(
      "px-6 py-3 rounded-full text-lg font-medium",
      "bg-[#38b2c8] text-white hover:bg-[#2a8896]",
      "transition-all duration-300",
      (total === 0 || !email) && "opacity-50 cursor-not-allowed"
    ),
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0a0d16]">
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-3xl text-white text-center">Event not found</h1>
          <p className="text-center text-gray-300 mt-4">
            <Link to="/ticket" className="text-[#38b2c8] hover:underline">
              Back to Events
            </Link>
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d16]">
      <main className="container mx-auto px-4 py-12">
        {/* Event details */}
        <section className="mb-12">
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {event.name}
          </h1>
          <p className="text-gray-300 mb-2">
            <span className="font-medium">Date:</span> {event.date}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-medium">Time:</span> {event.time}
          </p>
          <p className="text-gray-300 mb-4">
            <span className="font-medium">Location:</span> {event.location}
          </p>
        </section>

        {/* Ticket form */}
        <section className="bg-white rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tickets</h2>
          <div className="border border-gray-200 rounded">
            {event.tickets.map((ticket, index) => (
              <div
                key={ticket.type}
                className={cn(
                  "flex flex-col sm:flex-row justify-between items-center p-4",
                  index !== event.tickets.length - 1 &&
                    "border-b border-gray-200"
                )}
              >
                <div className="mb-4 sm:mb-0 sm:w-1/3">
                  <h3 className="text-lg font-medium text-gray-800">
                    {ticket.type}
                  </h3>
                </div>
                <div className="mb-4 sm:mb-0 sm:w-1/3 text-center">
                  <p className="text-gray-600">
                    ₦{ticket.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4 sm:w-1/3 justify-end">
                  <button
                    onClick={() => handleQuantityChange(index, -1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    disabled={quantities[index] === 0}
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-gray-800">
                    {quantities[index]}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(index, 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Email Input */}
          <div className="mt-6">
            <label className="block mb-2 text-gray-700 font-medium">
              Your Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-[#38b2c8]"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Total and Payment */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
              Total: ₦{total.toLocaleString()} ({totalTickets} ticket
              {totalTickets !== 1 ? "s" : ""})
            </p>
            <PaystackButton {...paystackProps} />
          </div>
        </section>

        <section className="mt-8 text-center">
          <Link to="/ticket" className="text-[#38b2c8] hover:underline">
            Back to Events
          </Link>
        </section>
      </main>
    </div>
  );
};

export default EventTicketForm;

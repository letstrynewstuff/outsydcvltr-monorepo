import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePaystackPayment } from "react-paystack";

const TicketPage = () => {
  const [events, setEvents] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ticketType: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/events`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response from /api/events:", data);
        setEvents(Array.isArray(data.events) ? data.events : []);
      } catch (error) {
        console.error("Error fetching events:", error.message);
        setErrorMessage("Failed to load events. Please try again later.");
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleTicketClick = (event) => {
    if (event.price.comingSoon) {
      setErrorMessage("Tickets for this event are not available yet.");
      return;
    }
    setSelectedEvent(event);
    setFormData({
      name: "",
      email: "",
      phone: "",
      ticketType: "generalAdmission",
    });
    setIsPopupOpen(true);
  };

  const getTicketPrice = (event, ticketType) => {
    if (!event || event.price.comingSoon) return 0;
    if (ticketType === "generalAdmission")
      return event.price.generalAdmission * 100; // Kobo
    if (ticketType === "gengOf6") return event.price.gengOf6 * 100; // Kobo
    if (ticketType === "presale") return 0; // Free
    return 0;
  };

  const getDisplayPrice = (event, ticketType) => {
    if (!event || event.price.comingSoon) return "Coming Soon";
    if (ticketType === "generalAdmission")
      return `₦${event.price.generalAdmission.toLocaleString()}`;
    if (ticketType === "gengOf6")
      return `₦${event.price.gengOf6.toLocaleString()}`;
    if (ticketType === "presale") return "Free";
    return "Free";
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/presale/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          name: formData.name,
          email: formData.email,
          ticketType: formData.ticketType,
        }),
      });
      const data = await response.json();
      console.log("Register Response:", data);
      if (!response.ok) {
        throw new Error(data.error || "Failed to register ticket");
      }
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(error.message || "Failed to process registration");
      setIsSubmitting(false);
    }
  };

  const onPaystackSuccess = async (reference) => {
    try {
      const response = await fetch(`${API_URL}/api/presale/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: reference.reference,
          eventId: selectedEvent.id,
          email: formData.email,
          ticketType: formData.ticketType,
        }),
      });
      const data = await response.json();
      console.log("Verify Response:", data);
      if (response.ok) {
        setSuccessMessage({
          name: formData.name,
          eventName: selectedEvent.name,
          qrCode: data.qrCode,
          ticketId: data.ticketId,
          ticketType: formData.ticketType,
          ticketPrice: data.ticketPrice,
          email: formData.email,
        });
        setIsPopupOpen(false);
        setFormData({ name: "", email: "", phone: "", ticketType: "" });
      } else {
        setErrorMessage(data.error || "Payment verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setErrorMessage("Failed to verify payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPaystackClose = () => {
    setErrorMessage("Payment was cancelled");
    setIsSubmitting(false);
  };

  const initializePayment = usePaystackPayment({
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: getTicketPrice(selectedEvent, formData.ticketType),
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: "NGN",
  });

  const handlePayment = async (e) => {
    const data = await handleFormSubmit(e);
    if (data && data.ticketId) {
      if (formData.ticketType === "presale") {
        setSuccessMessage({
          name: formData.name,
          eventName: selectedEvent.name,
          qrCode: data.qrCode,
          ticketId: data.ticketId,
          ticketType: formData.ticketType,
          ticketPrice: data.ticketPrice,
          email: formData.email,
        });
        setIsPopupOpen(false);
        setFormData({ name: "", email: "", phone: "", ticketType: "" });
        setIsSubmitting(false);
      } else {
        initializePayment(onPaystackSuccess, onPaystackClose);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Events</h1>
        {isLoading ? (
          <p className="text-center">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center">No events available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
              >
                <img
                  src={`${API_URL}${event.image}`}
                  alt={event.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200?text=Event";
                  }}
                />
                <h2 className="text-xl font-semibold">{event.name}</h2>
                <p>
                  {event.date} | {event.time}
                </p>
                <p>{event.location}</p>
                {event.price.comingSoon ? (
                  <p className="mt-4 text-gray-400">Tickets Coming Soon</p>
                ) : (
                  <>
                    <p className="mt-4">
                      General Admission:{" "}
                      {getDisplayPrice(event, "generalAdmission")}
                    </p>
                    <p>Geng of 6: {getDisplayPrice(event, "gengOf6")}</p>
                    <p>Presale: {getDisplayPrice(event, "presale")}</p>
                    <button
                      onClick={() => handleTicketClick(event)}
                      className="mt-4 bg-white text-[#2a399b] px-4 py-2 rounded-full hover:bg-gray-100 transition"
                    >
                      Get Ticket
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isPopupOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Ticket for {selectedEvent.name}
            </h2>
            <form onSubmit={handlePayment}>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Ticket Type</label>
                <select
                  name="ticketType"
                  value={formData.ticketType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  disabled={isSubmitting}
                >
                  <option value="" disabled>
                    Select ticket type
                  </option>
                  <option value="generalAdmission">
                    General Admission (
                    {getDisplayPrice(selectedEvent, "generalAdmission")})
                  </option>
                  <option value="gengOf6">
                    Geng of 6 ({getDisplayPrice(selectedEvent, "gengOf6")})
                  </option>
                  {/* <option value="presale">
                    Presale ({getDisplayPrice(selectedEvent, "presale")})
                  </option> */}
                </select>
              </div>
              <motion.button
                type="submit"
                className={`bg-white text-[#2a399b] px-4 py-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
                whileTap={{ scale: 0.95 }}
                animate={isSubmitting ? { opacity: 0.5 } : { opacity: 1 }}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-[#2a399b]"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : formData.ticketType === "presale" ? (
                  "Submit"
                ) : (
                  "Pay with Paystack"
                )}
              </motion.button>
              <button
                type="button"
                onClick={() => setIsPopupOpen(false)}
                className="ml-4 text-gray-400 hover:text-gray-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-center shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-green-400">
              Purchase Successful!
            </h2>
            <p>
              Thank you, <strong>{successMessage.name}</strong>, for purchasing
              a <strong>{successMessage.ticketType}</strong> ticket for{" "}
              <strong>{successMessage.eventName}</strong>.
            </p>
            <p className="mt-2">
              Ticket ID: <strong>{successMessage.ticketId}</strong>
            </p>
            <p className="mt-2">
              Price:{" "}
              <strong>₦{successMessage.ticketPrice.toLocaleString()}</strong>
            </p>
            <p className="text-green-500 mt-2">
              QR Code has been sent to <strong>{successMessage.email}</strong>.
              Check your inbox.
              <br />
              If it was displayed on your screen, kindly take a screenshot as
              backup.
            </p>
            {successMessage.qrCode ? (
              <div className="mt-4 bg-white p-2 inline-block shadow">
                <img
                  src={successMessage.qrCode}
                  alt="Ticket QR Code"
                  className="w-32 h-64 mx-auto"
                  onError={(e) => console.error("QR Code image error:", e)}
                />
              </div>
            ) : (
              <p className="text-red-400 mt-4">QR Code not available</p>
            )}
            <button
              onClick={() => setSuccessMessage(null)}
              className="mt-6 bg-white text-[#2a399b] px-4 py-2 rounded-full hover:bg-gray-100 transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}

      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-4">Error</h2>
            <p>{errorMessage}</p>
            <button
              onClick={() => setErrorMessage(null)}
              className="mt-4 bg-white text-[#2a399b] px-4 py-2 rounded-full hover:bg-gray-100 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketPage;

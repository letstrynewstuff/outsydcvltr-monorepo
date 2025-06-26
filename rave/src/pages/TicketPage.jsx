import { useState, useEffect } from "react";
import { motion } from "framer-motion"


const TicketPage = () => {
  const [events, setEvents] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setErrorMessage("Failed to load events");
      }
    };
    fetchEvents();
  }, []);

  const handlePresaleClick = (event) => {
    setSelectedEvent(event);
    setIsPopupOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/presale/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          name: formData.name,
          email: formData.email,
          ticketType: "presale",
        }),
      });
      const data = await response.json();
      console.log("Presale Response:", data); // Debug response
      if (response.ok) {
        setSuccessMessage({
          name: formData.name,
          eventName: selectedEvent.name,
          qrCode: data.qrCode,
          ticketId: data.ticketId,
        });
        setIsPopupOpen(false);
        setFormData({ name: "", email: "", phone: "" });
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error("Purchase error:", error);
      setErrorMessage("Failed to process purchase");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Events</h1>
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
              <button
                onClick={() => handlePresaleClick(event)}
                className="mt-4 bg-white text-[#2a399b] px-4 py-2 rounded-full hover:bg-gray-100 transition"
              >
                Get Presale Ticket (Free)
              </button>
            </div>
          ))}
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Presale Ticket for {selectedEvent.name}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
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
                />
              </div>
              <button
                type="submit"
                className="bg-white text-[#2a399b] px-4 py-2 rounded-full hover:bg-gray-100 transition"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setIsPopupOpen(false)}
                className="ml-4 text-gray-400 hover:text-gray-200"
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
              a ticket for <strong>{successMessage.eventName}</strong>.
            </p>
            <p className="mt-2">
              Ticket ID: <strong>{successMessage.ticketId}</strong>
            </p>
            <p className="text-green-500 mt-2">
              QR Code has been sent to <strong>{formData.email}</strong>. Check
              your inbox.
              <br />
              If it was displayed on your screen, kindly take a screenshot as
              backup.
            </p>
            {successMessage.qrCode ? (
              <div className="mt-4 bg-white p-2 inline-block rounded shadow">
                <img
                  src={successMessage.qrCode}
                  alt="Ticket QR Code"
                  className="w-32 h-32 mx-auto"
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

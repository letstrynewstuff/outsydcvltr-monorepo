import React, { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { api } from "../lib/api";
import { cn } from "../lib/utils";

const TicketScanner = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [manualSearch, setManualSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (token && !scanner) {
      const html5QrCode = new Html5Qrcode("qr-reader");
      setScanner(html5QrCode);
      console.log("Scanner initialized");
    }
    return () => {
      if (scanner?.isScanning) {
        scanner.stop().catch((err) => console.error("Stop error:", err));
      }
    };
  }, [token, scanner]);

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/admin/login", { username, password });
      const newToken = res.data.token;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  const startScanner = async () => {
    if (!token) return setError("Please log in first");
    if (!scanner) return setError("Scanner not initialized");
    if (isScanning) return setError("Scanner is already running");

    try {
      setIsScanning(true);
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (qrData) => {
          try {
            const res = await api.get(`/api/tickets/scan/${qrData}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setScanResult(res.data);
            setError("");
            await scanner.stop();
            setIsScanning(false);
          } catch (err) {
            setError(
              err.response?.data?.error || "Failed to fetch ticket data"
            );
          }
        },
        (err) => console.error("Scan error:", err.message)
      );
    } catch (err) {
      setError("Failed to start scanner: " + err.message);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scanner && isScanning) {
      try {
        await scanner.stop();
        setIsScanning(false);
        setError("");
      } catch (err) {
        setError("Failed to stop scanner: " + err.message);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setScanResult(null);
    setError("");
    setIsScanning(false);
    if (scanner?.isScanning) {
      scanner.stop().catch((err) => console.error("Stop error:", err));
    }
  };

  const handleManualSearch = async () => {
    if (!manualSearch || manualSearch.length !== 4) {
      return setError("Enter last 4 digits of Ticket ID");
    }
    try {
      const res = await api.get(`/api/tickets/search/${manualSearch}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(res.data);
      setError("");
    } catch (err) {
      setSearchResults([]);
      setError(err.response?.data?.error || "Search failed");
    }
  };

  if (!token) {
    return (
      <div className={cn("p-4 max-w-md mx-auto")}>
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border p-3 mb-3 w-full rounded-md"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-3 mb-3 w-full rounded-md"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white p-3 rounded-md w-full hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className={cn("p-4 max-w-lg mx-auto")}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Ticket Scanner</h2>
        <button
          onClick={logout}
          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div
        id="qr-reader"
        className="mb-4 border rounded-md overflow-hidden"
        style={{ width: "100%", maxWidth: "500px" }}
      />

      <div className="flex gap-4 mb-6">
        {!isScanning ? (
          <button
            onClick={startScanner}
            className="bg-blue-500 text-white p-3 rounded-md w-full hover:bg-blue-600"
          >
            Start Scanner
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="bg-red-500 text-white p-3 rounded-md w-full hover:bg-red-600"
          >
            Stop Scanner
          </button>
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">
          Manual Search (Last 4 of Ticket ID)
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualSearch}
            onChange={(e) => setManualSearch(e.target.value)}
            maxLength={4}
            className="border px-3 py-2 rounded w-full"
            placeholder="e.g. 7f3a"
          />
          <button
            onClick={handleManualSearch}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Search
          </button>
        </div>
      </div>

      {scanResult && (
        <div className="mt-6 p-4 bg-gray-100 text-black rounded-md">
          <h3 className="font-bold mb-2">Scanned Ticket</h3>
          <p>
            <strong>Name:</strong> {scanResult.name}
          </p>
          <p>
            <strong>Email:</strong> {scanResult.email}
          </p>
          <p>
            <strong>Payment Date:</strong>{" "}
            {new Date(scanResult.paymentDate).toLocaleString()}
          </p>
          <p>
            <strong>Ticket Type:</strong> {scanResult.ticketType}
          </p>
          <p>
            <strong>Event:</strong> {scanResult.event.name}
          </p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 text-black rounded-md">
          <h3 className="font-bold mb-2">Search Results</h3>
          {searchResults.map((result, i) => (
            <div key={i} className="mb-4 border-b pb-2">
              <p>
                <strong>Name:</strong> {result.name}
              </p>
              <p>
                <strong>Email:</strong> {result.email}
              </p>
              <p>
                <strong>Ticket ID:</strong> {result.ticketId}
              </p>
              <p>
                <strong>Ticket Type:</strong> {result.ticketType}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketScanner;

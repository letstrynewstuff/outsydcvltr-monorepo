import React, { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { api } from "../lib/api";
import { cn } from "../lib/utils";

const TicketScanner = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [scanResult, setScanResult] = useState(null);
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
      const res = await api.post("/api/admin/login", {
        username,
        password,
      });
      const newToken = res.data.token;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setError("");
      console.log("Token saved:", newToken);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      console.error("Login error:", err);
    }
  };

  const startScanner = async () => {
    if (!token) {
      setError("Please log in first");
      return;
    }
    if (!scanner) {
      setError("Scanner not initialized");
      return;
    }
    if (isScanning) {
      setError("Scanner is already running");
      return;
    }
    try {
      setIsScanning(true);
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (qrData) => {
          console.log("Scanned QR code:", qrData);
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
            console.error("Scan request error:", err);
          }
        },
        (err) => console.error("Scan error:", err.message)
      );
      console.log("Scanner started");
    } catch (err) {
      setError("Failed to start scanner: " + err.message);
      setIsScanning(false);
      console.error("Start scanner error:", err);
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

  if (!token) {
    return (
      <div className={cn("p-4 max-w-md mx-auto")}>
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        {error && <p className="text-red-600">{error}</p>}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border p-3 mb-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-3 mb-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white p-3 rounded-md w-full hover:bg-blue-600 transition-colors"
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
        className="mb-4 border border-gray-300 rounded-lg overflow-hidden"
        style={{ width: "100%", maxWidth: "500px" }}
      ></div>
      <div className="flex gap-4">
        {!isScanning ? (
          <button
            onClick={startScanner}
            className="bg-blue-500 text-white p-3 rounded-md w-full hover:bg-blue-600 transition-colors"
          >
            Start Scanner
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="bg-red-500 text-white p-3 rounded-md w-full hover:bg-red-600 transition-colors"
          >
            Stop Scanner
          </button>
        )}
      </div>
      {scanResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <p className="mb-2">
            <strong>Name:</strong> {scanResult.name}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {scanResult.email}
          </p>
          <p className="mb-2">
            <strong>Payment Date:</strong>{" "}
            {new Date(scanResult.paymentDate).toLocaleString()}
          </p>
          <p className="mb-2">
            <strong>Ticket Type:</strong> {scanResult.ticketType}
          </p>
          <p>
            <strong>Event:</strong> {scanResult.event.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default TicketScanner;

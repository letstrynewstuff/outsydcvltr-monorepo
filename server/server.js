// server.js
const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cors = require("cors");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const path = require("path");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://outsydcvltr-monorepo.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/img", express.static(path.join(__dirname, "src/assets/img")));

// Database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Email Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
transporter.verify((err, success) => {
  if (err) console.error("Email transporter error:", err);
  else console.log("Email transporter ready");
});

// Schemas
const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  date: String,
  time: String,
  location: String,
  image: String,
  price: Number,
});
const Event = mongoose.model("Event", eventSchema);

const attendeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  eventId: String,
  paymentReference: String,
  paymentStatus: { type: String, default: "pending" },
  ticketId: { type: String, unique: true },
  ticketType: {
    type: String,
    enum: ["presale", "regular", "diamond"],
    default: "regular",
  },
  paymentDate: Date,
  createdAt: { type: Date, default: Date.now },
});
const Attendee = mongoose.model("Attendee", attendeeSchema);

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const Admin = mongoose.model("Admin", adminSchema);

// Routes
app.get("/", (req, res) => res.send("API is running"));

// Admin login
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing credentials" });

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !(await bcrypt.compare(password, admin.password)))
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Create admin (optional: secure or disable in production)
app.post("/api/admin/create", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ error: "Admin exists" });

    const hashed = await bcrypt.hash(password, 10);
    await new Admin({ username, password: hashed }).save();
    res.json({ message: "Admin created" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Register for presale + email ticket
app.post("/api/presale/register", async (req, res) => {
  const { name, email, eventId, ticketType } = req.body;
  if (!name || !email || !eventId || !ticketType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Enforce presale cap
    const presaleCount = await Attendee.countDocuments({
      ticketType: "presale",
      eventId,
      paymentStatus: "success",
    });

    if (presaleCount >= 115) {
      return res.status(403).json({
        error: "Presale tickets are sold out. You can no longer register.",
      });
    }

    const event = await Event.findOne({ id: eventId });
    if (!event) return res.status(404).json({ error: "Event not found" });

    const existingTicket = await Attendee.findOne({
      email,
      eventId,
      ticketType: "presale",
    });
    if (existingTicket) {
      return res.status(400).json({
        error: "Email already registered for this event's presale ticket",
      });
    }

    const ticketId = crypto.randomBytes(16).toString("hex");
    const attendee = new Attendee({
      name,
      email,
      eventId,
      ticketId,
      ticketType,
      paymentStatus: "success",
      paymentDate: new Date(),
    });
    await attendee.save();

    // QR Code
    const qrCodeData = await QRCode.toDataURL(ticketId, {
      errorCorrectionLevel: "H",
      width: 200,
    });

    // Buyer Email
    await transporter.sendMail({
      from: `"Outsydcvltr Events" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Your Presale Ticket for ${event.name}`,
      html: `
        <h2>Dear ${name},</h2>
        <p>Your presale ticket for <strong>${event.name}</strong> is confirmed.</p>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        <p>Scan this QR code at the event:</p>
        <img src="${qrCodeData}" alt="Ticket QR Code" style="width:200px;" />
      `,
    });

    // Admin Notification Email
    await transporter.sendMail({
      from: `"Outsydcvltr Events" <${process.env.GMAIL_USER}>`,
      to: "mik5633257@gmail.com",
      subject: `New Presale Ticket for ${event.name}`,
      html: `
        <p><strong>Buyer:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        <p><strong>Ticket Type:</strong> ${ticketType}</p>
      `,
    });

    res.json({
      message: "Presale ticket registered",
      qrCode: qrCodeData,
      ticketId,
    });
  } catch (err) {
    console.error("Presale registration error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// QR Scan route
app.get("/api/tickets/scan/:ticketId", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const attendee = await Attendee.findOne({
      ticketId: req.params.ticketId,
      paymentStatus: "success",
    });
    if (!attendee)
      return res.status(404).json({ error: "Ticket not found or unpaid" });

    const event = await Event.findOne({ id: attendee.eventId });

    res.json({
      name: attendee.name,
      email: attendee.email,
      paymentDate: attendee.paymentDate,
      ticketType: attendee.ticketType,
      event: event
        ? {
            name: event.name,
            date: event.date,
            time: event.time,
            location: event.location,
          }
        : {},
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid token or server error" });
  }
});

// Manual search by last 4 of ticketId
app.get("/api/tickets/search/:last4", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const last4 = req.params.last4;
    if (!last4 || last4.length !== 4)
      return res.status(400).json({ error: "Invalid search term" });

    const matches = await Attendee.find({
      ticketId: { $regex: `${last4}$`, $options: "i" },
      paymentStatus: "success",
    }).select("name email ticketId ticketType");

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findOne({ id: req.params.id });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// Seed
app.post("/api/events/seed", async (req, res) => {
  try {
    await Event.deleteMany();
    const sampleEvents = [
      {
        id: "1",
        name: "OUTSYDCVLTR & FRIENDS All White Edition",
        date: "August 1st, 2025",
        time: "7:00 PM",
        location: "Victor Uwaifo Creative Hub, Benin City, Airport Road",
        image: "/img/IMG_9588.JPG",
        price: 0,
      },
      {
        id: "2",
        name: "Wassup Benin",
        date: "December 2025",
        time: "8:00 PM",
        location: "Victor Uwaifo Creative Hub, Benin City, Airport Road",
        image: "/img/IMG_9589.JPG",
        price: 0,
      },
      {
        id: "3",
        name: "Galactic Jazz Session",
        date: "Coming Soon",
        time: "6:30 PM",
        location: "Coming Soon",
        image: "/img/IMG_9590.JPG",
        price: 0,
      },
    ];
    await Event.insertMany(sampleEvents);
    res.json({ message: "Events seeded successfully" });
  } catch (err) {
    res.status(500).json({ error: "Seeding failed" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

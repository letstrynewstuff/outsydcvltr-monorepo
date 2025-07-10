const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cors = require("cors");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const axios = require("axios");
const path = require("path");

require("dotenv").config();


const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://outsydcvltr-monorepo.vercel.app",
      "https://outsydcvltr.com",
      "https://www.outsydcvltr.com",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/img", express.static(path.join(__dirname, "src/assets/img")));

// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schemas
const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  date: String,
  time: String,
  location: String,
  image: String,
  price: {
    generalAdmission: { type: Number, default: 0 },
    gengOf6: { type: Number, default: 0 },
    comingSoon: { type: Boolean, default: false },
  },
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
    enum: ["presale", "regular", "diamond", "generalAdmission", "gengOf6"],
    default: "regular",
  },
  paymentDate: Date,
  createdAt: { type: Date, default: Date.now },
  used: { type: Boolean, default: false },
});

const Attendee = mongoose.model("Attendee", attendeeSchema);

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = mongoose.model("Admin", adminSchema);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
transporter.verify((err) => {
  if (err) console.error("Email transporter error:", err);
  else console.log("Email transporter ready");
});

// Email validation regex
const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

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

// Always-available route to set/reset admin password
app.post("/api/admin/set-password", async (req, res) => {
  const { username } = req.body;
  const newPassword = "outsydcvltr12431!!admin";

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Set-password error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Create admin
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

// Presale registration
app.post("/api/presale/register", async (req, res) => {
  const { name, email, eventId, ticketType } = req.body;
  if (!name || !email || !eventId || !ticketType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const event = await Event.findOne({ id: eventId });
    if (!event) return res.status(404).json({ error: "Event not found" });

    const validTicketTypes = ["presale", "generalAdmission", "gengOf6"];
    if (!validTicketTypes.includes(ticketType)) {
      return res.status(400).json({ error: "Invalid ticket type" });
    }

    let ticketPrice = 0;
    if (event.name === "OUTSYDCVLTR & FRIENDS All White Edition") {
      if (event.price.comingSoon) {
        return res.status(403).json({ error: "Tickets not available yet" });
      }
      if (ticketType === "generalAdmission") {
        ticketPrice = event.price.generalAdmission;
      } else if (ticketType === "gengOf6") {
        ticketPrice = event.price.gengOf6;
      }
    } else if (event.price.comingSoon) {
      return res.status(403).json({ error: "Tickets not available yet" });
    }

    if (ticketType === "presale") {
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
    }

    const existingTicket = await Attendee.findOne({
      email,
      eventId,
      ticketType,
    });
    if (existingTicket) {
      return res.status(400).json({
        error: `Email already registered for this event's ${ticketType} ticket`,
      });
    }

    const ticketId = crypto.randomBytes(16).toString("hex");
    const paymentReference = new Date().getTime().toString();
    const attendee = new Attendee({
      name,
      email,
      eventId,
      ticketId,
      ticketType,
      paymentStatus: ticketType === "presale" ? "success" : "pending",
      paymentReference,
      paymentDate: new Date(),
    });
    await attendee.save();

    if (ticketType === "presale") {
      const qrCodeData = await QRCode.toDataURL(ticketId, {
        errorCorrectionLevel: "H",
        width: 200,
      });

      await transporter.sendMail({
        from: `"Outsydcvltr Events" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Your ${ticketType} Ticket for ${event.name}`,
        html: `
          <h2>Dear ${name},</h2>
          <p>Thanks for registering, this is your ${ticketType} ticket for <strong>${event.name}</strong>.</p>
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p><strong>Ticket Type:</strong> ${ticketType}</p>
          <p><strong>Price:</strong> ₦0</p>
          <p>Scan this QR code at the event:</p>
          <img src="${qrCodeData}" alt="Ticket QR Code" style="width:200px;" />
        `,
      });

      await transporter.sendMail({
        from: `"Outsydcvltr Events" <${process.env.GMAIL_USER}>`,
        to: "mik5633257@gmail.com",
        subject: `New ${ticketType} Ticket for ${event.name}`,
        html: `
          <p><strong>Buyer:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p><strong>Ticket Type:</strong> ${ticketType}</p>
          <p><strong>Price:</strong> ₦0</p>
        `,
      });

      res.json({
        message: "Presale ticket registered",
        qrCode: qrCodeData,
        ticketId,
        ticketPrice: 0,
      });
    } else {
      res.json({
        message: `${ticketType} ticket registered, awaiting payment`,
        ticketId,
        ticketPrice,
        paymentReference,
      });
    }
  } catch (err) {
    console.error("Presale registration error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Verify payment
app.post("/api/presale/verify", async (req, res) => {
  const { reference, eventId, email, ticketType } = req.body;
  if (!reference || !eventId || !email || !ticketType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = response.data;
    if (paymentData.status && paymentData.data.status === "success") {
      const attendee = await Attendee.findOne({
        email,
        eventId,
        ticketType,
        paymentReference: reference,
        paymentStatus: "pending",
      });
      if (!attendee) {
        return res
          .status(404)
          .json({ error: "Ticket not found or already verified" });
      }

      attendee.paymentStatus = "success";
      await attendee.save();

      const event = await Event.findOne({ id: eventId });
      if (!event) return res.status(404).json({ error: "Event not found" });

      const qrCodeData = await QRCode.toDataURL(attendee.ticketId, {
        errorCorrectionLevel: "H",
        width: 200,
      });

      await transporter.sendMail({
        from: `"Outsydcvltr Events" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Your ${ticketType} Ticket for ${event.name}`,
        html: `
          <h2>Dear ${attendee.name},</h2>
          <p>Thanks for your payment! This is your ${ticketType} ticket for <strong>${
          event.name
        }</strong>.</p>
          <p><strong>Ticket ID:</strong> ${attendee.ticketId}</p>
          <p><strong>Ticket Type:</strong> ${ticketType}</p>
          <p><strong>Price:</strong> ₦${paymentData.data.amount / 100}</p>
          <p>Scan this QR code at the event:</p>
          <img src="${qrCodeData}" alt="Ticket QR Code" style="width:200px;" />
        `,
      });

      await transporter.sendMail({
        from: `"Outsydcvltr Events" <${process.env.GMAIL_USER}>`,
        to: "mik5633257@gmail.com",
        subject: `New ${ticketType} Ticket for ${event.name}`,
        html: `
          <p><strong>Buyer:</strong> ${attendee.name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Ticket ID:</strong> ${attendee.ticketId}</p>
          <p><strong>Ticket Type:</strong> ${ticketType}</p>
          <p><strong>Price:</strong> ₦${paymentData.data.amount / 100}</p>
        `,
      });

      res.json({
        message: "Payment verified, ticket issued",
        qrCode: qrCodeData,
        ticketId: attendee.ticketId,
        ticketPrice: paymentData.data.amount / 100,
      });
    } else {
      return res.status(400).json({ error: "Payment verification failed" });
    }
  } catch (err) {
    console.error("Payment verification error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Ticket scan
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

    if (attendee.used)
      return res.status(400).json({ error: "Ticket already used" });

    attendee.used = true;
    await attendee.save();

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

// Manual search
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
    }).select("name email ticketId ticketType used");

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Events with pagination
app.get("/api/events", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const events = await Event.find().skip(skip).limit(limit);
    const total = await Event.countDocuments();

    console.log("Fetched events:", events);
    res.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Failed to fetch events:", err.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findOne({ id: req.params.id });
    if (!event) return res.status(404).json({ error: "Event not found" });
    console.log("Fetched event by ID:", event);
    res.json(event);
  } catch (err) {
    console.error("Failed to fetch event:", err.message);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// Seed events
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
        price: {
          generalAdmission: 3000,
          gengOf6: 25000,
          comingSoon: false,
        },
      },
      {
        id: "2",
        name: "Wassup Benin",
        date: "December 2025",
        time: "8:00 PM",
        location: "Victor Uwaifo Creative Hub, Benin City, Airport Road",
        image: "/img/IMG_9589.JPG",
        price: {
          comingSoon: true,
        },
      },
    ];
    await Event.insertMany(sampleEvents);
    console.log("Seeded events:", sampleEvents);
    res.json({ message: "Events seeded successfully" });
  } catch (err) {
    console.error("Seeding failed:", err.message);
    res.status(500).json({ error: "Seeding failed" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

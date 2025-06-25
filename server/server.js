// const express = require("express");
// const mongoose = require("mongoose");
// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const crypto = require("crypto");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const QRCode = require("qrcode");
// const path = require("path");

// dotenv.config();

// const app = express();
// app.use(
//   cors({
//     origin: ["http://localhost:4173"], // or your frontend prod URL
//     credentials: true,
//   })
// );
// app.use(express.json());

// // ✅ Fixed path to serve images from /sever/src/assets/img
// app.use("/img", express.static(path.join(__dirname, "sever/src/assets/img")));

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// });

// const eventSchema = new mongoose.Schema({
//   id: { type: String, required: true, unique: true },
//   name: String,
//   date: String,
//   time: String,
//   location: String,
//   image: String,
//   price: Number,
// });
// const Event = mongoose.model("Event", eventSchema);

// const attendeeSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   eventId: String,
//   paymentReference: String,
//   paymentStatus: { type: String, default: "pending" },
//   ticketId: { type: String, unique: true },
//   ticketType: {
//     type: String,
//     enum: ["presale", "regular", "diamond"],
//     default: "regular",
//   },
//   paymentDate: Date,
//   createdAt: { type: Date, default: Date.now },
// });
// const Attendee = mongoose.model("Attendee", attendeeSchema);

// const adminSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });
// const Admin = mongoose.model("Admin", adminSchema);

// app.get("/", (req, res) => res.send("API is running"));

// app.post("/api/admin/login", async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) {
//     return res.status(400).json({ error: "Missing username or password" });
//   }
//   try {
//     const admin = await Admin.findOne({ username });
//     if (!admin) return res.status(401).json({ error: "Invalid credentials" });
//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
//     const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     res.json({ token });
//   } catch (err) {
//     console.error("Login error:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// app.post("/api/admin/create", async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) {
//     return res.status(400).json({ error: "Missing username or password" });
//   }
//   try {
//     const existingAdmin = await Admin.findOne({ username });
//     if (existingAdmin) return res.status(400).json({ error: "Admin exists" });
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const admin = new Admin({ username, password: hashedPassword });
//     await admin.save();
//     res.json({ message: "Admin created" });
//   } catch (err) {
//     console.error("Admin creation error:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// app.post("/api/presale/register", async (req, res) => {
//   const { name, email, eventId, ticketType } = req.body;
//   if (!name || !email || !eventId || !ticketType) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }
//   try {
//     const event = await Event.findOne({ id: eventId });
//     if (!event) return res.status(404).json({ error: "Event not found" });

//     const existingTicket = await Attendee.findOne({
//       email,
//       eventId,
//       ticketType: "presale",
//     });
//     if (existingTicket) {
//       return res.status(400).json({
//         error: "Email already registered for this event's presale ticket",
//       });
//     }

//     const ticketId = crypto.randomBytes(16).toString("hex");
//     const attendee = new Attendee({
//       name,
//       email,
//       eventId,
//       ticketId,
//       ticketType,
//       paymentStatus: "success",
//       paymentDate: new Date(),
//     });
//     await attendee.save();

//     const qrCodeData = await QRCode.toDataURL(ticketId);

//     await transporter.sendMail({
//       from: `"Event Ticketing" <${process.env.GMAIL_USER}>`,
//       to: email,
//       subject: `Presale Ticket for ${event.name}`,
//       html: `
//         <p>Dear ${name},</p>
//         <p>Your presale ticket for <strong>${event.name}</strong> on ${event.date} at ${event.time}, ${event.location} is confirmed.</p>
//         <p><strong>Ticket ID:</strong> ${ticketId}</p>
//         <p><img src="${qrCodeData}" alt="Ticket QR Code" style="width:200px;" /></p>
//         <p>Show this QR code at the event.</p>
//       `,
//     });

//     await transporter.sendMail({
//       from: `"Event Ticketing" <${process.env.GMAIL_USER}>`,
//       to: process.env.ORGANIZER_EMAIL,
//       subject: `New Presale Ticket for ${event.name}`,
//       html: `
//         <p>${name} (${email}) registered a presale ticket for <strong>${event.name}</strong> on ${event.date}, ${event.time}, ${event.location}.</p>
//         <p><strong>Ticket ID:</strong> ${ticketId}</p>
//       `,
//     });

//     res.json({
//       message: "Presale ticket registered",
//       qrCode: qrCodeData,
//       ticketId,
//     });
//   } catch (err) {
//     console.error("Presale registration error:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// app.get("/api/events", async (req, res) => {
//   try {
//     const events = await Event.find();
//     res.json(events);
//   } catch (err) {
//     console.error("Events error:", err.message);
//     res.status(500).json({ error: "Failed to fetch events" });
//   }
// });

// app.get("/api/events/:id", async (req, res) => {
//   try {
//     const event = await Event.findOne({ id: req.params.id });
//     if (!event) return res.status(404).json({ error: "Event not found" });
//     res.json(event);
//   } catch (err) {
//     console.error("Event error:", err.message);
//     res.status(500).json({ error: "Failed to fetch event" });
//   }
// });

// app.get("/api/attendees", async (req, res) => {
//   const token = req.headers["authorization"]?.split(" ")[1];
//   if (!token) return res.status(401).json({ error: "No token provided" });
//   try {
//     jwt.verify(token, process.env.JWT_SECRET);
//     const attendees = await Attendee.find({ paymentStatus: "success" });
//     res.json(attendees);
//   } catch (err) {
//     console.error("Attendees error:", err.message);
//     res.status(401).json({ error: "Invalid token" });
//   }
// });

// app.get("/api/tickets/scan/:ticketId", async (req, res) => {
//   const token = req.headers["authorization"]?.split(" ")[1];
//   if (!token) return res.status(401).json({ error: "No token provided" });
//   try {
//     jwt.verify(token, process.env.JWT_SECRET);
//     const attendee = await Attendee.findOne({
//       ticketId: req.params.ticketId,
//       paymentStatus: "success",
//     }).populate("eventId", "name date time location");
//     if (!attendee) {
//       return res.status(404).json({ error: "Ticket not found or unpaid" });
//     }
//     res.json({
//       name: attendee.name,
//       email: attendee.email,
//       paymentDate: attendee.paymentDate,
//       ticketType: attendee.ticketType,
//       event: attendee.eventId,
//     });
//   } catch (err) {
//     console.error("Scan error:", err.message);
//     res.status(401).json({ error: "Invalid token or server error" });
//   }
// });

// app.post("/api/events/seed", async (req, res) => {
//   try {
//     await Event.deleteMany();
//     const sampleEvents = [
//       {
//         id: "1",
//         name: "OUTSYDCVLTR & FRIENDS All White Edition",
//         date: "August 1st, 2025",
//         time: "7:00 PM",
//         location: "Victor Uwaifo Creative Hub, Benin City, Airport Road",
//         image: "/img/IMG_9228.PNG",
//         price: 0,
//       },
//       {
//         id: "2",
//         name: "Wassup Benin",
//         date: "December 2025",
//         time: "8:00 PM",
//         location: "Victor Uwaifo Creative Hub, Benin City, Airport Road",
//         image: "/img/IMG_7147.PNG",
//         price: 0,
//       },
//       {
//         id: "3",
//         name: "Galactic Jazz Session",
//         date: "Coming Soon",
//         time: "6:30 PM",
//         location: "Coming Soon",
//         image: "/img/wassup.jpg",
//         price: 0,
//       },
//     ];
//     await Event.insertMany(sampleEvents);
//     res.json({ message: "Events seeded successfully" });
//   } catch (err) {
//     console.error("Seeding error:", err.message);
//     res.status(500).json({ error: "Seeding failed" });
//   }
// });

// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

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

// Serve images from /sever/src/assets/img
app.use("/img", express.static(path.join(__dirname, "sever/src/assets/img")));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify email transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter error:", error);
  } else {
    console.log("Email transporter ready");
  }
});

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

app.get("/", (req, res) => res.send("API is running"));

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/admin/create", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }
  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) return res.status(400).json({ error: "Admin exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, password: hashedPassword });
    await admin.save();
    res.json({ message: "Admin created" });
  } catch (err) {
    console.error("Admin creation error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/presale/register", async (req, res) => {
  const { name, email, eventId, ticketType } = req.body;
  if (!name || !email || !eventId || !ticketType) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
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

    // Generate QR code with error handling
    let qrCodeData;
    try {
      qrCodeData = await QRCode.toDataURL(ticketId, {
        errorCorrectionLevel: "H",
        width: 200,
      });
      console.log(
        "QR Code generated for ticketId:",
        ticketId,
        "Data:",
        qrCodeData.slice(0, 50)
      );
    } catch (qrError) {
      console.error("QR Code generation error:", qrError.message);
      return res.status(500).json({ error: "Failed to generate QR code" });
    }

    // Send email to buyer
    try {
      await transporter.sendMail({
        from: `"Outsydeville Events" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Your Presale Ticket for ${event.name}`,
        html: `
          <h2>Dear ${name},</h2>
          <p>Your presale ticket for <strong>${event.name}</strong> on ${event.date} at ${event.time}, ${event.location} is confirmed.</p>
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p>Scan the QR code below at the event:</p>
          <img src="${qrCodeData}" alt="Ticket QR Code" style="width:200px;" />
          <p>Enjoy the event!</p>
          <p>Outsydeville Team</p>
        `,
      });
      console.log("Buyer email sent to:", email);
    } catch (emailError) {
      console.error("Buyer email error:", emailError.message);
    }

    // Send admin notification
    try {
      await transporter.sendMail({
        from: `"Outsydeville Events" <${process.env.GMAIL_USER}>`,
        to: "mik5633257@gmail.com",
        subject: `New Presale Ticket for ${event.name}`,
        html: `
          <p>New presale ticket registered:</p>
          <p><strong>Buyer:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Event:</strong> ${event.name}</p>
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p><strong>Ticket Type:</strong> ${ticketType}</p>
        `,
      });
      console.log("Admin email sent to: mik5633257@gmail.com");
    } catch (emailError) {
      console.error("Admin email error:", emailError.message);
    }

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

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error("Events error:", err.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findOne({ id: req.params.id });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error("Event error:", err.message);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

app.get("/api/attendees", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const attendees = await Attendee.find({ paymentStatus: "success" });
    res.json(attendees);
  } catch (err) {
    console.error("Attendees error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
});

app.get("/api/tickets/scan/:ticketId", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const attendee = await Attendee.findOne({
      ticketId: req.params.ticketId,
      paymentStatus: "success",
    }).populate("eventId", "name date time location");
    if (!attendee) {
      return res.status(404).json({ error: "Ticket not found or unpaid" });
    }
    res.json({
      name: attendee.name,
      email: attendee.email,
      paymentDate: attendee.paymentDate,
      ticketType: attendee.ticketType,
      event: attendee.eventId,
    });
  } catch (err) {
    console.error("Scan error:", err.message);
    res.status(401).json({ error: "Invalid token or server error" });
  }
});

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
    console.error("Seeding error:", err.message);
    res.status(500).json({ error: "Seeding failed" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
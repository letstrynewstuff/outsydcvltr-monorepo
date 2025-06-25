import Img from "../assets/img/IMG_9228.PNG"
import Img2 from "../assets/img/IMG_7147.PNG"
import Img3 from "../assets/img/wassup.jpg"

export const events = [
  {
    id: 1,
    name: "Outsydcvltr & Friends All White Edition",
    date: "August 1st, 2025",
    time: "7:00 PM",
    location: "Victor Uwaifo Creative Hub, Benin City, Airport road",
    image: Img,
    tickets: [
      { type: "General Admission", price: 5000, disabled: true },
      { type: "VIP", price: 10000, disabled: true },
      { type: "Presale", price: 0, limitOne: true, presaleAvailable: true }, // Limit to one per user, popup to be implemented
    ],
    // Popup Logic: When "Presale" is clicked, show a form with name, email, and optional phone. On submit, show success popup with emoji (e.g., "🎉") and message "Success! An email will be sent to you with your ticket."
  },
  {
    id: 2,
    name: "Wassup Benin",
    date: "December, 2025",
    time: "8:00 PM",
    location: "Victor Uwaifo Creative Hub, Benin City, Airport road",
    image: Img2,
    tickets: [
      { type: "General Admission", price: 3000, disabled: true },
      { type: "VIP", price: 7000, disabled: true },
      { type: "Presale", price: 1500, limitOne: true, presaleAvailable: true },
    ],
    // Popup Logic: When "Presale" is clicked, show a form with name, email, and optional phone. On submit, show success popup with emoji (e.g., "🎉") and message "Success! An email will be sent to you with your ticket."
  },
  {
    id: 3,
    name: "Galactic Jazz Session",
    date: "Cominng Soon",
    time: "6:30 PM",
    location: "Coming Soon",
    image: Img3,
    tickets: [
      { type: "General Admission", price: 4000, disabled: true },
      { type: "VIP", price: 8000, disabled: true },
      { type: "Presale", price: 2000, limitOne: true, presaleAvailable: true }, // Limit to one per user, popup to be implemented
    ],
    // Popup Logic: When "Presale" is clicked, show a form with name, email, and optional phone. On submit, show success popup with emoji (e.g., "🎉") and message "Success! An email will be sent to you with your ticket."
  },
];

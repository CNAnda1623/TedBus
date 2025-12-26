# 🚌 TEDBUS – Smart Travel Booking Platform

A full‑stack travel booking web application that allows users to **book bus seats**, **rent cabs**, and **request custom bus bookings**, all through a **single unified platform and payment flow**. TEDBUS is designed to provide a smooth, modern, and user‑friendly booking experience similar to large‑scale travel portals.

---

## 🌟 Project Overview

TEDBUS is a learning‑focused yet production‑style project built to understand how real‑world travel platforms work end‑to‑end. The application combines a **feature‑rich Angular frontend** with a **Node.js + Express backend**, uses **MongoDB for structured data**, and **Supabase Storage** for handling image uploads in community features.

The system focuses on **core booking flows**, **community interaction**, and **clean frontend–backend integration**, without role‑based admin panels or complex security layers.

---

## ✨ Key Features

### 🚌 Bus Seat Booking

* Browse available buses and routes
* Select seats visually
* Enter passenger details
* Complete booking using a shared payment flow

### 🚖 Cab Rental

* Choose cab type and trip details
* Provide pickup and drop locations
* Customer details handled separately from bus bookings
* Integrated into the same payment page as bus booking

### 🚌 Custom Bus Booking

* Request full bus hire for events or group travel
* Capture custom requirements and contact details
* Stored and managed as a separate booking type

### 💳 Unified Payment Flow

* Bus booking, cab booking, and custom bus booking all connect to **one common payment page**
* Reduces duplication and keeps business logic consistent

### 🌐 Community Hub

* Users can create posts with images and text
* Images uploaded to **Supabase Storage**
* Post data stored in **MongoDB**
* Default fallback posts shown if no user posts exist

### 🤖 AI Chatbot (Frontend Integration)

* Dedicated chatbot UI component
* Designed to assist users with navigation and basic queries
* Built for future AI/RAG integration

### 🎨 Modern UI & UX

* Clean, minimal layout
* Responsive design
* Reusable Angular components
* Consistent theme and branding

---

## 🛠️ Tech Stack

### Frontend

* **Angular** (Standalone component architecture)
* **TypeScript**
* **HTML5 / SCSS / CSS**
* **Tailwind CSS** (for styling and layout)

### Backend

* **Node.js**
* **Express.js**
* **MongoDB** (via Mongoose)

### Storage & Services

* **Supabase Storage** – image uploads
* **MongoDB** – bookings, customers, routes, community posts

### Tooling

* Git & GitHub
* Netlify (Frontend hosting)
* Render (Backend hosting)

---

## 🏗️ Project Structure (High‑Level)

```
TEDBUS/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── component/        # UI components (chatbot, navbar, pages)
│   │   │   ├── service/          # API & business logic services
│   │   │   ├── model/            # TypeScript data models
│   │   │   ├── config/           # App configuration
│   │   │   ├── app.module.ts
│   │   │   └── app-routing.module.ts
│   │   ├── assets/               # Images & static assets
│   │   ├── styles.css
│   │   └── main.ts
│   ├── angular.json
│   ├── package.json
│   └── netlify.toml
│
├── server/
│   ├── controllers/              # Request handlers
│   ├── models/                   # MongoDB schemas
│   ├── routes/                   # API routes
│   ├── uploads/                  # Local uploads (dev only)
│   ├── supabaseClient.js
│   ├── index.js                  # Server entry point
│   └── package.json
│
└── README.md
```

---

## 🔁 Application Flow (Simplified)

1. User visits the landing page
2. Selects a service:

   * Bus booking
   * Cab rental
   * Custom bus booking
3. Enters required details
4. Redirected to a **shared payment page**
5. Booking data saved to MongoDB
6. Optional interaction with the Community Hub or Chatbot

---

## ▶️ Running the Project Locally

### Prerequisites

* Node.js (v18+ recommended)
* MongoDB (local or cloud)
* Angular CLI

### Backend Setup

```bash
cd frontend/server
npm install
node index.js
```

### Frontend Setup

```bash
cd frontend
npm install
ng serve
```

* Frontend: `http://localhost:4200`
* Backend API: `http://localhost:3000` (or configured port)

---

## ⚠️ Known Limitations

* No role‑based admin dashboard
* No advanced security or authorization layers
* Payment gateway is simulated / basic
* Community features are minimal by design

---

## 🧪 Troubleshooting (Optional)

* **Images not showing in community posts**

  * Ensure Supabase Storage bucket is public
  * Confirm image URLs are saved in MongoDB

* **Backend changes not reflecting (Render)**

  * Push changes to GitHub before redeploying

* **Uploads working locally but not on server**

  * Local file storage is not persistent on cloud platforms

---

## 🎯 Learning Outcomes

* Designing real‑world booking flows
* Structuring Angular applications at scale
* Handling multiple booking types with shared logic
* Integrating third‑party storage (Supabase)
* Managing frontend–backend communication cleanly

---

## 📌 Notes

* This project is built for **learning, evaluation, and portfolio purposes**
* Focus is on **architecture, clarity, and integration**, not enterprise security
* Future improvements can include authentication, payment gateways, and admin dashboards

---

**TEDBUS – Smart Travel, Simplified.**

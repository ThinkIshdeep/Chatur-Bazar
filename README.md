# Chatur Bazar 🚀

**Chatur Bazar** is a futuristic, web-based Retail Operating System (OS) designed for speed, efficiency, and automation. It combines a high-performance Point of Sale (POS) interface with intelligent inventory management, automated supply chain triggers, and a modern UI that adapts to your environment.

## ✨ Key Features

### 🖥️ Smart POS Interface
- **Hybrid Input**: Support for barcode scanners, keyboard typing, and mouse interaction.
- **Velocity Trap**: Intelligently distinguishes between a barcode scanner input (rapid keystrokes) and manual typing.
- **Combo System**: Gamified UI with "Combo" streaks when scanning items rapidly.
- **Dynamic Cart**: Real-time total calculation with tax/pricing logic.

### 🌗 Adaptive Theming
- **Light/Dark Mode**: Toggle between a crisp, high-contrast Day mode for bright shops and a "Cyberpunk" Dark mode for low-light environments.
- **Visual Feedback**: Neon glows, smooth animations, and backdrop blurs enhance the user experience.

### 🤖 Auto-Pacing & Automation
- **Smart Monitoring**: The system continuously monitors stock levels as items are sold.
- **Auto-Restock Triggers**: 
  - **Warning**: At 5 units remaining.
  - **Critical**: At 2 units remaining.
- **WhatsApp Integration**: When a threshold is breached, the system generates a pre-filled supplier order message and opens WhatsApp Web/App to send it instantly.

### 📦 Inventory Management
- **Receive Stock**: Dedicated modal to scan/search items and add incoming shipments to inventory.
- **Quick Add**: Easily add new products to the catalog if a scanned barcode isn't recognized.
- **CSV Export**: Download your entire inventory database as a CSV file for accounting.

### 🗣️ Voice & Audio
- **Voice Commands**: Click the mic icon to add items by speaking their name (e.g., "Add Maggi").
- **Audio Engine**: Custom sound effects for:
  - `Beep`: Successful scan.
  - `Buzz`: Error/Out of stock.
  - `Cha-Ching`: Successful payment.
  - `Click`: UI interactions.

### 🧾 Digital Receipts
- **Eco-Friendly**: Instead of printing thermal paper, receipts are formatted and sent directly to the customer's WhatsApp.

---

## 🎹 Keyboard Shortcuts

Designed for "Heads-up" operation, you can run the entire shop without touching the mouse.

| Key | Action |
| :--- | :--- |
| **`/`** | Focus Search Bar |
| **`Space`** | Process Payment / Open Checkout |
| **`Esc`** | Close Modals / Clear Selection / Cancel |
| **`1-9`** | Quick Add specific items (via Shortcut ID) |
| **`Enter`** | Confirm Scan / Add to Cart |

---

## 🏗️ Architecture & MVP Design Note
**Note for Judges:**
For this Hackathon MVP, we have implemented a **"Local-First" Architecture** using Browser Storage and Mock Data.
- **Why?** To ensure **Zero-Latency** performance and offline reliability during the demo presentation.
- **Production Plan:** The codebase is structured with strict TypeScript interfaces (`Product`, `CartItem`) to easily swap the current `localStorage` layer with **Google Firebase Firestore** and **Cloud Functions** for the production release (Phase 2).
- **Current Status:** The "Velocity Trap" algorithms, Voice Command (Web Speech API), and WhatsApp Integration are **fully functional** in this deployment.

---

## 🛠️ Technical Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS (with `darkMode: 'class'`)
- **Icons**: Lucide React
- **Audio**: Web Audio API (Custom Oscillator Engine)
- **Speech**: Web Speech API (`webkitSpeechRecognition`)

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm start
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📱 Mobile Support
The application is fully responsive. On mobile devices:
- The Cart becomes a slide-out drawer.
- A floating "Pay" bar appears at the bottom.
- Layouts adjust from grids to lists automatically.

## ⚠️ Browser Permissions
To use all features, please allow the following permissions when prompted:
- **Microphone**: Required for Voice Commands.
- **Audio**: Required for the Audio Engine sound effects.

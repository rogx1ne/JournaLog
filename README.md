# 📔 JournaLog

A minimalist, **Apple Notes inspired** digital notebook and personal journaling application. Built for the modern web with **React**, **TypeScript**, and **Dexie.js**.

JournaLog transforms the traditional text-based journal into a **Hybrid Tactical Notebook**, allowing you to seamlessly switch between typing your thoughts and scribbling diagrams—all on the same digital paper.

[Live Preview](https://logjournal.vercel.app/)

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Key Features

* **📝 Apple Notes Style Hybrid Interface:** A unified "Paper" surface where you can type and scribble on the same page. Toggle between **Type Mode** and **Scribble Mode** instantly.
* **🎨 Integrated Canvas:** Hand-draw diagrams, sketches, or write in your own handwriting using the built-in HTML5 Canvas layer.
* **🔒 100% Private & Offline-First:** Powered by **IndexedDB (via Dexie.js)**. Your data stays in your browser's database, not on a server. No accounts, no tracking.
* **🧠 Sentiment Analysis:** Automatically analyzes the mood of your entries using natural language processing to provide emotional insights.
* **💾 Data Ownership:** Robust Backup & Restore functionality. Export your entire notebook as a JSON file or import existing backups.
* **🌓 Dark & Light Mode:** A beautifully crafted UI with notebook-style aesthetics (ruled lines, margin markers) that adapts to your theme preference.
* **📱 Fully Responsive:** Desktop-class features optimized for mobile and tablet touch interfaces.

## 🛠️ Tech Stack

* **Frontend:** [React 19](https://reactjs.org/)
* **Database:** [Dexie.js](https://dexie.org/) (IndexedDB Wrapper)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Analysis:** [Sentiment](https://www.npmjs.com/package/sentiment)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** Pure CSS with CSS Variables (Notebook-inspired custom theme).

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/rogx1ne/journalog.git
    cd journalog
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  Open your browser and visit `http://localhost:5173`.

## 📂 Project Structure

```text
src/
├── components/
│   ├── Canvas.tsx          # HTML5 Canvas layer for sketching
│   ├── EntryItem.tsx       # Individual entry card with sentiment & thumbnails
│   ├── EntryList.tsx       # Scrollable list of notebook entries
│   ├── EntryModal.tsx      # Full-page view for reading entries
│   ├── NewEntryModal.tsx   # Integrated Apple-Notes style editor
│   ├── SettingsDrawer.tsx  # Theme and Data portability controls
│   └── TypingAnimation.tsx # Dynamic entry trigger on the home screen
├── db.ts                   # Dexie.js IndexedDB configuration
├── types.ts                # TypeScript interfaces (JournalEntry)
├── App.tsx                 # Core Application Logic & State
└── App.css                 # Notebook-style CSS & Variables
```

## 📖 How to Use

### Creating a Hybrid Entry
Click the **Typing Animation** box to start a new entry.
* **Type Mode (Edit Icon):** Standard distraction-free typing.
* **Scribble Mode (Pen Icon):** Draw directly over the notebook lines.
* **Saving:** Both text and sketches are saved together as a single cohesive entry.

### Managing Data
Access the **Gear Icon (⚙️)** in the top right:
* **Export:** Downloads your entire database as a JSON backup.
* **Import:** Restore from a previous backup (Overwrites or Appends).

---
Developed with ❤️ for privacy-conscious thinkers.

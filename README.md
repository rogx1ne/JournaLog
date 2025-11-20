# 📔 My Offline Journal (LOG)

This is a simple, offline-first personal journal application built with React, TypeScript, and Vite. All journal entries are saved directly to your browser's `localStorage`, meaning your data never leaves your computer and is available immediately when you open the app.

## ✨ Features

* **Offline First:** All data is stored in `localStorage`. No internet connection or account required.
* **Light & Dark Themes:** Easily toggle between light and dark modes. Your preference is also saved in `localStorage`.
* **Responsive Design:** A two-column layout for desktop and a clean, single-column layout for mobile.
* **View Full Entries:** Click any entry in the list to open a modal popup and read the full text.
* **Scrollable List:** The entry list scrolls independently, even if you have hundreds of entries.
* **Built with Modern Tools:** Uses React hooks, TypeScript, and a fast Vite build environment.

## 📸 App Preview



![App Screenshot in Dark Mode](screenshots/darkmode.png)

## 🛠️ Tech Stack

* **Frontend:** [React](https://reactjs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Storage:** Browser `localStorage`
* **Styling:** CSS with CSS Variables for theming

## 🚀 Getting Started

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rogx1ne/JournaLog
    cd JournaLog
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

The app will be available at `http://localhost:5173`.

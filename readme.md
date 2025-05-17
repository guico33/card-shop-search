# Card Shop Search

**Card Shop Search** is a modern web app that streamlines Magic: The Gathering card shopping across Singapore and Japan. Instantly search, compare, and open links to multiple card shops, optimizing the buying experience.

[🌐 Live Demo](https://guico33.github.io/card-shop-search/)

---

## ✨ Features

- **🔎 Fast Card Search:**  
  Search for Magic: The Gathering cards using the Scryfall API, or paste a list of card names for batch processing.

- **🛒 Multi-Shop Comparison:**  
  Instantly generate and open links to all supported shops for each card, compare prices and availability in one click.

- **📋 Drag & Drop Customization:**  
  Reorder shop columns to match your preferences with drag-and-drop.

- **🕑 Search History:**  
  Logged-in users get a searchable, timestamped history of their last 100 card lookups, synced to Firebase Firestore.

- **🔐 Google Authentication:**  
  Secure sign-in with Google, powered by Firebase Authentication.

- **💾 Offline-First Storage:**  
  Search history and preferences are saved in IndexedDB when not logged in.

- **📱 Responsive Design:**  
  Tabular layout for desktop, card layout for mobile.

- **⚡️ Performance:**  
  Built with React, TypeScript, and Vite for a snappy, modern UI.

---

## 🛠️ Tech Stack

- **Frontend:** React (Hooks & Context), TypeScript, Vite, Material UI
- **Backend/Storage:** Firebase Firestore, Firebase Auth, IndexedDB
- **APIs:** Scryfall (MTG card data)
- **State & Data:** React Query for async state management
- **Testing:** Cypress (E2E), Jest (unit tests)
- **CI/CD:** GitHub Actions (lint, type-check, tests, deploy to GitHub Pages)

---

## 🚀 How It Works

1. **Search** for a card or paste a list, get instant links to all supported shops.
2. **Open all links** for a card or shop in one click for fast price comparison.
3. **Sign in** with Google to sync your search history across devices, or use the app offline with local storage.
4. **Reorder** shop columns to fit your workflow.

---

## 🏗️ Getting Started

1. **Clone the repo:**

   ```zsh
   git clone https://github.com/guico33/card-shop-search.git
   cd card-shop-search
   ```

2. **Install dependencies:**

   ```zsh
   yarn install
   ```

3. **Run locally:**

   ```zsh
   yarn dev
   ```

---

## 📄 License

MIT

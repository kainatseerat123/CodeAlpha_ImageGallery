# CodeAlpha Advanced Image Gallery

This repository contains my submission for Task 1 (Image Gallery) of the Frontend Development Internship at CodeAlpha.

## 📁 Repository Structure
To showcase both baseline understanding and modern frontend architecture, this project is split into two distinct versions:

1. **`Vanilla-html-Version`**: Built strictly using core HTML, CSS Grid, and JavaScript. This version covers the primary criteria of the task, featuring a responsive gallery grid, hover animations, custom styling, and a clean lightbox view.
2. **`React-API-Version`**: An upgraded, production-ready web application built with **React (Vite)**, **Axios**, and **React Intersection Observer**. It features live image fetching from the **Unsplash API**, **Infinite Scroll**, **Search**, **Dark Mode**, and persistent **Favorites (LocalStorage)**.

## ✨ Features (React Version)
- 🖥️ Exactly 4 items per row on desktop (Responsive Grid Layout).
- 🔄 Infinite Scroll loading via Intersection Observer API.
- 🔍 Dynamic search matching Unsplash API endpoints.
- 🌙 Smooth transitions for Light/Dark Mode toggling.
- ❤️ Persistent favorites that save states across page reloads using browser local storage.
- ⌨️ Full keyboard navigation support (Esc to close, Left/Right arrows to browse).

## 🛠️ Installation & Setup (For React Version)
If you want to run the React version locally, clone the repository and run the following commands:
```bash
cd React-API-Version
npm install
npm run dev

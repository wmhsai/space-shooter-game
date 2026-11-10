# 🚀 Space Shooter

A modern 2D arcade-style Space Shooter game built with **React**, **TypeScript**, and the **HTML Canvas API**.

Defend the galaxy, destroy enemy spaceships, survive incoming attacks, and achieve the highest score!

## ✨ Features

- Real-time 2D game rendering with HTML Canvas
- Player spaceship movement
- Keyboard controls (Arrow Keys and WASD)
- Laser shooting mechanics
- Random enemy spawning
- Collision detection
- Dynamic score tracking
- Lives and Game Over system
- Pause and Resume functionality
- Restart game functionality
- Animated starfield background
- Responsive modern UI
- Delta-time-based movement using `requestAnimationFrame`

## 🛠️ Technologies

- React
- TypeScript
- Vite
- HTML Canvas API
- CSS3
- Yarn

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/wmhsai/space-shooter-game.git
```

Navigate to the project directory:

```bash
cd space-shooter
```

Install dependencies:

```bash
yarn
```

## ▶️ Run Development Server

```bash
yarn dev
```

Open the local URL provided by Vite in your browser.

## 🎮 Controls

| Key | Action |
|---|---|
| ↑ / W | Move Up |
| ↓ / S | Move Down |
| ← / A | Move Left |
| → / D | Move Right |
| Space | Shoot |
| P | Pause / Resume |

## 🏆 Game Rules

- Destroy enemy spaceships to earn points.
- Each destroyed enemy gives you 10 points.
- Avoid enemy spaceships.
- Losing all 3 lives ends the game.
- Survive as long as possible and beat your high score!

## 📁 Project Structure

```text
space-shooter/
├── public/
├── src/
│   ├── assets/
│   ├── App.tsx
│   ├── SpaceShooter.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🏗️ Production Build

Build the project:

```bash
yarn build
```

Preview the production build:

```bash
yarn preview
```

## 🧠 Core Concepts

This project demonstrates important game development concepts:

- Canvas 2D Rendering
- Game Loop Architecture
- `requestAnimationFrame`
- React Hooks (`useState`, `useEffect`, `useRef`)
- Keyboard Event Handling
- Collision Detection
- Delta Time
- Object and State Management

## 📄 License

This project is open-source and available for educational purposes.
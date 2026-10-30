# 2048 Game

A modern, responsive web clone of the classic **2048** puzzle game built with Next.js 16, React 19, and Tailwind CSS v4.

## About the Game

Join the numbers to reach the **2048** tile! Slide tiles across the 4×4 grid using your keyboard or touch gestures. When two tiles with the same number collide, they merge into one with double the value.

### Features
- 🎮 **Flexible Controls**: Arrow keys, WASD, and touch/swipe gesture support for mobile.
- ↩️ **Undo Move**: Revert your last move.
- 💾 **Local Persistence**: Current board state and best score are automatically preserved in `localStorage`.
- 📱 **Responsive Design**: Clean, modern interface adapted for both mobile and desktop screens.

---

## Getting Started

### 1. Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install

# Or using pnpm
pnpm install
```

### 2. Run the Development Server

```bash
# Using Bun
bun dev

# Or using npm
npm run dev

# Or using pnpm
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start playing.

### 3. Build for Production

```bash
# Build the project
bun run build     # or: npm run build

# Start production server
bun start         # or: npm run start
```

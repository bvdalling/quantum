# Quantum Jumper

A dimension-shifting platformer game built with Phaser 3, TypeScript, and Vite.

## 🎮 Game Features

- **Dual Dimensions**: Switch between light and dark dimensions with unique layouts
- **Platform Gameplay**: Classic jumping and collecting mechanics
- **Anti-Farming System**: Prevents infinite collectible farming across dimensions
- **Modular Architecture**: Clean TypeScript code structure for easy modding
- **Retro Audio**: Web Audio API generated sound effects
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd quantum-jumper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Play

- **Movement**: Use Arrow Keys or WASD to move left/right and jump
- **Dimension Shift**: Press SPACE to switch between light and dark dimensions
- **Objective**: Collect coins and powerups, reach the green portal to advance
- **Lives**: You have 3 lives - avoid falling off the bottom of the world!

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Check TypeScript types

### Project Structure

```
src/
├── game/
│   ├── constants.ts          # Game constants and enums
│   ├── data/
│   │   └── levelMaps.ts       # Level map data
│   ├── scenes/
│   │   └── QuantumJumperScene.ts # Main game scene
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── utils/
│       ├── AudioSystem.ts     # Sound generation system
│       └── TextureGenerator.ts # Texture creation utilities
└── main.ts                    # Application entry point
```

## 🎨 Modding Guide

### Creating New Levels

Edit the `LEVEL_MAPS` array in `src/game/data/levelMaps.ts`:

```typescript
// Each level has two dimensions: [lightMap, darkMap]
[
  // Light Dimension
  [
    "P........C......E",
    "##................",
    "....U.....######."
  ],
  // Dark Dimension  
  [
    "P........U......E",
    "..................",
    "....C.....######."
  ]
]
```

### Tile Legend

- `P` = Player start position
- `#` = Platform (solid ground)
- `C` = Coin (collectible, +1 score)
- `U` = Powerup (speed boost)
- `E` = Exit portal (level goal)
- `.` = Empty space

### Customizing Game Constants

Modify values in `src/game/constants.ts`:

```typescript
export const PLAYER_SPEED = 180;     // Player movement speed
export const JUMP_VELOCITY = 400;    // Jump strength
export const GRAVITY = 800;          // World gravity
```

### Adding New Sound Effects

Extend the `AudioSystem` class in `src/game/utils/AudioSystem.ts` to add new sound types.

## 🏗️ Technical Details

- **Engine**: Phaser 3.70.0
- **Build Tool**: Vite 7.0+
- **Language**: TypeScript 5.8+
- **Physics**: Arcade Physics
- **Audio**: Web Audio API
- **Graphics**: Procedurally generated 32x32 pixel art

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🎵 Credits

- Game concept and implementation: Quantum Jumper Team
- Sound generation: Web Audio API
- Sprites: Procedurally generated pixel art

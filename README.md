# Quantum Jumper 🎮

A beginner-friendly 2D platformer game built with Phaser 3 and TypeScript, featuring dimension-shifting mechanics and a fluent API for easy level creation.

![Quantum Jumper](https://img.shields.io/badge/Game-Quantum%20Jumper-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Phaser](https://img.shields.io/badge/Phaser-3.70.0-green)
![Vite](https://img.shields.io/badge/Vite-Latest-purple)

## 🌟 Features

- **Dimension Switching**: Toggle between Light and Dark dimensions with unique platforms and collectibles
- **Fluent API**: Beginner-friendly, chainable methods for creating levels
- **Grid-Based Design**: Simple 15x15 tile system for easy level creation
- **Comprehensive Documentation**: Step-by-step tutorials for absolute beginners
- **Modern Tech Stack**: Built with TypeScript, Phaser 3, and Vite
- **Educational Focus**: Heavily commented code and extensive learning materials

## 🎯 Game Mechanics

- **Movement**: Arrow keys to move, Spacebar to jump
- **Dimension Switching**: Press `X` to switch between Light and Dark dimensions
- **Collectibles**: Coins worth different point values in each dimension
- **Power-ups**: Speed boosts, extra lives, and special abilities
- **Portals**: Transport between levels and unlock new areas
- **Lives System**: Multiple chances with respawn mechanics

## 🚀 Quick Start

**Need detailed setup instructions?** See our comprehensive [Installation Guide](docs/installation.md) for step-by-step instructions.

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd quantum-jumper

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the game
npm run build

# Preview the build
npm run preview
```

## 🎮 How to Play

1. **Start the Game**: Press Enter on the start screen
2. **Move**: Use arrow keys to move left and right
3. **Jump**: Press Spacebar to jump on platforms
4. **Switch Dimensions**: Press `X` to toggle between Light and Dark dimensions
5. **Collect Items**: Walk over coins and power-ups to collect them
6. **Reach the Portal**: Find and enter the portal to advance to the next level

### Scoring System

- **Bronze Coins**: 10 points
- **Silver Coins**: 25 points  
- **Gold Coins**: 50 points
- **Ruby Coins**: 100 points
- **Dimension Bonus**: Extra points for collecting in alternate dimension

## 📚 Documentation

### For Beginners

- **[Learning TypeScript](docs/learning-typescript.md)**: Complete TypeScript guide for game development
- **[What Makes a Game](docs/what-makes-a-game.md)**: Game development fundamentals
- **[Tutorial](docs/tutorial.md)**: Step-by-step level creation guide

### Code Examples

```typescript
// Creating a simple level with the fluent API
const gameBuilder = new GameSceneBuilder(this)
  .setWorldSize(15, 15)
  .setScore(0)
  .setLives(3);

// Add a player
gameBuilder
  .addPlayer()
  .setPosition(2, 12)
  .setSpeed(200)
  .setLives(3);

// Add platforms
gameBuilder
  .addPlatform()
  .setPosition(0, 13)
  .setSize(15, 2)
  .setDimension(Dimension.Both);

// Add collectibles
gameBuilder
  .addCoin()
  .setPosition(5, 10)
  .setValue(25)
  .setDimension(Dimension.Light);

// Build the level
gameBuilder.build();
```

## 🏗️ Project Structure

```
quantum-jumper/
├── src/
│   ├── main.ts                 # Entry point
│   └── game/
│       ├── constants.ts        # Game constants and enums
│       ├── scenes/            # Game scenes
│       │   ├── LoadingScene.ts
│       │   ├── StartScreenScene.ts
│       │   └── Levels/        # Level implementations
│       │       ├── Level1.ts
│       │       └── Level2.ts
│       ├── utils/             # Builder classes and utilities
│       │   ├── GameSceneBuilder.ts  # Main level builder
│       │   ├── PlayerBuilder.ts
│       │   ├── PlatformBuilder.ts
│       │   ├── CoinBuilder.ts
│       │   ├── PowerupBuilder.ts
│       │   ├── PortalBuilder.ts
│       │   ├── AudioSystem.ts
│       │   └── TextureGenerator.ts
│       └── types/             # TypeScript type definitions
│           └── index.ts
├── public/
│   └── textures/              # Game assets (SVG graphics)
├── docs/                      # Documentation
├── index.html                 # HTML entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Architecture

### Fluent API Design

Quantum Jumper uses a fluent (chainable) API that makes level creation intuitive:

```typescript
// Traditional approach (complex)
const coin = new Coin();
coin.setX(5);
coin.setY(3);
coin.setValue(100);
coin.setDimension("light");

// Fluent approach (readable)
gameBuilder
  .addCoin()
  .setPosition(5, 3)
  .setValue(100)
  .setDimension(Dimension.Light);
```

### Grid-Based Coordinates

- **World Size**: 15x15 tiles (480x480 pixels)
- **Tile Size**: 32x32 pixels each
- **Coordinate System**: (0,0) at top-left, (14,14) at bottom-right
- **Simple Positioning**: Think in blocks, not pixels

### Builder Pattern

Each game object type has its own builder class:

- **PlayerBuilder**: Creates the playable character
- **PlatformBuilder**: Creates solid surfaces and obstacles  
- **CoinBuilder**: Creates collectible items
- **PowerupBuilder**: Creates special ability items
- **PortalBuilder**: Creates level transition points
- **GameSceneBuilder**: Orchestrates all builders and manages the scene

## 🎨 Creating Custom Levels

### Basic Level Template

```typescript
import { Scene } from 'phaser';
import { GameSceneBuilder } from '../utils/GameSceneBuilder';
import { Dimension } from '../constants';

export class MyCustomLevel extends Scene {
  constructor() {
    super({ key: 'MyCustomLevel' });
  }

  create() {
    const gameBuilder = new GameSceneBuilder(this)
      .setWorldSize(15, 15)
      .setScore(0)
      .setLives(3)
      .setLevel(1);

    // Add your level content here
    gameBuilder
      .addPlayer()
      .setPosition(2, 12)
      .setSpeed(200);

    // Build everything
    gameBuilder.build();
  }
}
```

### Dimension-Specific Design

```typescript
// Platform only in Light dimension
gameBuilder
  .addPlatform()
  .setPosition(5, 10)
  .setSize(3, 1)
  .setDimension(Dimension.Light);

// Coin only in Dark dimension  
gameBuilder
  .addCoin()
  .setPosition(6, 9)
  .setValue(50)
  .setDimension(Dimension.Dark);

// Power-up visible in both dimensions
gameBuilder
  .addPowerup()
  .setPosition(8, 8)
  .setType('speed-boost')
  .setDimension(Dimension.Both);
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build
npm run lint         # Run TypeScript linter
npm run type-check   # Check TypeScript types
```

### Adding New Features

1. **New Object Types**: Create a new builder class in `src/game/utils/`
2. **New Levels**: Add scene files in `src/game/scenes/Levels/`
3. **New Mechanics**: Extend the GameSceneBuilder with new methods
4. **Custom Power-ups**: Add logic in PowerupBuilder and handle in GameSceneBuilder

### Code Style

- Use TypeScript with strict type checking
- Follow Phaser 3 best practices
- Prefer composition over inheritance
- Include comprehensive comments for beginners
- Use descriptive variable and function names

## 🎓 Learning Resources

### Beginner Path

1. **Start with [Learning TypeScript](docs/learning-typescript.md)** - Learn the language basics
2. **Read [What Makes a Game](docs/what-makes-a-game.md)** - Understand game development concepts  
3. **Follow the [Tutorial](docs/tutorial.md)** - Create your first level step-by-step
4. **Study existing levels** - Look at Level1.ts and Level2.ts for examples
5. **Experiment** - Modify existing levels and create your own

### Video Tutorials

- **[Learn TypeScript - Full Course for Beginners](https://www.youtube.com/watch?v=gp5H0Vw39yw)** - Comprehensive TypeScript tutorial
- **[Phaser Tutorial | Make Your First 2D JavaScript Game](https://www.youtube.com/watch?v=0qtg-9M3peI)** - Learn Phaser 3 basics
- **[npm for absolute beginners](https://www.youtube.com/watch?v=UYz-9UaUp2E&t=24s)** - Understanding package management
- **[How to get started with VS Code](https://www.youtube.com/watch?v=EUJlVYggR1Y)** - Code editor setup and usage

### Advanced Topics

- **Phaser 3 Documentation**: [phaser.io/phaser3](https://phaser.io/phaser3)
- **TypeScript Handbook**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)
- **Game Design Patterns**: Study the builder and factory patterns used in this project
- **Performance Optimization**: Learn about object pooling and efficient collision detection

## Need Help? 
Reach out to a staff member (yellow lanyards and badges) or check-in on the event discord server for assistance.

---

**Happy coding and game building!** 🎮✨

*Built with ❤️ for learning game development*

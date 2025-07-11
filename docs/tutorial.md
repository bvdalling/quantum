# Quantum Jumper Tutorial: Building Your First Game Level

## Table of Contents
1. [Getting Started](#getting-started)
2. [Understanding the Grid System](#understanding-the-grid-system)
3. [Basic Scene Structure](#basic-scene-structure)
4. [Building Game Objects Reference](#building-game-objects-reference)
5. [Understanding Dimensions](#understanding-dimensions)
6. [Troubleshooting](#troubleshooting)

## Getting Started

### Project Structure
```
src/
  game/
    scenes/
      Levels/           
        Level1.ts       ← Main example level
        MyFirstLevel.ts    ← Where you'll create your level
    utils/
      GameSceneBuilder.ts
      AudioSystem.ts
      TextureGenerator.ts
```

### Basic Scene Setup
Lots of code? Don't worry - we will walk you through everything. You do not need to understand it all right now, just copy, paste, and follow along! Don't hesitate to ask a staff member (yellow lanyard) for help if you get stuck.

Create a new file for your level under `/src/game/scenes/Levels/` and name it `MyFirstLevel.ts`.:

```typescript
// filepath: /src/game/scenes/Levels/MyFirstLevel.ts
import Phaser from "phaser";
import { createGameScene } from "../../utils/GameSceneBuilder";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, Dimension } from "../../constants";
import { AudioSystem } from "../../utils/AudioSystem";
import { TextureGenerator } from "../../utils/TextureGenerator";
import type { GameState } from "../../types";

// This is our main class - think of it like a blueprint for our game scene
export class MyFirstLevel extends Phaser.Scene {
  // These are "properties" - variables that belong to this class
  // Think of them like pockets in a jacket where we store important things
  private gameBuilder!: ReturnType<typeof createGameScene>;
  private gameState!: GameState;
  private audioSystem!: AudioSystem;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: "MyFirstLevel" }); // This will be the name of our scene. We will use this to switch between scenes.
	// We can make a portal on level 2 to go to this level once level 2 is completed. Use Level1.ts as a reference if needed.
  }

  preload(): void {
    const textureGenerator = new TextureGenerator(this);
    textureGenerator.loadAllTextures();
  }

  create(): void {
    this.initializeState();
    this.initializeSystems();
    this.setupInput();
    
    this.gameBuilder = createGameScene(this);
    this.createLevel();
    this.setupCamera();
    
    this.audioSystem.playSound("start" as any);
  }

  private initializeState(): void {
    this.gameState = {
      score: 0,
      lives: 3,
      level: 1,
      dimension: "light" as any,
      levelTransitioning: false,
      speedBoostActive: false,
      jumpBoostActive: false,
      invincibilityActive: false,
      currentPlayerSpeed: 200,
      currentJumpVelocity: 800,
    };
  }

  private initializeSystems(): void {
    this.audioSystem = new AudioSystem();
  }

  private setupInput(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    const xKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    xKey.on("down", () => {
      this.gameBuilder.switchDimension();
      this.audioSystem.playSound("dimension" as any);
    });
  }

  private createLevel(): void {
    // STEP 1: Set up the world size
    this.gameBuilder.setWorldSize(25, 19);

    // STEP 2: Create the player character
    const player = this.gameBuilder
      .addPlayer()
      .withLives(this.gameState.lives)
      .withScore(this.gameState.score)
      .atPosition(3, 12)
      .withSpeed(this.gameState.currentPlayerSpeed)
      .withJumpPower(this.gameState.currentJumpVelocity)
      .build();

    this.gameBuilder.setMainPlayer(player);

    // STEP 3: Set up UI elements
    this.gameBuilder
      .setScore(0)
      .withLives(3)
      .setLevel(1)
      .showMessage("Welcome!", 3000, "#00ff00")
      .showControls();

    // STEP 4: Create the level layout
    this.createSimpleLevel();
  }

  private createSimpleLevel(): void {
    // Create ground platforms
    for (let gridY = 14; gridY < 19; gridY++) {
      for (let gridX = 0; gridX < 25; gridX++) {
        this.gameBuilder
          .addPlatform()
          .atCoords(gridX, gridY)
          .withCollider()
          .setSolid()
          .setDimension("both")
          .build();
      }
    }

    // Add your level objects here! Platforms, coins, powerups, portals, whatever your heart desires!
    // See Building Game Objects Reference section below
  }

  private setupCamera(): void {
    const player = this.gameBuilder.getMainPlayer();
    if (player) {
      this.cameras.main.startFollow(player, true, 0.08, 0.08);
      this.cameras.main.setViewport(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    }
  }
}
```

## Building Game Objects Reference

### Adding Platforms
```typescript
// Ground platform
this.gameBuilder
  .addPlatform()
  .atCoords(0, 13)
  .withCollider()
  .setSolid()
  .setDimension("both")
  .build();

// Floating platform (light dimension only)
this.gameBuilder
  .addPlatform()
  .atCoords(6, 11)
  .withCollider()
  .setSolid()
  .setDimension(Dimension.LIGHT)
  .build();
```

### Adding Coins
```typescript
// Bronze coin
this.gameBuilder
  .addCoin()
  .atCoords(6, 10)
  .withTexture("bronze-coin")
  .animated()
  .setDimension(Dimension.LIGHT)
  .build();

// Gold coin
this.gameBuilder
  .addCoin()
  .atCoords(18, 6)
  .withTexture("gold-coin")
  .animated()
  .setDimension(Dimension.DARK)
  .build();
```

### Adding Powerups
```typescript
// Speed boost
this.gameBuilder
  .addPowerup()
  .atCoords(9, 13)
  .ofType("mushroom")
  .animated()
  .setDimension("both")
  .build();

// Extra life
this.gameBuilder
  .addPowerup()
  .atCoords(15, 7)
  .ofType("1up")
  .animated()
  .setDimension(Dimension.LIGHT)
  .build();
```

### Adding Portals
```typescript
// Exit portal
const portalData = this.gameBuilder
  .addPortal()
  .atCoords(21, 11)
  .withParticles()
  .goesToNextLevel()
  .setDimension("both")
  .goesToScene("Level2Scene")
  .build();

this.gameBuilder.registerPortal(portalData);
```

## Understanding Dimensions

### Dimension Types
```typescript
enum Dimension {
  LIGHT = "light",
  DARK = "dark",
  BOTH = "both"
}
```

Objects can exist in different dimensions using `.setDimension()`:
- `Dimension.LIGHT` - Only visible in light dimension
- `Dimension.DARK` - Only visible in dark dimension
- `"both"` - Visible in both dimensions

## Troubleshooting

### Common Issues

1. Objects not appearing:
   - Make sure to call `.build()` at the end of each chain
   - Check dimension settings
   - Verify coordinates are within world bounds

2. Platforms not solid:
   - Add `.withCollider()` and `.setSolid()`
   - Make sure platform is in correct dimension

3. Portal not working:
   - Call `registerPortal()` after creating portal
   - Verify destination scene exists

### Debug Tips

- Use `showMessage()` to display debug info:
```typescript
this.gameBuilder.showMessage("Debug: Portal Created", 2000, "#00ff00");
```

- Check object positions:
```typescript
console.log("Player position:", player.x, player.y);
```

Need more help? Check the example levels or ask a staff member (yellow lanyard).
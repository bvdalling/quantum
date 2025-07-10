# Quantum Jumper Tutorial: Building Your First Game Level

Welcome to the complete tutorial for creating levels in Quantum Jumper! This guide will walk you through everything step-by-step, from understanding the basics to creating your own custom levels.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Understanding the Grid System](#understanding-the-grid-system)
3. [Your First Level - Step by Step](#your-first-level---step-by-step)
4. [Understanding Dimensions](#understanding-dimensions)
5. [Adding Interactive Objects](#adding-interactive-objects)
6. [Working with Portals](#working-with-portals)
7. [Managing Game State](#managing-game-state)
8. [Adding Polish and Effects](#adding-polish-and-effects)
9. [Complete Level Examples](#complete-level-examples)
10. [Troubleshooting Common Issues](#troubleshooting-common-issues)
11. [Advanced Techniques](#advanced-techniques)

## Getting Started

### What You'll Need

- Basic understanding of TypeScript (see `learning-typescript.md`)
- VS Code or another code editor
- A web browser to test your game

### Project Structure

Quantum Jumper is organized like this:
```
src/
  game/
    scenes/
      Levels/           ← Your level files go here
        Level1.ts       ← Example level
        Level2.ts       ← More advanced example
        YourLevel.ts    ← Create your own!
    utils/
      GameSceneBuilder.ts  ← Main building tool
      *Builder.ts          ← Object creation tools
```

### The Fluent API Philosophy

Quantum Jumper uses a "fluent" (chainable) API that reads like English:

```typescript
// Instead of this (confusing):
let coin = new Coin();
coin.setX(5);
coin.setY(3);
coin.setValue(100);
coin.setDimension("light");

// We write this (clear and readable):
gameBuilder
  .addCoin()
  .setPosition(5, 3)
  .setValue(100)
  .setDimension(Dimension.Light);
```

## Understanding the Grid System

### The Game World

Quantum Jumper uses a **grid-based coordinate system**:

- The game world is **15x15 tiles**
- Each tile is **32x32 pixels**
- Total screen size: **480x480 pixels**
- Coordinates start at (0,0) in the top-left

```
     0   1   2   3   4   5   6   7   8   9  10  11  12  13  14
   ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
 0 │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │
   ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
 1 │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │
   ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
 2 │   │   │ P │   │   │   │   │   │   │   │   │   │   │   │   │  ← Player at (2,2)
   ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
 3 │   │   │   │   │   │   │   │   │   │   │   │   │   │   │   │
   └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
```

### Why Use Grids?

1. **Simple Positioning**: Easy to remember that a coin is at tile (5,8)
2. **Consistent Spacing**: Everything lines up perfectly
3. **Easy Level Design**: Think in blocks, not pixels
4. **Collision Detection**: Simpler math for game interactions

## Your First Level - Step by Step

Let's create a simple level from scratch! Create a new file `src/game/scenes/Levels/MyFirstLevel.ts`:

### Step 1: Basic Scene Setup

```typescript
import { Scene } from 'phaser';
import { GameSceneBuilder } from '../../utils/GameSceneBuilder';
import { Dimension } from '../../constants';

export class MyFirstLevel extends Scene {
  private gameBuilder!: GameSceneBuilder;

  constructor() {
    super({ key: 'MyFirstLevel' });
  }

  create() {
    // Create our level builder - this is our main tool!
    this.gameBuilder = new GameSceneBuilder(this)
      .setWorldSize(15, 15)  // 15x15 tile world
      .setScore(0)           // Start with 0 points
      .setLives(3)           // Give player 3 lives
      .setLevel(1);          // This is level 1

    // Add a simple message
    this.gameBuilder.showMessage("Welcome to My First Level!", 3000);
    
    // Next steps: Add player, platforms, etc.
  }
}
```

### Step 2: Add the Player

The player is the character you control. Let's put them in the bottom-left:

```typescript
create() {
  this.gameBuilder = new GameSceneBuilder(this)
    .setWorldSize(15, 15)
    .setScore(0)
    .setLives(3)
    .setLevel(1);

  // Add the player at position (2, 12) - near bottom-left
  this.gameBuilder
    .addPlayer()
    .setPosition(2, 12)      // 2 tiles right, 12 tiles down
    .setLives(3)             // 3 lives to start
    .setSpeed(200);          // Movement speed

  // Don't forget to build everything!
  this.gameBuilder.build();
}
```

### Step 3: Add Platforms to Stand On

Players need something to stand on! Let's add some platforms:

```typescript
create() {
  this.gameBuilder = new GameSceneBuilder(this)
    .setWorldSize(15, 15)
    .setScore(0)
    .setLives(3)
    .setLevel(1);

  // Add the player
  this.gameBuilder
    .addPlayer()
    .setPosition(2, 12)
    .setLives(3)
    .setSpeed(200);

  // Add a ground platform (bottom of screen)
  this.gameBuilder
    .addPlatform()
    .setPosition(0, 13)      // Start at left edge, near bottom
    .setSize(15, 2);         // 15 tiles wide, 2 tiles tall

  // Add some jumping platforms
  this.gameBuilder
    .addPlatform()
    .setPosition(5, 10)      // Middle area
    .setSize(3, 1);          // 3 tiles wide, 1 tile tall

  this.gameBuilder
    .addPlatform()
    .setPosition(10, 8)      // Higher up, right side
    .setSize(3, 1);

  this.gameBuilder.build();
}
```

### Step 4: Add Collectible Coins

What's a platformer without things to collect?

```typescript
create() {
  // ... previous code ...

  // Add some coins to collect
  this.gameBuilder
    .addCoin()
    .setPosition(6, 9)       // On top of the middle platform
    .setValue(10);           // Worth 10 points

  this.gameBuilder
    .addCoin()
    .setPosition(11, 7)      // On top of the right platform
    .setValue(20);           // Worth more points!

  this.gameBuilder
    .addCoin()
    .setPosition(1, 11)      // Near the starting area
    .setValue(10);

  this.gameBuilder.build();
}
```

### Step 5: Test Your Level

To test your level, you need to register it with the game. Open `src/main.ts` and add your scene:

```typescript
import { MyFirstLevel } from './game/scenes/Levels/MyFirstLevel';

const config: Phaser.Types.Core.GameConfig = {
  // ... existing config ...
  scene: [
    LoadingScene,
    StartScreenScene,
    QuantumJumperScene,
    Level2Scene,
    MyFirstLevel  // Add your scene here
  ]
};
```

Then, in your level, you can start it by calling:
```typescript
this.scene.start('MyFirstLevel');
```

## Understanding Dimensions

Quantum Jumper's unique feature is **dimension switching**! Objects can exist in different dimensions:

### Dimension Types

```typescript
enum Dimension {
  Light = "light",  // Bright, normal world
  Dark = "dark",    // Mysterious, alternate world
  Both = "both"     // Visible in both dimensions
}
```

### Creating Dimension-Specific Objects

```typescript
// This coin only appears in the Light dimension
this.gameBuilder
  .addCoin()
  .setPosition(5, 5)
  .setValue(10)
  .setDimension(Dimension.Light);

// This platform only appears in the Dark dimension
this.gameBuilder
  .addPlatform()
  .setPosition(8, 10)
  .setSize(4, 1)
  .setDimension(Dimension.Dark);

// This power-up appears in both dimensions
this.gameBuilder
  .addPowerup()
  .setPosition(3, 7)
  .setType('speed-boost')
  .setDimension(Dimension.Both);
```

### How Dimensions Work

1. **Player starts in Light dimension**
2. **Press Z to switch between Light and Dark**
3. **Only visible objects can be collected or collided with**
4. **Use dimensions to create puzzles and alternate paths**

### Example: Dimension Puzzle

```typescript
// Create a puzzle where player must switch dimensions to progress
create() {
  // ... basic setup ...

  // In Light dimension: platform blocks the path
  this.gameBuilder
    .addPlatform()
    .setPosition(7, 8)
    .setSize(1, 4)  // Tall barrier
    .setDimension(Dimension.Light);

  // In Dark dimension: platform creates a bridge
  this.gameBuilder
    .addPlatform()
    .setPosition(6, 10)
    .setSize(3, 1)  // Bridge over gap
    .setDimension(Dimension.Dark);

  // Coin rewards clever dimension switching
  this.gameBuilder
    .addCoin()
    .setPosition(7, 9)
    .setValue(50)
    .setDimension(Dimension.Dark);  // Only reachable in dark!
}
```

## Adding Interactive Objects

### Coins (Collectibles)

Coins are the basic collectible. They give points and disappear when collected:

```typescript
// Basic coin
this.gameBuilder
  .addCoin()
  .setPosition(5, 3)
  .setValue(10);

// Valuable coin with bonus
this.gameBuilder
  .addCoin()
  .setPosition(8, 5)
  .setValue(100)
  .setDimension(Dimension.Dark);  // Bonus for dimension switching!

// Multiple coins in a row
for (let x = 3; x <= 7; x++) {
  this.gameBuilder
    .addCoin()
    .setPosition(x, 6)
    .setValue(5);
}
```

### Power-ups (Special Abilities)

Power-ups give the player temporary or permanent abilities:

```typescript
// Speed boost - makes player move faster
this.gameBuilder
  .addPowerup()
  .setPosition(4, 8)
  .setType('speed-boost')
  .setDuration(10000);  // Lasts 10 seconds

// Extra life - gives player another chance
this.gameBuilder
  .addPowerup()
  .setPosition(12, 4)
  .setType('1up');

// Fire flower - gives special abilities (you can define what this does)
this.gameBuilder
  .addPowerup()
  .setPosition(7, 7)
  .setType('fire-flower')
  .setDimension(Dimension.Light);
```

### Available Power-up Types

- `'speed-boost'`: Increases movement speed
- `'1up'`: Gives extra life
- `'mushroom'`: Makes player bigger/stronger
- `'fire-flower'`: Gives fire abilities
- `'star'`: Temporary invincibility
- `'poison'`: Negative effect (use carefully!)

## Working with Portals

Portals transport the player between levels or areas:

### Basic Portal

```typescript
// Portal to next level
this.gameBuilder
  .addPortal()
  .setPosition(14, 10)          // Right edge of screen
  .setDestination('Level2');    // Go to Level2Scene
```

### Portal with Custom Properties

```typescript
// Portal that requires coins to activate
this.gameBuilder
  .addPortal()
  .setPosition(13, 5)
  .setDestination('SecretLevel')
  .setRequiredCoins(10)         // Must collect 10 coins first
  .setDimension(Dimension.Dark) // Only visible in dark dimension
  .setMessage("Secret Portal: 10 coins required!");
```

### Portal Events

You can add custom logic when portals are used:

```typescript
// In your scene's create() method
this.gameBuilder.onPortalUsed((portal, destination) => {
  // Custom logic when portal is activated
  this.gameBuilder.showMessage(`Traveling to ${destination}!`, 2000);
  
  // Maybe award bonus points
  this.gameBuilder.addScore(100);
  
  // Or play a special sound
  this.sound.play('portalSound');
});
```

## Managing Game State

### Score System

The game automatically tracks score, but you can modify it:

```typescript
// Set initial score
this.gameBuilder.setScore(0);

// Add points during gameplay
this.gameBuilder.addScore(50);

// Award bonus points for completion
this.onLevelComplete(() => {
  this.gameBuilder.addScore(1000);
});
```

### Lives System

Players have multiple chances:

```typescript
// Set starting lives
this.gameBuilder.setLives(3);

// Award extra lives
this.gameBuilder.addLives(1);

// Check remaining lives
if (this.gameBuilder.getLives() <= 0) {
  this.scene.start('GameOverScene');
}
```

### Level Progression

Track which level the player is on:

```typescript
// Set current level number
this.gameBuilder.setLevel(1);

// When moving to next level
this.gameBuilder.setLevel(this.gameBuilder.getLevel() + 1);
```

## Adding Polish and Effects

### Messages and Feedback

```typescript
// Welcome message
this.gameBuilder.showMessage("Level 2: The Dark Dimension", 3000);

// Instruction message
this.gameBuilder.showMessage("Press Z to switch dimensions!", 5000);

// Achievement message
this.gameBuilder.showMessage("All coins collected! Portal unlocked!", 2000);
```

### Show Controls

Help players learn the game:

```typescript
// Show control instructions
this.gameBuilder.showControls();
// Displays: "Arrow Keys: Move, Space: Jump, Z: Switch Dimension"
```

### Custom Events

React to game events:

```typescript
// When player collects a coin
this.gameBuilder.onCoinCollected((coin, newScore) => {
  this.gameBuilder.showMessage(`+${coin.value} points!`, 1000);
});

// When player gets a power-up
this.gameBuilder.onPowerupCollected((powerup) => {
  this.gameBuilder.showMessage(`${powerup.type} activated!`, 2000);
});

// When player dies
this.gameBuilder.onPlayerDeath(() => {
  this.gameBuilder.showMessage("Ouch! Try again!", 2000);
});
```

## Complete Level Examples

### Example 1: Simple Tutorial Level

```typescript
export class TutorialLevel extends Scene {
  constructor() {
    super({ key: 'TutorialLevel' });
  }

  create() {
    const gameBuilder = new GameSceneBuilder(this)
      .setWorldSize(15, 15)
      .setScore(0)
      .setLives(3)
      .setLevel(1);

    // Show instructions
    gameBuilder.showMessage("Welcome! Use arrow keys to move, space to jump!", 4000);

    // Simple layout for learning
    gameBuilder
      .addPlayer()
      .setPosition(2, 12)
      .setLives(3)
      .setSpeed(150);  // Slower for beginners

    // Ground platform
    gameBuilder
      .addPlatform()
      .setPosition(0, 13)
      .setSize(15, 2);

    // Simple jumping section
    gameBuilder
      .addPlatform()
      .setPosition(5, 11)
      .setSize(2, 1);

    gameBuilder
      .addPlatform()
      .setPosition(8, 9)
      .setSize(2, 1);

    // Easy coins to collect
    gameBuilder
      .addCoin()
      .setPosition(6, 10)
      .setValue(10);

    gameBuilder
      .addCoin()
      .setPosition(9, 8)
      .setValue(10);

    // Exit portal
    gameBuilder
      .addPortal()
      .setPosition(9, 8)
      .setDestination('Level1');

    gameBuilder.build();
  }
}
```

### Example 2: Dimension Switching Challenge

```typescript
export class DimensionLevel extends Scene {
  constructor() {
    super({ key: 'DimensionLevel' });
  }

  create() {
    const gameBuilder = new GameSceneBuilder(this)
      .setWorldSize(15, 15)
      .setScore(0)
      .setLives(3)
      .setLevel(2);

    gameBuilder.showMessage("Press Z to switch dimensions!", 3000);

    // Player setup
    gameBuilder
      .addPlayer()
      .setPosition(1, 12)
      .setLives(3)
      .setSpeed(200);

    // Ground (visible in both dimensions)
    gameBuilder
      .addPlatform()
      .setPosition(0, 13)
      .setSize(15, 2)
      .setDimension(Dimension.Both);

    // Light dimension path
    gameBuilder
      .addPlatform()
      .setPosition(3, 11)
      .setSize(3, 1)
      .setDimension(Dimension.Light);

    gameBuilder
      .addPlatform()
      .setPosition(7, 9)
      .setSize(3, 1)
      .setDimension(Dimension.Light);

    // Dark dimension path (different route)
    gameBuilder
      .addPlatform()
      .setPosition(4, 10)
      .setSize(2, 1)
      .setDimension(Dimension.Dark);

    gameBuilder
      .addPlatform()
      .setPosition(8, 8)
      .setSize(4, 1)
      .setDimension(Dimension.Dark);

    // Dimension-specific rewards
    gameBuilder
      .addCoin()
      .setPosition(5, 10)
      .setValue(25)
      .setDimension(Dimension.Light);

    gameBuilder
      .addCoin()
      .setPosition(5, 9)
      .setValue(50)  // Bonus for dark dimension!
      .setDimension(Dimension.Dark);

    // Power-up in dark dimension
    gameBuilder
      .addPowerup()
      .setPosition(10, 7)
      .setType('speed-boost')
      .setDimension(Dimension.Dark);

    // Portal at the end
    gameBuilder
      .addPortal()
      .setPosition(13, 7)
      .setDestination('Level3');

    gameBuilder.build();
  }
}
```

### Example 3: Advanced Challenge Level

```typescript
export class ChallengeLevel extends Scene {
  constructor() {
    super({ key: 'ChallengeLevel' });
  }

  create() {
    const gameBuilder = new GameSceneBuilder(this)
      .setWorldSize(15, 15)
      .setScore(0)
      .setLives(3)
      .setLevel(3);

    gameBuilder.showMessage("Master Level: Collect all coins to unlock portal!", 4000);

    // Player setup
    gameBuilder
      .addPlayer()
      .setPosition(1, 12)
      .setLives(3)
      .setSpeed(220);

    // Complex platform layout
    gameBuilder
      .addPlatform()
      .setPosition(0, 13)
      .setSize(15, 2)
      .setDimension(Dimension.Both);

    // Floating platforms - light dimension
    for (let i = 0; i < 5; i++) {
      gameBuilder
        .addPlatform()
        .setPosition(2 + i * 2, 11 - i)
        .setSize(1, 1)
        .setDimension(Dimension.Light);
    }

    // Floating platforms - dark dimension (different pattern)
    for (let i = 0; i < 4; i++) {
      gameBuilder
        .addPlatform()
        .setPosition(3 + i * 2, 9 - i)
        .setSize(2, 1)
        .setDimension(Dimension.Dark);
    }

    // Collectibles requiring dimension switching
    gameBuilder
      .addCoin()
      .setPosition(3, 10)
      .setValue(30)
      .setDimension(Dimension.Light);

    gameBuilder
      .addCoin()
      .setPosition(5, 8)
      .setValue(40)
      .setDimension(Dimension.Dark);

    gameBuilder
      .addCoin()
      .setPosition(7, 6)
      .setValue(50)
      .setDimension(Dimension.Light);

    // Special power-ups
    gameBuilder
      .addPowerup()
      .setPosition(9, 4)
      .setType('1up')
      .setDimension(Dimension.Dark);

    gameBuilder
      .addPowerup()
      .setPosition(11, 2)
      .setType('star')
      .setDimension(Dimension.Light);

    // Portal requires all coins
    gameBuilder
      .addPortal()
      .setPosition(13, 1)
      .setDestination('VictoryScene')
      .setRequiredCoins(3)
      .setMessage("Portal unlocked! You're a master!");

    // Custom events for feedback
    gameBuilder.onCoinCollected((coin, score) => {
      const remaining = 3 - gameBuilder.getCoinsCollected();
      if (remaining > 0) {
        gameBuilder.showMessage(`${remaining} coins left to unlock portal!`, 2000);
      } else {
        gameBuilder.showMessage("All coins collected! Portal is now active!", 3000);
      }
    });

    gameBuilder.build();
  }
}
```

## Troubleshooting Common Issues

### Objects Not Appearing

**Problem**: You added objects but they don't show up on screen.

**Solutions**:
1. Check if you called `gameBuilder.build()` at the end
2. Verify coordinates are within the 15x15 grid (0-14 for both x and y)
3. Make sure object is in the correct dimension
4. Check if object is hidden behind other objects

```typescript
// ❌ Wrong - coordinates outside world
gameBuilder
  .addCoin()
  .setPosition(20, 5);  // X is too big! (max is 14)

// ✅ Correct
gameBuilder
  .addCoin()
  .setPosition(14, 5);  // Within world bounds
```

### Player Falls Through Platforms

**Problem**: Player doesn't stop on platforms, falls through them.

**Solutions**:
1. Make sure you called `gameBuilder.build()` after adding platforms
2. Check platform position - player might be starting inside the platform
3. Verify platform size is correct

```typescript
// ❌ Wrong - player starts inside platform
gameBuilder
  .addPlayer()
  .setPosition(5, 10);  // Player position

gameBuilder
  .addPlatform()
  .setPosition(4, 10)   // Platform at same Y level!
  .setSize(3, 1);

// ✅ Correct - player above platform
gameBuilder
  .addPlayer()
  .setPosition(5, 9);   // Player above...

gameBuilder
  .addPlatform()
  .setPosition(4, 10)   // ...platform below
  .setSize(3, 1);
```

### Coins/Power-ups Not Collecting

**Problem**: Player walks through collectibles without picking them up.

**Solutions**:
1. Ensure objects are in the same dimension as player
2. Check if `gameBuilder.build()` was called
3. Verify collision setup is working

```typescript
// ❌ Wrong - coin in different dimension
this.gameBuilder.switchDimension(Dimension.Light);  // Player in Light
gameBuilder
  .addCoin()
  .setPosition(5, 5)
  .setDimension(Dimension.Dark);  // Coin in Dark - can't collect!

// ✅ Correct - matching dimensions
gameBuilder
  .addCoin()
  .setPosition(5, 5)
  .setDimension(Dimension.Light);  // Both in Light dimension
```

### Portals Not Working

**Problem**: Player touches portal but nothing happens.

**Solutions**:
1. Check destination scene name exactly matches registered scene
2. Verify portal requirements are met (coins, etc.)
3. Ensure portal is in correct dimension

```typescript
// ❌ Wrong - scene name doesn't match
gameBuilder
  .addPortal()
  .setDestination('Level2');  // Scene key must match exactly

// In main.ts, scene must be registered as:
scene: [LoadingScene, StartScreenScene, QuantumJumperScene, Level2Scene]
//                                                          ↑
//                                                   Must use: 'Level2Scene'

// ✅ Correct
gameBuilder
  .addPortal()
  .setDestination('Level2Scene');  // Matches registered name
```

### Performance Issues

**Problem**: Game runs slowly or choppy.

**Solutions**:
1. Don't create too many objects (limit ~50-100 total)
2. Avoid complex collision shapes
3. Use simpler graphics if needed

### Dimension Switching Not Working

**Problem**: Pressing Z doesn't switch dimensions.

**Solutions**:
1. Make sure GameSceneBuilder is properly initialized
2. Check browser console for errors
3. Verify key binding is set up correctly

## Advanced Techniques

### Procedural Level Generation

Create levels using loops and algorithms:

```typescript
// Create a staircase pattern
for (let i = 0; i < 10; i++) {
  gameBuilder
    .addPlatform()
    .setPosition(i, 14 - i)
    .setSize(2, 1);
    
  // Add coin on each step
  gameBuilder
    .addCoin()
    .setPosition(i + 1, 13 - i)
    .setValue(10);
}
```

### Dynamic Level Modification

Change the level while playing:

```typescript
// Add more coins when player reaches certain score
gameBuilder.onScoreChanged((newScore) => {
  if (newScore >= 100) {
    // Spawn bonus coins
    gameBuilder
      .addCoin()
      .setPosition(Math.random() * 15, Math.random() * 15)
      .setValue(50);
  }
});
```

### Custom Power-up Effects

Create your own power-up behaviors:

```typescript
gameBuilder.onPowerupCollected((powerup) => {
  switch (powerup.type) {
    case 'super-jump':
      // Temporarily increase jump height
      gameBuilder.setPlayerJumpPower(800);  // Higher jump
      setTimeout(() => {
        gameBuilder.setPlayerJumpPower(500);  // Back to normal
      }, 10000);
      break;
      
    case 'coin-magnet':
      // Automatically collect nearby coins
      gameBuilder.enableCoinMagnet(5000);  // 5 seconds
      break;
  }
});
```

### Level Validation

Check if your level is playable:

```typescript
create() {
  const gameBuilder = new GameSceneBuilder(this)
    .setWorldSize(15, 15)
    .setScore(0)
    .setLives(3)
    .setLevel(1);

  // ... add objects ...

  // Validate level before building
  if (!this.validateLevel(gameBuilder)) {
    console.error("Level has issues!");
    return;
  }

  gameBuilder.build();
}

private validateLevel(builder: GameSceneBuilder): boolean {
  // Check if player exists
  if (!builder.hasPlayer()) {
    console.error("Level needs a player!");
    return false;
  }

  // Check if there are platforms to stand on
  if (builder.getPlatformCount() === 0) {
    console.error("Level needs platforms!");
    return false;
  }

  // Check if there's a way to complete the level
  if (!builder.hasPortal() && !builder.hasCoins()) {
    console.error("Level needs either a portal or collectibles!");
    return false;
  }

  return true;
}
```

## Tips for Great Level Design

### 1. Start Simple
- Begin with basic platforms and a few coins
- Test frequently to make sure everything works
- Add complexity gradually

### 2. Guide the Player
- Use coins to show the intended path
- Make important platforms easy to see
- Provide visual cues for dimension switching

### 3. Progressive Difficulty
- Early levels: teach one concept at a time
- Middle levels: combine concepts
- Later levels: require mastery of all skills

### 4. Reward Exploration
- Hide bonus coins in hard-to-reach places
- Use dimensions to create secret areas
- Add optional challenges for extra points

### 5. Test with Others
- Watch someone else play your level
- Note where they get confused or stuck
- Adjust difficulty based on feedback

## Next Steps

Now that you understand the basics:

1. **Create Your Own Level**: Start with the simple examples and modify them
2. **Experiment**: Try different platform arrangements and coin placements
3. **Study Existing Levels**: Look at Level1.ts and Level2.ts for inspiration
4. **Add Your Own Features**: Extend the builders with new functionality
5. **Share Your Creations**: Show others what you've built!

Remember: Game development is iterative. Your first level won't be perfect, and that's okay! Keep experimenting, testing, and improving. Every game developer started with simple levels and gradually learned to create more complex and engaging experiences.

Happy level building! 🎮

## Need Help? 
Reach out to a staff member (yellow lanyards and badges) or check-in on the event discord server for assistance.
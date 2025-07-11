/**
 * QUANTUM JUMPER LEVEL 2 - INTERMEDIATE PLATFORMING
 *
 * This is Level 2 of Quantum Jumper! It builds on the concepts from Level 1
 * but introduces more challenging platforming and better use of the dimension system.
 *
 * NEW CONCEPTS IN LEVEL 2:
 * - Longer jumping sequences
 * - More strategic use of dimensions
 * - Moving between light and dark dimensions is required to progress
 * - Higher value collectibles
 * - Breakable platforms for extra challenge
 *
 * LEVEL DESIGN GOALS:
 * ✅ Teach players to use dimension switching strategically
 * ✅ Introduce slightly harder platforming
 * ✅ Reward exploration with hidden collectibles
 * ✅ Provide multiple paths (easy vs. challenging)
 */

// Import the same tools we use in Level 1
import Phaser from "phaser";
import { createGameScene } from "../../utils/GameSceneBuilder";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, Dimension } from "../../constants";
import { AudioSystem } from "../../utils/AudioSystem";
import { TextureGenerator } from "../../utils/TextureGenerator";
import type { GameState } from "../../types";

// Level 2 Scene - builds on Level 1 concepts with increased difficulty
export class Level2Scene extends Phaser.Scene {
  // Same properties as Level 1 - we need the same systems
  private gameBuilder!: ReturnType<typeof createGameScene>;
  private gameState!: GameState;
  private audioSystem!: AudioSystem;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: "Level2Scene" }); // Give this scene a unique name
  }

  // Same preload method as Level 1 - load graphics
  preload(): void {
    const textureGenerator = new TextureGenerator(this);
    textureGenerator.loadAllTextures();
  }

  // Main creation method - this builds the entire level
  create(): void {
    console.log("🎮 Starting Level 2 - Intermediate Platforming!");

    this.initializeState();
    this.initializeSystems();
    this.setupInput();

    // Create our game builder tool
    this.gameBuilder = createGameScene(this);

    // Build the level!
    this.createLevel2();
    this.setupCamera();

    // Play level start sound
    this.audioSystem.playSound("portal" as any);
  }

  // Set up game state - Level 2 keeps score/lives from Level 1
  private initializeState(): void {
    this.gameState = {
      score: 0, // Will be updated from previous level
      lives: 3, // Will be updated from previous level
      level: 2, // This is Level 2!
      dimension: "light" as any, // Start in light dimension
      levelTransitioning: false,
      speedBoostActive: false,
      jumpBoostActive: false,
      invincibilityActive: false,
      currentPlayerSpeed: 220, // Slightly faster than Level 1
      currentJumpVelocity: 850, // Slightly higher jumps for harder platforming
    };
  }

  // Set up sound system
  private initializeSystems(): void {
    this.audioSystem = new AudioSystem();
  }

  // Set up keyboard controls (same as Level 1)
  private setupInput(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.spaceKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // X key for dimension switching
    const xKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    xKey.on("down", () => {
      this.gameBuilder.switchDimension();
      this.audioSystem.playSound("dimension" as any);
    });
  }

  // This creates the actual Level 2 layout
  private createLevel2(): void {
    console.log("🏗️ Building Level 2 layout...");

    // === STEP 1: SET UP WORLD SIZE ===
    // Level 2 is bigger than Level 1 for more complex design
    this.gameBuilder.setWorldSize(20, 15); // 20 tiles wide, 15 tiles tall

    // === STEP 2: CREATE PLAYER ===
    const player = this.gameBuilder
      .addPlayer()
      .withLives(this.gameState.lives)
      .withScore(this.gameState.score)
      .atPosition(2, 12) // Starting position
      .withSpeed(this.gameState.currentPlayerSpeed) // Faster movement
      .withJumpPower(this.gameState.currentJumpVelocity) // Higher jumps
      .build();

    this.gameBuilder.setMainPlayer(player);

    // === STEP 3: SET UP UI ===
    this.gameBuilder
      .setScore(this.gameState.score)
      .withLives(this.gameState.lives)
      .setLevel(2) // Show "Level 2"
      .showMessage("Level 2: Dimension Mastery!", 3000, "#00aaff")
      .showControls();

    // === STEP 4: CREATE LEVEL LAYOUT ===
    this.createLevel2Layout();

    // === STEP 5: FINALIZE ===
    this.gameBuilder.updateAllObjectVisibility();
    console.log("✅ Level 2 complete!");
  }

  // This creates the specific layout for Level 2
  private createLevel2Layout(): void {
    // === GROUND SECTION ===
    // Create ground platforms but with some gaps for challenge
    console.log("🏗️ Creating ground with gaps...");

    // Left ground section (tiles 0-5)
    for (let x = 0; x <= 5; x++) {
      this.gameBuilder
        .addPlatform()
        .atCoords(x, 13)
        .withCollider()
        .setSolid()
        .setDimension("both")
        .build();
    }

    // Gap from tiles 6-8 (player must jump across!)

    // Middle ground section (tiles 9-12)
    for (let x = 9; x <= 12; x++) {
      this.gameBuilder
        .addPlatform()
        .atCoords(x, 13)
        .withCollider()
        .setSolid()
        .setDimension("both")
        .build();
    }

    // Another gap from tiles 13-14

    // Right ground section (tiles 15-19)
    for (let x = 15; x <= 19; x++) {
      this.gameBuilder
        .addPlatform()
        .atCoords(x, 13)
        .withCollider()
        .setSolid()
        .setDimension("both")
        .build();
    }

    // === LIGHT DIMENSION PATH (EASIER BUT LONGER) ===
    console.log("💡 Creating light dimension path...");

    // This path takes you safely across the gaps but requires more jumps
    this.gameBuilder
      .addPlatform()
      .atCoords(6, 11)
      .withCollider()
      .setSolid()
      .setDimension(Dimension.LIGHT)
      .build();
    this.gameBuilder
      .addPlatform()
      .atCoords(8, 9)
      .withCollider()
      .setSolid()
      .setDimension(Dimension.LIGHT)
      .build();
    this.gameBuilder
      .addPlatform()
      .atCoords(10, 7)
      .withCollider()
      .setSolid()
      .setDimension(Dimension.LIGHT)
      .build();
    this.gameBuilder
      .addPlatform()
      .atCoords(12, 9)
      .withCollider()
      .setSolid()
      .setDimension(Dimension.LIGHT)
      .build();
    this.gameBuilder
      .addPlatform()
      .atCoords(14, 11)
      .withCollider()
      .setSolid()
      .setDimension(Dimension.LIGHT)
      .build();

    // Light dimension coins (easier to collect)
    this.gameBuilder
      .addCoin()
      .atCoords(6, 10)
      .withTexture("bronze-coin")
      .setDimension(Dimension.LIGHT)
      .animated()
      .build();
    this.gameBuilder
      .addCoin()
      .atCoords(10, 6)
      .withTexture("silver-coin")
      .setDimension(Dimension.LIGHT)
      .animated()
      .build();
    this.gameBuilder
      .addCoin()
      .atCoords(14, 10)
      .withTexture("bronze-coin")
      .setDimension(Dimension.LIGHT)
      .animated()
      .build();

    // === DARK DIMENSION PATH (HARDER BUT FASTER) ===
    console.log("🌙 Creating dark dimension path...");

    // This path is more direct but uses breakable platforms (risky!)
    this.gameBuilder
      .addPlatform()
      .atCoords(7, 12)
      .withCollider()
      .setBreakable()
      .setDimension(Dimension.DARK)
      .build();
    this.gameBuilder
      .addPlatform()
      .atCoords(13, 12)
      .withCollider()
      .setBreakable()
      .setDimension(Dimension.DARK)
      .build();

    // Dark dimension rewards (better coins but harder to reach)
    this.gameBuilder
      .addCoin()
      .atCoords(7, 11)
      .withTexture("gold-coin")
      .setDimension(Dimension.DARK)
      .animated()
      .build();
    this.gameBuilder
      .addCoin()
      .atCoords(13, 11)
      .withTexture("gold-coin")
      .setDimension(Dimension.DARK)
      .animated()
      .build();

    // === HIGH ALTITUDE SECTION ===
    console.log("🏔️ Creating high altitude challenges...");

    // Upper platforms that require dimension switching to reach
    this.gameBuilder
      .addPlatform()
      .atCoords(4, 8)
      .withCollider()
      .setSolid()
      .setDimension(Dimension.LIGHT)
      .build();
    this.gameBuilder
      .addPlatform()
      .atCoords(4, 6)
      .withCollider()
      .setSolid()
      .setDimension(Dimension.DARK)
      .build();
    this.gameBuilder
      .addPlatform()
      .atCoords(4, 4)
      .withCollider()
      .setSolid()
      .setDimension(Dimension.LIGHT)
      .build();

    // High-value secret coin (requires multiple dimension switches to reach)
    this.gameBuilder
      .addCoin()
      .atCoords(4, 3)
      .withTexture("ruby-coin")
      .setDimension(Dimension.DARK)
      .animated()
      .build();

    // Helper platform to get down safely
    this.gameBuilder
      .addPlatform()
      .atCoords(6, 6)
      .withCollider()
      .setSolid()
      .setDimension("both")
      .build();

    // === POWERUP SECTION ===
    console.log("⭐ Placing powerups...");

    // Speed boost to help with the longer jumps
    this.gameBuilder
      .addPowerup()
      .atCoords(1, 12)
      .ofType("speed-boost")
      .animated()
      .setDimension("both")
      .build();

    // Mushroom powerup in the middle section
    this.gameBuilder
      .addPowerup()
      .atCoords(10, 12)
      .ofType("mushroom")
      .animated()
      .setDimension("both")
      .build();

    // Secret 1-up in dark dimension
    this.gameBuilder
      .addPowerup()
      .atCoords(18, 12)
      .ofType("1up")
      .animated()
      .setDimension(Dimension.DARK)
      .build();

    // === FINAL CHALLENGE SECTION ===
    console.log("🎯 Creating final challenge...");

    // The last section requires mastery of dimension switching
    this.gameBuilder
      .addPlatform()
      .atCoords(16, 10)
      .withCollider()
      .setSolid()
      .setDimension(Dimension.LIGHT)
      .build();
    this.gameBuilder
      .addPlatform()
      .atCoords(17, 8)
      .withCollider()
      .setBreakable()
      .setDimension(Dimension.DARK)
      .build();
    this.gameBuilder
      .addPlatform()
      .atCoords(18, 6)
      .withCollider()
      .setSolid()
      .setDimension(Dimension.LIGHT)
      .build();

    // Final coin before exit
    this.gameBuilder
      .addCoin()
      .atCoords(18, 5)
      .withTexture("gold-coin")
      .animated()
      .setDimension("both")
      .build();

    // === EXIT PORTAL ===
    console.log("🌀 Creating exit portal...");

    const exitPortal = this.gameBuilder
      .addPortal()
      .atCoords(18, 12) // At the end of the level
      .withParticles() // Cool particle effects
      .goesToNextLevel() // Will go to Level 3 (or back to Level 1 if Level 3 doesn't exist)
      .setDimension("both") // Available in both dimensions
      .build();

    console.log("🌀 DEBUG: Portal created, registering for collision...");
    this.gameBuilder.registerPortal(exitPortal);
    console.log("🌀 DEBUG: Portal registration complete!");

    console.log("🎊 Level 2 layout complete!");
    console.log("📊 Level 2 Statistics:");
    console.log("   🏗️ 25+ platforms (solid and breakable)");
    console.log("   💰 8 coins (bronze, silver, gold, ruby)");
    console.log("   ⭐ 3 powerups (speed, mushroom, 1-up)");
    console.log("   🔄 Strategic dimension switching required");
    console.log("   🎯 Multiple solution paths available");
  }

  // Set up camera to follow player (same as Level 1)
  private setupCamera(): void {
    const player = this.gameBuilder.getMainPlayer();
    if (player) {
      this.cameras.main.startFollow(player, true, 0.08, 0.08);
      this.cameras.main.setViewport(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    }
  }

  // Game loop - runs 60 times per second (same as Level 1)
  update(): void {
    const player = this.gameBuilder.getMainPlayer();
    if (!player || !player.body) return;

    this.handleInput(player);
    this.checkPlayerDeath();
  }

  // Handle player death and respawning (same logic as Level 1)
  private checkPlayerDeath(): void {
    if (this.gameBuilder.checkPlayerDeath()) {
      if (!this.gameBuilder.isGameOver()) {
        // Respawn at starting position
        this.gameBuilder.respawnPlayer(2, 12);
        this.gameBuilder.showMessage(
          "Try again! Use X to switch dimensions!",
          2500,
          "#ff4444"
        );
        this.audioSystem.playSound("jump" as any); // Use jump sound as death sound
      } else {
        // Game over
        this.gameBuilder.showMessage("Game Over!", 3000, "#ff0000");
        console.log("Game Over on Level 2!");

        // Reset and restart
        this.time.delayedCall(3000, () => {
          this.gameBuilder.resetGameState();
          this.scene.restart();
        });
      }
    }
  }

  // Handle keyboard input (same as Level 1)
  private handleInput(player: Phaser.Physics.Arcade.Sprite): void {
    const body = player.body as Phaser.Physics.Arcade.Body;
    const isOnGround = body.touching.down;

    // Movement
    if (this.cursors.left.isDown) {
      body.setVelocityX(-this.gameState.currentPlayerSpeed);
      player.setFlipX(true);
      if (isOnGround) player.play("player-walk", true);
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(this.gameState.currentPlayerSpeed);
      player.setFlipX(false);
      if (isOnGround) player.play("player-walk", true);
    } else {
      body.setVelocityX(0);
      if (isOnGround) player.play("player-idle", true);
    }

    // Jumping
    if (this.cursors.up.isDown || this.spaceKey.isDown) {
      if (isOnGround) {
        body.setVelocityY(-this.gameState.currentJumpVelocity);
        this.audioSystem.playSound("jump" as any);
        player.play("player-jump");
      }
    }

    // Animation for air movement
    if (!isOnGround) {
      if (body.velocity.y < 0) {
        player.play("player-jump", true);
      } else {
        player.play("player-fall", true);
      }
    }
  }
}

/**
 * LEVEL 2 DESIGN PHILOSOPHY:
 *
 * Level 2 builds on Level 1 by:
 * 1. REQUIRING dimension switching to progress (not just optional)
 * 2. Introducing breakable platforms for risk/reward decisions
 * 3. Having multiple solution paths (easy light path vs. risky dark path)
 * 4. Including a vertical challenge section that requires alternating dimensions
 * 5. Slightly faster movement and higher jumps for smoother gameplay
 *
 * TEACHING PROGRESSION:
 * Level 1: Learn basic movement, jumping, and dimension switching
 * Level 2: Master dimension switching as a core gameplay mechanic
 * Future levels: More complex puzzles and challenges
 *
 * BEGINNER NOTES:
 * - If you want to modify this level, try changing the coordinates
 * - Add more coins in different positions
 * - Try different dimension combinations
 * - Experiment with platform types (solid vs. breakable)
 * - Add more powerups in strategic locations
 *
 * The level is designed to be challenging but fair, with multiple ways to succeed!
 */

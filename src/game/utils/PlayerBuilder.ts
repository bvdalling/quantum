/**
 * QUANTUM JUMPER - PLAYER BUILDER
 *
 * This builder class makes it super easy to create and configure player characters
 * using simple, readable code. The player is the main character that the user controls.
 *
 * WHAT IS A PLAYER?
 * The player is the character you control with the keyboard. It can:
 * - Move left and right with arrow keys
 * - Jump with space bar or up arrow
 * - Collect coins for points
 * - Use powerups for special abilities
 * - Switch between light and dark dimensions with X key
 * - Die and respawn if it falls off the world or hits enemies
 *
 * FLUENT API EXAMPLE:
 * createPlayer(scene)
 *   .withLives(3)           // Start with 3 lives
 *   .withScore(0)           // Start with 0 points
 *   .atPosition(5, 10)      // Place at grid position (5, 10)
 *   .withSpeed(200)         // Move at 200 pixels per second
 *   .withJumpPower(800)     // Jump with 800 pixels/second upward velocity
 *   .build();               // Create the player!
 *
 * BEGINNER TIP: You can change the speed and jump power to make the game
 * easier (higher values) or harder (lower values) to control.
 */

import Phaser from "phaser";
import { PLAYER_SPEED, JUMP_VELOCITY, GRAVITY, TILE_SIZE } from "../constants";

export class PlayerBuilder {
  private scene: Phaser.Scene; // The game scene that will contain this player
  private lives: number = 3; // How many lives the player starts with
  private score: number = 0; // Starting score (points earned)
  private x: number = 0; // X position in pixels
  private y: number = 0; // Y position in pixels
  private speed: number = PLAYER_SPEED; // How fast the player moves left/right
  private jumpPower: number = JUMP_VELOCITY; // How high the player can jump
  private texture: string = "player"; // Which graphic to use for the player
  private scale: number = 1; // How big the player should be (1 = normal size)

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Set how many lives the player starts with
   * Lives are lost when the player dies (falls off the world, hits enemies, etc.)
   * When lives reach 0, it's game over!
   * @param lives Number of lives (default: 3, like classic Mario games)
   */
  withLives(lives: number): PlayerBuilder {
    this.lives = lives;
    return this; // Return 'this' so you can chain more methods
  }

  /**
   * Set the player's starting score
   * Score increases when collecting coins and completing challenges
   * @param score Starting score in points (default: 0)
   */
  withScore(score: number): PlayerBuilder {
    this.score = score;
    return this;
  }

  /**
   * Set where the player starts in the level using grid coordinates
   * Grid coordinates are much easier than pixel coordinates!
   * @param gridX How many tiles from the left edge (0 = leftmost)
   * @param gridY How many tiles from the top edge (0 = topmost)
   */
  atPosition(gridX: number, gridY: number): PlayerBuilder {
    // Convert grid coordinates to pixel coordinates
    // Each grid square is TILE_SIZE pixels (32x32)
    // We add TILE_SIZE/2 to center the player in the grid square
    this.x = gridX * TILE_SIZE + TILE_SIZE / 2;
    this.y = gridY * TILE_SIZE + TILE_SIZE / 2;
    return this;
  }

  /**
   * Set the player's position using exact pixel coordinates
   * (Advanced: Most beginners should use atPosition() instead)
   * @param x Exact X coordinate in pixels
   * @param y Exact Y coordinate in pixels
   */
  atPixelPosition(x: number, y: number): PlayerBuilder {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Set how fast the player moves left and right
   * Higher values = faster movement (easier to control)
   * Lower values = slower movement (more challenging)
   * @param speed Movement speed in pixels per second (default: 180)
   */
  withSpeed(speed: number): PlayerBuilder {
    this.speed = speed;
    return this;
  }

  /**
   * Set how high the player can jump
   * Higher values = higher jumps (easier to reach platforms)
   * Lower values = lower jumps (more challenging platforming)
   * @param jumpPower Jump velocity in pixels per second (default: 800)
   */
  withJumpPower(jumpPower: number): PlayerBuilder {
    this.jumpPower = jumpPower;
    return this;
  }

  /**
   * Set which graphics to use for the player
   * (Advanced: Most beginners can skip this and use the default)
   * @param texture Name of the texture/image to use (default: "player")
   */
  withTexture(texture: string): PlayerBuilder {
    this.texture = texture;
    return this;
  }

  /**
   * Set how big the player appears on screen
   * @param scale Size multiplier (1.0 = normal size, 2.0 = double size, 0.5 = half size)
   */
  withScale(scale: number): PlayerBuilder {
    this.scale = scale;
    return this;
  }

  /**
   * Actually create the player sprite with all the settings you've configured
   * This is the final step - call this after setting up all the properties you want
   * @returns The created player sprite that you can control and that has physics
   */
  build(): Phaser.Physics.Arcade.Sprite {
    console.log(
      `🎮 Creating player at grid position (${Math.floor(
        this.x / TILE_SIZE
      )}, ${Math.floor(this.y / TILE_SIZE)})`
    );

    // Create the physics-enabled sprite (this gives the player collision and gravity)
    const player = this.scene.physics.add.sprite(this.x, this.y, this.texture);

    // Configure how the player bounces and moves
    player.setBounce(0.2); // Small bounce when landing (feels natural)
    player.setCollideWorldBounds(false); // Allow falling out of world (for death detection)
    player.setScale(this.scale); // Set the size
    player.body!.setGravityY(GRAVITY); // Apply gravity so player falls down

    // Store game state information with the player object
    // These properties will be used by the game logic to track the player's progress
    (player as any).lives = this.lives; // How many lives the player has
    (player as any).score = this.score; // Current score
    (player as any).moveSpeed = this.speed; // Movement speed
    (player as any).jumpPower = this.jumpPower; // Jump strength

    // Set up player animations (walking, jumping, etc.)
    this.setupAnimations(player);

    console.log(`✅ Player created successfully!`);
    return player;
  }

  /**
   * Set up all the animations for the player character
   * This creates the walking, standing, and jumping animations
   * @param player The player sprite to attach animations to
   */
  private setupAnimations(player: Phaser.Physics.Arcade.Sprite): void {
    // Create walking animation (cycles through walking frames)
    if (!this.scene.anims.exists("player-walk")) {
      try {
        this.scene.anims.create({
          key: "player-walk", // Name of the animation
          frames: [
            { key: "player-walk1" }, // Walking frame 1
            { key: "player-walk2" }, // Walking frame 2
            { key: "player-walk3" }, // Walking frame 3
          ],
          frameRate: 8, // 8 frames per second (smooth walking)
          repeat: -1, // Loop forever while walking
        });
      } catch (e) {
        console.warn("Could not create walking animation:", e);
      }
    }

    // Create idle/standing animation
    if (!this.scene.anims.exists("player-idle")) {
      try {
        this.scene.anims.create({
          key: "player-idle", // Name of the animation
          frames: [{ key: this.texture }], // Just the basic standing frame
          frameRate: 1, // Barely moving
        });
      } catch (e) {
        console.warn("Could not create idle animation:", e);
      }
    }

    // Create jumping animation
    if (!this.scene.anims.exists("player-jump")) {
      try {
        this.scene.anims.create({
          key: "player-jump", // Name of the animation
          frames: [{ key: "player-jump" }], // The jumping pose frame
          frameRate: 1, // Static pose
        });
      } catch (e) {
        console.warn("Could not create jump animation:", e);
      }
    }

    // Create falling animation
    if (!this.scene.anims.exists("player-fall")) {
      try {
        this.scene.anims.create({
          key: "player-fall", // Name of the animation
          frames: [{ key: "player-fall" }], // The falling pose frame
          frameRate: 1, // Static pose
        });
      } catch (e) {
        console.warn("Could not create fall animation:", e);
      }
    }

    // Start the player with the idle animation
    player.play("player-idle");
  }
}

/**
 * Helper function to create a new PlayerBuilder
 * This is the function you'll actually use in your game code!
 *
 * @param scene The Phaser scene where the player will live
 * @returns A new PlayerBuilder ready for configuration
 *
 * EXAMPLE USAGE:
 * const player = createPlayer(this)  // 'this' is your scene
 *   .withLives(3)
 *   .build();
 */
export function createPlayer(scene: Phaser.Scene): PlayerBuilder {
  return new PlayerBuilder(scene);
}

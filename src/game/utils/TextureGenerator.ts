/**
 * QUANTUM JUMPER - TEXTURE GENERATOR
 *
 * This system loads all the graphics (textures) for our game. Think of textures
 * as the "costumes" or "skins" that make our game objects look pretty!
 *
 * HOW IT WORKS:
 * - We load pre-made 32x32 pixel art images from the public/textures folder
 * - Each game object type (player, coins, platforms) has its own texture
 * - We can also generate simple textures using code if needed
 *
 * PIXEL ART STYLE:
 * Our game uses 32x32 pixel sprites for a retro, 8-bit feel. All sprites
 * are the same size so they align perfectly on our grid system.
 *
 * BEGINNER TIP: You can replace any texture by putting a new 32x32 PNG file
 * in the public/textures folder with the same name!
 */

import Phaser from "phaser";
import { TileType } from "../constants";

export class TextureGenerator {
  private scene: Phaser.Scene; // The game scene that will use these textures

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Get the correct texture name for a given tile type
   * This maps the symbols we use in level maps to actual texture file names
   * @param tileType - The tile type symbol (like TileType.GOLD_COIN)
   * @returns The name of the texture file to use
   */
  static getTextureKey(tileType: TileType): string {
    switch (tileType) {
      // === COIN TEXTURES ===
      case TileType.COIN: // Generic coin symbol
      case TileType.BRONZE_COIN: // Bronze coin symbol
        return "bronze-coin"; // Use bronze coin texture (brown colored)
      case TileType.SILVER_COIN:
        return "silver-coin"; // Silver coin texture (shiny gray)
      case TileType.GOLD_COIN:
        return "gold-coin"; // Gold coin texture (bright yellow)
      case TileType.RUBY_COIN:
        return "ruby-coin"; // Ruby coin texture (red, most valuable)

      // === POWERUP TEXTURES ===
      case TileType.POWERUP: // Generic powerup symbol
      case TileType.MUSHROOM: // Mushroom symbol
        return "mushroom"; // Mushroom texture (like Super Mario)
      case TileType.ONE_UP:
        return "1up"; // Extra life texture (usually green)
      case TileType.POISON:
        return "poison"; // Poison texture (dangerous, purple)
      case TileType.FIRE_FLOWER:
        return "fire-flower"; // Fire flower texture (gives invincibility)
      case TileType.STAR:
        return "star"; // Star texture (super jump boost)
      case TileType.SPEED_BOOST:
        return "speed-boost"; // Speed boost texture (makes player faster)

      default:
        return "coin"; // Fallback to basic coin if unknown type
    }
  }

  /**
   * Check if a tile type represents a collectible coin
   * This helps us know which objects should give points when collected
   */
  static isCoinType(tileType: TileType): boolean {
    return [
      TileType.COIN, // Generic coin
      TileType.BRONZE_COIN, // 1 point
      TileType.SILVER_COIN, // 5 points
      TileType.GOLD_COIN, // 10 points
      TileType.RUBY_COIN, // 25 points
    ].includes(tileType);
  }

  /**
   * Check if a tile type represents a powerup item
   * This helps us know which objects should give special abilities when collected
   */
  static isPowerupType(tileType: TileType): boolean {
    return [
      TileType.POWERUP, // Generic powerup
      TileType.MUSHROOM, // Makes player grow, gives points
      TileType.ONE_UP, // Gives extra life
      TileType.POISON, // Dangerous - takes away life
      TileType.FIRE_FLOWER, // Temporary invincibility
      TileType.STAR, // Super jump boost
      TileType.SPEED_BOOST, // Temporary speed increase
    ].includes(tileType);
  }

  /**
   * Load all game textures from files and generate others procedurally
   * This is called during the preload phase of our game scenes
   */
  loadAllTextures(): void {
    console.log("🎨 Loading all game textures...");

    // === PLAYER TEXTURES ===
    // Load all the different player animations (standing, walking, jumping)
    this.scene.load.image("player", "/textures/player/base-player.svg"); // Standing still
    this.scene.load.image("player-walk1", "/textures/player/player-walk1.svg"); // Walking frame 1
    this.scene.load.image("player-walk2", "/textures/player/player-walk2.svg"); // Walking frame 2
    this.scene.load.image("player-walk3", "/textures/player/player-walk3.svg"); // Walking frame 3
    this.scene.load.image("player-jump", "/textures/player/player-jump.svg"); // Jumping up
    this.scene.load.image("player-fall", "/textures/player/player-fall.svg"); // Falling down

    // === PLATFORM TEXTURES ===
    // The solid blocks that players can stand on
    this.scene.load.image("platform", "/textures/platforms/base-platform.svg");

    // === COIN TEXTURES ===
    // Different types of coins with different point values
    this.scene.load.image("coin", "/textures/coins/bronze-coin.svg"); // Default coin (1 point)
    this.scene.load.image("bronze-coin", "/textures/coins/bronze-coin.svg"); // Bronze coin (1 point)
    this.scene.load.image("silver-coin", "/textures/coins/silver-coin.svg"); // Silver coin (5 points)
    this.scene.load.image("gold-coin", "/textures/coins/gold-coin.svg"); // Gold coin (10 points)
    this.scene.load.image("ruby-coin", "/textures/coins/ruby-coin.svg"); // Ruby coin (25 points)

    // === POWERUP TEXTURES ===
    // Special items that give the player abilities
    this.scene.load.image("powerup", "/textures/powerups/mushroom.svg"); // Default powerup
    this.scene.load.image("mushroom", "/textures/powerups/mushroom.svg"); // Growth/points
    this.scene.load.image("1up", "/textures/powerups/1up.svg"); // Extra life
    this.scene.load.image("poison", "/textures/powerups/poison.svg"); // Lose life (dangerous!)
    this.scene.load.image("fire-flower", "/textures/powerups/fire-flower.svg"); // Temporary invincibility
    this.scene.load.image("star", "/textures/powerups/star.svg"); // Super jump boost
    this.scene.load.image("speed-boost", "/textures/powerups/speed-boost.svg"); // Speed boost

    console.log("✅ All texture files loaded!");
  }

  /**
   * Create textures using code instead of loading from files
   * This is useful for simple shapes like portals and particle effects
   * Called after the scene is created (in the create phase)
   */
  createProceduralTextures(): void {
    console.log("🎨 Creating procedural textures...");
    this.createPortalTexture(); // Create the swirling portal effect
    this.createParticleTextures(); // Create simple particle shapes
    console.log("✅ Procedural textures created!");
  }

  /**
   * Create a swirling portal texture using graphics
   * This creates a 32x32 green vortex that looks mystical
   */
  private createPortalTexture(): void {
    // Create a graphics object to draw shapes
    const graphics = this.scene.add.graphics();

    // Draw the main portal background (bright green square)
    graphics.fillStyle(0x00ff00); // Bright green color
    graphics.fillRect(0, 0, 32, 32); // Fill the entire 32x32 area

    // Draw the outer swirl ring (lime green circle)
    graphics.fillStyle(0x32cd32); // Lime green color
    graphics.fillCircle(16, 16, 12); // Circle at center, radius 12

    // Draw the inner vortex core (bright green circle)
    graphics.fillStyle(0x00ff00); // Back to bright green
    graphics.fillCircle(16, 16, 8); // Smaller circle at center, radius 8

    // Draw the center glow (light green circle)
    graphics.fillStyle(0x90ee90); // Light green color
    graphics.fillCircle(16, 16, 4); // Tiny circle at center, radius 4

    // Add spiral pattern for vortex effect
    graphics.fillStyle(0x006400); // Dark green color
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2; // Divide circle into 8 segments
      const x = 16 + Math.cos(angle) * 10; // Calculate X position
      const y = 16 + Math.sin(angle) * 10; // Calculate Y position
      graphics.fillRect(x, y, 2, 2); // Draw small dark green square
    }

    // Convert the drawing to a reusable texture
    graphics.generateTexture("portal", 32, 32);
    graphics.destroy(); // Clean up the graphics object
  }

  /**
   * Create simple particle textures for visual effects
   * These are used for collection effects, portal particles, etc.
   */
  private createParticleTextures(): void {
    // Standard particle - 4x4 white square for general effects
    const particle = this.scene.add.graphics();
    particle.fillStyle(0xffffff); // White color
    particle.fillRect(0, 0, 4, 4); // 4x4 pixel square
    particle.generateTexture("particle", 4, 4); // Save as "particle" texture
    particle.destroy(); // Clean up

    // Portal particle - 3x3 green square for portal effects
    const portalParticle = this.scene.add.graphics();
    portalParticle.fillStyle(0x00ff00); // Bright green color
    portalParticle.fillRect(0, 0, 3, 3); // 3x3 pixel square
    portalParticle.generateTexture("portal_particle", 3, 3); // Save as "portal_particle" texture
    portalParticle.destroy(); // Clean up
  }

  /**
   * Create animated sequences for the player character
   * This defines how the player looks when walking, jumping, etc.
   * Called after all textures are loaded
   */
  createPlayerAnimations(): void {
    // Walking animation - cycles through different walking poses
    this.scene.anims.create({
      key: "player-walk", // Name of this animation
      frames: [
        { key: "player" }, // Standing frame (starting position)
        { key: "player-walk1" }, // Right foot forward
        { key: "player-walk2" }, // Mid-stride (both feet together)
        { key: "player-walk3" }, // Left foot forward
        { key: "player-walk2" }, // Mid-stride again (smooth transition)
      ],
      frameRate: 8, // Play 8 frames per second (smooth but not too fast)
      repeat: -1, // Loop forever while walking
    });

    // Idle/standing animation - just standing still
    this.scene.anims.create({
      key: "player-idle", // Name of this animation
      frames: [{ key: "player" }], // Just the basic standing pose
      frameRate: 1, // Only 1 frame per second (barely moving)
      repeat: 0, // Don't loop (just stay on this frame)
    });

    // Jumping animation - legs bent up while jumping
    this.scene.anims.create({
      key: "player-jump", // Name of this animation
      frames: [{ key: "player-jump" }], // The jumping pose
      frameRate: 1, // Static pose
      repeat: 0, // Don't loop
    });

    // Falling animation - different pose when falling down
    this.scene.anims.create({
      key: "player-fall", // Name of this animation
      frames: [{ key: "player-fall" }], // The falling pose
      frameRate: 1, // Static pose
      repeat: 0, // Don't loop
    });

    console.log("✅ Player animations created!");
  }
}

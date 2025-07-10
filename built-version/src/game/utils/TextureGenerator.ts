/**
 * Texture Generator
 *
 * Loads pre-made 32x32 pixel art textures for the game and generates procedural textures
 */

import Phaser from "phaser";
import { TileType } from "../constants";

export class TextureGenerator {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Get the texture key for a given tile type
   */
  static getTextureKey(tileType: TileType): string {
    switch (tileType) {
      case TileType.COIN:
      case TileType.BRONZE_COIN:
        return "bronze-coin";
      case TileType.SILVER_COIN:
        return "silver-coin";
      case TileType.GOLD_COIN:
        return "gold-coin";
      case TileType.RUBY_COIN:
        return "ruby-coin";
      case TileType.POWERUP:
      case TileType.MUSHROOM:
        return "mushroom";
      case TileType.ONE_UP:
        return "1up";
      case TileType.POISON:
        return "poison";
      case TileType.FIRE_FLOWER:
        return "fire-flower";
      case TileType.STAR:
        return "star";
      case TileType.SPEED_BOOST:
        return "speed-boost";
      default:
        return "coin"; // Fallback
    }
  }

  /**
   * Check if a tile type is a coin
   */
  static isCoinType(tileType: TileType): boolean {
    return [
      TileType.COIN,
      TileType.BRONZE_COIN,
      TileType.SILVER_COIN,
      TileType.GOLD_COIN,
      TileType.RUBY_COIN,
    ].includes(tileType);
  }

  /**
   * Check if a tile type is a powerup
   */
  static isPowerupType(tileType: TileType): boolean {
    return [
      TileType.POWERUP,
      TileType.MUSHROOM,
      TileType.ONE_UP,
      TileType.POISON,
      TileType.FIRE_FLOWER,
      TileType.STAR,
      TileType.SPEED_BOOST,
    ].includes(tileType);
  }

  /**
   * Load all game textures - both from SVG files and procedural generation
   */
  loadAllTextures(): void {
    // Load main game sprites from SVG files
    this.scene.load.image("player", "/textures/player/base-player.svg");
    this.scene.load.image("player-walk1", "/textures/player/player-walk1.svg");
    this.scene.load.image("player-walk2", "/textures/player/player-walk2.svg");
    this.scene.load.image("player-walk3", "/textures/player/player-walk3.svg");
    this.scene.load.image("player-jump", "/textures/player/player-jump.svg");
    this.scene.load.image("player-fall", "/textures/player/player-fall.svg");
    this.scene.load.image("platform", "/textures/platforms/base-platform.svg");

    // Load coin variants
    this.scene.load.image("coin", "/textures/coins/bronze-coin.svg"); // Default coin
    this.scene.load.image("bronze-coin", "/textures/coins/bronze-coin.svg");
    this.scene.load.image("silver-coin", "/textures/coins/silver-coin.svg");
    this.scene.load.image("gold-coin", "/textures/coins/gold-coin.svg");
    this.scene.load.image("ruby-coin", "/textures/coins/ruby-coin.svg");

    // Load powerup variants
    this.scene.load.image("powerup", "/textures/powerups/mushroom.svg"); // Default powerup
    this.scene.load.image("mushroom", "/textures/powerups/mushroom.svg");
    this.scene.load.image("1up", "/textures/powerups/1up.svg");
    this.scene.load.image("poison", "/textures/powerups/poison.svg");
    this.scene.load.image("fire-flower", "/textures/powerups/fire-flower.svg");
    this.scene.load.image("star", "/textures/powerups/star.svg");
    this.scene.load.image("speed-boost", "/textures/powerups/speed-boost.svg");
  }

  /**
   * Create procedural textures for portal and particles (called after SVGs are loaded)
   */
  createProceduralTextures(): void {
    this.createPortalTexture();
    this.createParticleTextures();
  }

  private createPortalTexture(): void {
    // Portal - 32x32 swirling green vortex
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x00ff00); // Bright green
    graphics.fillRect(0, 0, 32, 32);

    // Swirl pattern
    graphics.fillStyle(0x32cd32); // Lime green
    graphics.fillCircle(16, 16, 12);

    graphics.fillStyle(0x00ff00);
    graphics.fillCircle(16, 16, 8);

    graphics.fillStyle(0x90ee90); // Light green
    graphics.fillCircle(16, 16, 4);

    // Spiral effect
    graphics.fillStyle(0x006400); // Dark green
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = 16 + Math.cos(angle) * 10;
      const y = 16 + Math.sin(angle) * 10;
      graphics.fillRect(x, y, 2, 2);
    }

    graphics.generateTexture("portal", 32, 32);
    graphics.destroy();
  }

  private createParticleTextures(): void {
    // Particle texture - 4x4 white square
    const particle = this.scene.add.graphics();
    particle.fillStyle(0xffffff);
    particle.fillRect(0, 0, 4, 4);
    particle.generateTexture("particle", 4, 4);
    particle.destroy();

    // Portal particle texture - 3x3 green square
    const portalParticle = this.scene.add.graphics();
    portalParticle.fillStyle(0x00ff00);
    portalParticle.fillRect(0, 0, 3, 3);
    portalParticle.generateTexture("portal_particle", 3, 3);
    portalParticle.destroy();
  }

  /**
   * Create player walking animation after textures are loaded
   */
  createPlayerAnimations(): void {
    // Create walking animation
    this.scene.anims.create({
      key: "player-walk",
      frames: [
        { key: "player" }, // Standing frame
        { key: "player-walk1" }, // Right foot forward
        { key: "player-walk2" }, // Mid-stride
        { key: "player-walk3" }, // Left foot forward
        { key: "player-walk2" }, // Mid-stride again
      ],
      frameRate: 8, // 8 frames per second for smooth walking
      repeat: -1, // Loop indefinitely
    });

    // Create idle/standing animation
    this.scene.anims.create({
      key: "player-idle",
      frames: [{ key: "player" }],
      frameRate: 1,
      repeat: 0,
    });

    // Create jumping animation (legs bent up)
    this.scene.anims.create({
      key: "player-jump",
      frames: [{ key: "player-jump" }],
      frameRate: 1,
      repeat: 0,
    });

    // Create falling animation (arms spread, legs extended)
    this.scene.anims.create({
      key: "player-fall",
      frames: [{ key: "player-fall" }],
      frameRate: 1,
      repeat: 0,
    });
  }
}

/**
 * Texture Generator
 *
 * Loads pre-made 32x32 pixel art textures for the game and generates procedural textures
 */

import Phaser from "phaser";

export class TextureGenerator {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Load all game textures - both from SVG files and procedural generation
   */
  loadAllTextures(): void {
    // Load main game sprites from SVG files
    this.scene.load.image("player", "/textures/player/base-player.svg");
    this.scene.load.image("platform", "/textures/platforms/base-platform.svg");
    this.scene.load.image("coin", "/textures/coins/base-coin.svg");
    this.scene.load.image("powerup", "/textures/powerups/base-powerup.svg");
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
}

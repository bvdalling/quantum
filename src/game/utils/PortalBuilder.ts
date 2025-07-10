/**
 * QUANTUM JUMPER - PORTAL BUILDER
 *
 * This builder creates magical portals that allow players to travel between levels
 * or areas. Portals are the "exit doors" of our platformer game!
 *
 * WHAT ARE PORTALS?
 * Portals are special objects that transport the player when touched. They can:
 * - Take the player to the next level
 * - Take the player to a specific scene
 * - Execute custom actions when activated
 * - Show swirling particle effects for visual appeal
 * - Exist in specific dimensions or be accessible from both
 *
 * FLUENT API EXAMPLE:
 * createPortal(scene)
 *   .atCoords(20, 12)        // Place at grid position (20, 12)
 *   .withParticles()         // Add swirling particle effects
 *   .goesToNextLevel()       // Advances to next level when touched
 *   .setDimension("both")    // Accessible from both light and dark dimensions
 *   .build();                // Create it!
 *
 * PORTAL TYPES:
 * - Level portals: Advance to the next level in sequence
 * - Scene portals: Go to a specific named scene
 * - Custom portals: Execute custom code when activated
 */

import Phaser from "phaser";
import { TILE_SIZE } from "../constants";

export class PortalBuilder {
  private scene: Phaser.Scene; // The game scene that will contain this portal
  private x: number = 0; // X position in pixels
  private y: number = 0; // Y position in pixels
  private textureKey: string = "portal"; // Which graphic to use for the portal
  private scale: number = 1; // How big the portal appears
  private hasParticles: boolean = true; // Whether to show swirling particle effects
  private isActive: boolean = true; // Whether the portal is currently functional
  private targetLevel: number | null = null; // What level to go to (for level progression)
  private targetScene: string | null = null; // What scene to go to (for specific scenes)
  private onActivate: (() => void) | null = null; // Custom function to run when activated
  private dimension: "light" | "dark" | "both" = "both"; // Which dimension(s) the portal exists in

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Set the portal's position using grid coordinates (recommended)
   * @param gridX X coordinate in grid units (each unit = 32 pixels)
   * @param gridY Y coordinate in grid units (each unit = 32 pixels)
   */
  atCoords(gridX: number, gridY: number): PortalBuilder {
    this.x = gridX * TILE_SIZE + TILE_SIZE / 2;
    this.y = gridY * TILE_SIZE + TILE_SIZE / 2;
    return this;
  }

  /**
   * Set the portal's position using exact pixel coordinates
   * @param x X coordinate in pixels
   * @param y Y coordinate in pixels
   */
  atPixelCoords(x: number, y: number): PortalBuilder {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Set the portal to use tile-based coordinates (legacy method)
   * @param tileX Tile X coordinate (multiplied by TILE_SIZE)
   * @param tileY Tile Y coordinate (multiplied by TILE_SIZE)
   * @deprecated Use atCoords() instead for consistency
   */
  atTileCoords(tileX: number, tileY: number): PortalBuilder {
    this.x = tileX * TILE_SIZE + TILE_SIZE / 2;
    this.y = tileY * TILE_SIZE + TILE_SIZE / 2;
    return this;
  }

  /**
   * Set the portal's texture/appearance
   * @param texture Texture key to use for the portal sprite
   */
  withTexture(texture: string): PortalBuilder {
    this.textureKey = texture;
    return this;
  }

  /**
   * Set the portal's scale (size)
   * @param scale Scale multiplier (1 = normal size, 2 = double size, etc.)
   */
  withScale(scale: number): PortalBuilder {
    this.scale = scale;
    return this;
  }

  /**
   * Enable particle effects around the portal (default)
   */
  withParticles(): PortalBuilder {
    this.hasParticles = true;
    return this;
  }

  /**
   * Disable particle effects around the portal
   */
  withoutParticles(): PortalBuilder {
    this.hasParticles = false;
    return this;
  }

  /**
   * Make the portal active and responsive to player touch (default)
   */
  setActive(): PortalBuilder {
    this.isActive = true;
    return this;
  }

  /**
   * Make the portal inactive (decorative only)
   */
  setInactive(): PortalBuilder {
    this.isActive = false;
    return this;
  }

  /**
   * Set which level this portal leads to
   * @param level Level number to transition to
   */
  leadsToLevel(level: number): PortalBuilder {
    this.targetLevel = level;
    return this;
  }

  /**
   * Set which scene this portal leads to
   * @param sceneName Scene key to transition to
   */
  leadsToScene(sceneName: string): PortalBuilder {
    this.targetScene = sceneName;
    return this;
  }

  /**
   * Set a custom callback function when the portal is activated
   * @param callback Function to call when player touches the portal
   */
  onActivation(callback: () => void): PortalBuilder {
    this.onActivate = callback;
    return this;
  }

  /**
   * Set which dimension(s) this portal is visible in
   * @param dimension "light", "dark", or "both"
   */
  setDimension(dimension: "light" | "dark" | "both"): PortalBuilder {
    this.dimension = dimension;
    return this;
  }

  /**
   * Convenience method - makes portal visible only in light dimension
   */
  lightDimensionOnly(): PortalBuilder {
    this.dimension = "light";
    return this;
  }

  /**
   * Convenience method - makes portal visible only in dark dimension
   */
  darkDimensionOnly(): PortalBuilder {
    this.dimension = "dark";
    return this;
  }

  /**
   * Convenience method - makes portal visible in both dimensions (default)
   */
  bothDimensions(): PortalBuilder {
    this.dimension = "both";
    return this;
  }

  /**
   * Convenience method - makes portal go to next level
   */
  goesToNextLevel(): PortalBuilder {
    console.log("🎯 DEBUG: Setting up goesToNextLevel callback");
    this.onActivate = () => {
      console.log("🚀 DEBUG: goesToNextLevel callback executing!");
      console.log("   Current scene:", this.scene.scene.key);

      // Determine what the next level should be based on current scene
      let nextScene = "Level2Scene"; // Default to Level 2

      if (this.scene.scene.key === "QuantumJumperScene") {
        nextScene = "Level2Scene";
        console.log("   From QuantumJumperScene -> Level2Scene");
      } else if (this.scene.scene.key === "Level2Scene") {
        nextScene = "QuantumJumperScene"; // Back to Level 1 for now (could be Level 3 later)
        console.log("   From Level2Scene -> QuantumJumperScene");
      }

      console.log("   Target scene:", nextScene);

      // Show completion message
      if (this.scene.add && this.scene.add.text) {
        console.log("   Creating completion message...");
        const completionText = this.scene.add.text(
          240, // Center of 480px viewport
          240,
          "Level Complete!\nPress SPACE to continue",
          {
            fontSize: "24px",
            color: "#00ff00",
            align: "center",
            fontFamily: "Arial",
          }
        );
        completionText.setOrigin(0.5, 0.5);
        completionText.setDepth(1000); // Make sure it's on top

        // Add input listener for continuing
        const spaceKey = this.scene.input.keyboard?.addKey("SPACE");
        if (spaceKey) {
          spaceKey.once("down", () => {
            console.log(`Transitioning to ${nextScene}...`);
            this.scene.scene.start(nextScene);
          });
        }
      }
    };
    return this;
  }

  /**
   * Convenience method - makes portal restart current level
   */
  restartsLevel(): PortalBuilder {
    this.onActivate = () => {
      console.log("Restarting level!");
      this.scene.scene.restart();
    };
    return this;
  }

  /**
   * Convenience method - makes portal transition to a specific scene
   * @param sceneName The key of the scene to transition to
   */
  goesToScene(sceneName: string): PortalBuilder {
    this.onActivate = () => {
      console.log(`Transitioning to scene: ${sceneName}`);

      // Show transition message
      if (this.scene.add && this.scene.add.text) {
        const transitionText = this.scene.add.text(
          240, // Center of 480px viewport
          240,
          `Loading ${sceneName}...`,
          {
            fontSize: "24px",
            color: "#ffff00",
            align: "center",
            fontFamily: "Arial",
          }
        );
        transitionText.setOrigin(0.5, 0.5);
        transitionText.setDepth(1000); // Make sure it's on top

        // Transition after a short delay
        this.scene.time.delayedCall(1000, () => {
          this.scene.scene.start(sceneName);
        });
      }
    };
    return this;
  }

  /**
   * Create the portal sprite with all configured properties
   * @returns The created portal sprite with attached particle system
   */
  build(): {
    portal: Phaser.GameObjects.Sprite;
    particles?: Phaser.GameObjects.Particles.ParticleEmitter;
  } {
    // Create the portal sprite
    console.log("🌀 DEBUG: Creating portal sprite");
    const portal = this.scene.add.sprite(this.x, this.y, this.textureKey);
    portal.setOrigin(0.5, 0.5);
    portal.setScale(this.scale);

    // Store portal properties
    (portal as any).isActive = this.isActive;
    (portal as any).targetLevel = this.targetLevel;
    (portal as any).targetScene = this.targetScene;
    (portal as any).onActivate = this.onActivate;
    (portal as any).dimension = this.dimension;

    console.log("🌀 DEBUG: Portal properties set:");
    console.log("   Position:", this.x, this.y);
    console.log("   Active:", this.isActive);
    console.log("   Has callback:", !!this.onActivate);
    console.log("   Target level:", this.targetLevel);
    console.log("   Target scene:", this.targetScene);
    console.log("   Dimension:", this.dimension);

    // Add floating animation
    this.scene.tweens.add({
      targets: portal,
      y: portal.y - 5,
      duration: 2000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    // Add rotation animation
    this.scene.tweens.add({
      targets: portal,
      angle: 360,
      duration: 8000,
      repeat: -1,
    });

    let particles;
    if (this.hasParticles) {
      particles = this.createParticleSystem(portal);
    }

    return { portal, particles };
  }

  private createParticleSystem(
    _portal: Phaser.GameObjects.Sprite
  ): Phaser.GameObjects.Particles.ParticleEmitter | undefined {
    try {
      // Create particle system around the portal
      const particles = this.scene.add.particles(
        this.x,
        this.y,
        "portal_particle",
        {
          speed: { min: 20, max: 40 },
          scale: { start: 0.3, end: 0 },
          lifespan: 1000,
          frequency: 100,
          emitZone: {
            type: "edge",
            source: new Phaser.Geom.Circle(0, 0, 20),
            quantity: 2,
          },
        }
      );

      particles.start();
      return particles;
    } catch (error) {
      console.warn("Could not create portal particles:", error);
      return undefined;
    }
  }
}

/**
 * Helper function to create a new PortalBuilder
 * @param scene The Phaser scene to create the portal in
 * @returns A new PortalBuilder instance
 */
export function createPortal(scene: Phaser.Scene): PortalBuilder {
  return new PortalBuilder(scene);
}

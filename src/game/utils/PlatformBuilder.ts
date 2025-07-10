/**
 * QUANTUM JUMPER - PLATFORM BUILDER
 *
 * This builder creates platforms that players can jump on and stand on.
 * Platforms are the foundation of platformer games - without them, there's
 * nowhere to jump!
 *
 * WHAT ARE PLATFORMS?
 * Platforms are solid blocks that the player can:
 * - Stand on (they have collision)
 * - Jump on from below
 * - Jump off of to reach higher areas
 * - Sometimes break when jumped on (breakable platforms)
 * - Exist in specific dimensions (light, dark, or both)
 *
 * FLUENT API EXAMPLE:
 * createPlatform(scene, group)
 *   .atCoords(8, 12)        // Place at grid position (8, 12)
 *   .withCollider()         // Player can stand on it
 *   .setSolid()             // Won't break when touched
 *   .setDimension("light")  // Only visible in light dimension
 *   .build();               // Create it!
 *
 * TYPES OF PLATFORMS:
 * - Solid platforms: Never break, always safe to stand on
 * - Breakable platforms: Break after a few seconds when stepped on (adds challenge)
 * - Dimension-specific: Only appear in light dimension, dark dimension, or both
 */

import Phaser from "phaser";
import { TILE_SIZE, Dimension } from "../constants";

export class PlatformBuilder {
  private group: Phaser.Physics.Arcade.StaticGroup; // The physics group this platform belongs to
  private x: number = 0; // X position in pixels
  private y: number = 0; // Y position in pixels
  private texture: string = "platform"; // Which graphic to use
  private scale: number = 1; // How big the platform is
  private hasCollider: boolean = true; // Whether player can stand on it
  private isBreakable: boolean = false; // Whether it breaks when touched
  private isMoving: boolean = false; // Whether it moves back and forth (future feature)
  private moveSpeed: number = 50; // Speed of moving platforms
  private moveDistance: number = 100; // Distance moving platforms travel
  private isVisible: boolean = true; // Whether it's currently visible
  private dimension: Dimension | "both" = "both"; // Which dimension(s) it exists in

  constructor(_scene: Phaser.Scene, group: Phaser.Physics.Arcade.StaticGroup) {
    this.group = group;
  }

  /**
   * Set where to place this platform using grid coordinates
   * Grid coordinates are much easier than pixel coordinates!
   * @param gridX How many tiles from the left edge (0 = leftmost)
   * @param gridY How many tiles from the top edge (0 = topmost)
   */
  atCoords(gridX: number, gridY: number): PlatformBuilder {
    // Convert grid coordinates to pixel coordinates
    this.x = gridX * TILE_SIZE + TILE_SIZE / 2;
    this.y = gridY * TILE_SIZE + TILE_SIZE / 2;
    return this;
  }

  /**
   * Set the platform's position using exact pixel coordinates
   * (Advanced: Most beginners should use atCoords() instead)
   * @param x Exact X coordinate in pixels
   * @param y Exact Y coordinate in pixels
   */
  atPixelCoords(x: number, y: number): PlatformBuilder {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Enable collision detection for this platform
   * This means the player can stand on it and won't fall through
   * (This is enabled by default - most platforms should have collision)
   */
  withCollider(): PlatformBuilder {
    this.hasCollider = true;
    return this;
  }

  /**
   * Make this platform solid (won't break when touched)
   * This is the default - solid platforms are safe and reliable
   */
  setSolid(): PlatformBuilder {
    this.isBreakable = false;
    return this;
  }

  /**
   * Make this platform breakable (will disappear after being stepped on)
   * Breakable platforms add challenge - use them sparingly!
   */
  setBreakable(): PlatformBuilder {
    this.isBreakable = true;
    return this;
  }

  /**
   * Set which dimension(s) this platform exists in
   * This is a key part of the puzzle mechanics!
   * @param dimension "light", "dark", or "both"
   */
  setDimension(
    dimension: Dimension | "light" | "dark" | "both"
  ): PlatformBuilder {
    // Convert string values to enum values for consistency
    if (dimension === "light") {
      this.dimension = Dimension.LIGHT;
    } else if (dimension === "dark") {
      this.dimension = Dimension.DARK;
    } else {
      this.dimension = dimension as Dimension | "both";
    }
    return this;
  }

  /**
   * Actually create the platform sprite with all the settings you've configured
   * This is the final step - call this after setting up all the properties you want
   * @returns The created platform sprite with physics enabled
   */

  /**
   * Disable collision detection for this platform
   * Use for decorative platforms
   */
  withoutCollider(): PlatformBuilder {
    this.hasCollider = false;
    return this;
  }
  /**
   * Make this platform move back and forth
   * @param speed Movement speed in pixels per second
   * @param distance How far the platform moves in each direction
   */
  setMoving(speed: number = 50, distance: number = 100): PlatformBuilder {
    this.isMoving = true;
    this.moveSpeed = speed;
    this.moveDistance = distance;
    return this;
  }

  /**
   * Make this platform stay in one place (default)
   */
  setStationary(): PlatformBuilder {
    this.isMoving = false;
    return this;
  }

  /**
   * Set the platform's texture/appearance
   * @param texture Texture key to use for the platform sprite
   */
  withTexture(texture: string): PlatformBuilder {
    this.texture = texture;
    return this;
  }

  /**
   * Set the platform's scale (size)
   * @param scale Scale multiplier (1 = normal size, 2 = double size, etc.)
   */
  withScale(scale: number): PlatformBuilder {
    this.scale = scale;
    return this;
  }

  /**
   * Make the platform invisible (but still solid if it has collision)
   */
  setInvisible(): PlatformBuilder {
    this.isVisible = false;
    return this;
  }

  /**
   * Make the platform visible (default)
   */
  setVisible(): PlatformBuilder {
    this.isVisible = true;
    return this;
  }

  /**
   * Create the platform sprite with all configured properties
   * @returns The created platform sprite
   */
  build(): Phaser.Physics.Arcade.Sprite {
    // Create the platform sprite in the static group
    const platform = this.group.create(
      this.x,
      this.y,
      this.texture
    ) as Phaser.Physics.Arcade.Sprite;

    // Configure visual properties
    platform.setScale(this.scale);
    platform.setVisible(this.isVisible);

    // Store custom properties for game logic
    (platform as any).isBreakable = this.isBreakable;
    (platform as any).hasCollider = this.hasCollider;
    (platform as any).dimension = this.dimension;

    // Handle moving platforms
    if (this.isMoving) {
      this.setupMovingPlatform(platform);
    }

    // Refresh the physics body after all modifications
    platform.refreshBody();

    return platform;
  }

  private setupMovingPlatform(platform: Phaser.Physics.Arcade.Sprite): void {
    // Store movement properties
    (platform as any).isMoving = true;
    (platform as any).moveSpeed = this.moveSpeed;
    (platform as any).moveDistance = this.moveDistance;
    (platform as any).startX = this.x;
    (platform as any).direction = 1; // 1 for right, -1 for left

    // Note: The actual movement logic would be handled in the scene's update method
    // This is just setting up the properties for the movement system
  }
}

/**
 * Helper function to create a new PlatformBuilder
 * This is the function you'll actually use in your game code!
 *
 * @param scene The Phaser scene where the platform will live
 * @param group The physics group that will contain this platform
 * @returns A new PlatformBuilder ready for configuration
 *
 * EXAMPLE USAGE:
 * const platform = createPlatform(this, platformsGroup)  // 'this' is your scene
 *   .atCoords(8, 12)
 *   .withCollider()
 *   .setSolid()
 *   .build();
 */
export function createPlatform(
  scene: Phaser.Scene,
  group: Phaser.Physics.Arcade.StaticGroup
): PlatformBuilder {
  return new PlatformBuilder(scene, group);
}

/**
 * QUANTUM JUMPER - POWERUP BUILDER
 *
 * This builder creates special powerup items that give the player temporary abilities
 * or permanent upgrades. Powerups add excitement and variety to the gameplay!
 *
 * WHAT ARE POWERUPS?
 * Powerups are special collectible items that enhance the player when touched. They can:
 * - Give extra lives (1-up powerups)
 * - Increase movement speed temporarily
 * - Grant super jump abilities
 * - Provide temporary invincibility
 * - Award bonus points
 * - Sometimes have negative effects (poison powerups)
 *
 * POWERUP TYPES:
 * - Mushroom: Classic powerup that makes player grow and gives points
 * - 1-up: Gives an extra life (very valuable!)
 * - Speed Boost: Temporary increased movement speed
 * - Star: Super jump boost for reaching high places
 * - Fire Flower: Temporary invincibility
 * - Poison: Dangerous powerup that hurts the player
 *
 * FLUENT API EXAMPLE:
 * createPowerup(scene, group)
 *   .atCoords(15, 10)        // Place at grid position (15, 10)
 *   .ofType("mushroom")      // Make it a mushroom powerup
 *   .animated()              // Make it bounce and glow
 *   .setDimension("light")   // Only visible in light dimension
 *   .build();                // Create it!
 */

import Phaser from "phaser";
import { TILE_SIZE, TileType, Dimension } from "../constants";
import { TextureGenerator } from "./TextureGenerator";
import type { CollectibleData } from "../types";

export class PowerupBuilder {
  private scene: Phaser.Scene; // The game scene that will contain this powerup
  private group: Phaser.Physics.Arcade.StaticGroup; // The physics group this powerup belongs to
  private x: number = 0; // X position in pixels
  private y: number = 0; // Y position in pixels
  private textureKey: string = "base-powerup"; // Which graphic to use for the powerup
  private tileType: TileType = TileType.POWERUP; // What type of powerup this is (for level maps)
  private scale: number = 1; // How big the powerup appears
  private isAnimated: boolean = true; // Whether the powerup bounces and glows
  private mapRow: number = 0; // Row in level map (for level building)
  private mapCol: number = 0; // Column in level map (for level building)
  private effect: string = "none"; // What effect this powerup has on the player
  private dimension: Dimension | "both" = "both"; // Which dimension(s) this powerup exists in

  constructor(scene: Phaser.Scene, group: Phaser.Physics.Arcade.StaticGroup) {
    this.scene = scene;
    this.group = group;
  }

  /**
   * Set the powerup's position using grid coordinates (recommended)
   * @param gridX X coordinate in grid units (each unit = 32 pixels)
   * @param gridY Y coordinate in grid units (each unit = 32 pixels)
   */
  atCoords(gridX: number, gridY: number): PowerupBuilder {
    this.x = gridX * TILE_SIZE + TILE_SIZE / 2;
    this.y = gridY * TILE_SIZE + TILE_SIZE / 2;
    this.mapRow = gridY;
    this.mapCol = gridX;
    return this;
  }

  /**
   * Set the powerup's position using exact pixel coordinates
   * @param x X coordinate in pixels
   * @param y Y coordinate in pixels
   */
  atPixelCoords(x: number, y: number): PowerupBuilder {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Set the powerup to use tile-based coordinates (legacy method)
   * @param tileX Tile X coordinate (multiplied by TILE_SIZE)
   * @param tileY Tile Y coordinate (multiplied by TILE_SIZE)
   * @deprecated Use atCoords() instead for consistency
   */
  atTileCoords(tileX: number, tileY: number): PowerupBuilder {
    this.x = tileX * TILE_SIZE + TILE_SIZE / 2;
    this.y = tileY * TILE_SIZE + TILE_SIZE / 2;
    this.mapRow = tileY;
    this.mapCol = tileX;
    return this;
  }

  /**
   * Set which dimension this powerup exists in
   * @param dimension "light", "dark", or "both" (default)
   */
  setDimension(dimension: Dimension | "both"): PowerupBuilder {
    this.dimension = dimension;
    return this;
  }

  /**
   * Set the powerup type by name
   * @param type Powerup type ('mushroom', '1up', 'poison', 'fire-flower', 'star', 'speed-boost')
   */
  ofType(type: string): PowerupBuilder {
    this.textureKey = type;

    // Auto-set tile type based on powerup type
    switch (type) {
      case "mushroom":
        this.tileType = TileType.MUSHROOM;
        this.effect = "grow";
        break;
      case "1up":
        this.tileType = TileType.ONE_UP;
        this.effect = "extra-life";
        break;
      case "poison":
        this.tileType = TileType.POISON;
        this.effect = "damage";
        break;
      case "fire-flower":
        this.tileType = TileType.FIRE_FLOWER;
        this.effect = "fire-power";
        break;
      case "star":
        this.tileType = TileType.STAR;
        this.effect = "invincibility";
        break;
      case "speed-boost":
        this.tileType = TileType.SPEED_BOOST;
        this.effect = "speed";
        break;
      default:
        this.tileType = TileType.POWERUP;
        this.effect = "none";
        break;
    }

    return this;
  }

  /**
   * Set the powerup type directly using TileType enum
   * @param type TileType enum value for the powerup
   */
  withTileType(type: TileType): PowerupBuilder {
    this.tileType = type;
    this.textureKey = TextureGenerator.getTextureKey(type);

    // Set effect based on tile type
    switch (type) {
      case TileType.MUSHROOM:
        this.effect = "grow";
        break;
      case TileType.ONE_UP:
        this.effect = "extra-life";
        break;
      case TileType.POISON:
        this.effect = "damage";
        break;
      case TileType.FIRE_FLOWER:
        this.effect = "fire-power";
        break;
      case TileType.STAR:
        this.effect = "invincibility";
        break;
      case TileType.SPEED_BOOST:
        this.effect = "speed";
        break;
      default:
        this.effect = "none";
        break;
    }

    return this;
  }

  /**
   * Set a custom effect for this powerup
   * @param effect Effect name/identifier
   */
  withEffect(effect: string): PowerupBuilder {
    this.effect = effect;
    return this;
  }

  /**
   * Set the powerup's texture/appearance directly
   * @param texture Texture key to use
   */
  withTexture(texture: string): PowerupBuilder {
    this.textureKey = texture;
    return this;
  }

  /**
   * Set the powerup's scale (size)
   * @param scale Scale multiplier (1 = normal size, 2 = double size, etc.)
   */
  withScale(scale: number): PowerupBuilder {
    this.scale = scale;
    return this;
  }

  /**
   * Enable floating/pulsing animation for the powerup
   */
  animated(): PowerupBuilder {
    this.isAnimated = true;
    return this;
  }

  /**
   * Disable animation for the powerup (static)
   */
  static(): PowerupBuilder {
    this.isAnimated = false;
    return this;
  }

  /**
   * Set the map position for anti-farming system
   * @param row Map row
   * @param col Map column
   */
  atMapPosition(row: number, col: number): PowerupBuilder {
    this.mapRow = row;
    this.mapCol = col;
    return this;
  }

  /**
   * Create the powerup sprite with all configured properties
   * @returns The created powerup sprite with CollectibleData properties
   */
  build(): Phaser.Physics.Arcade.Sprite & CollectibleData {
    // Create the powerup sprite in the powerups group
    const powerup = this.group.create(
      this.x,
      this.y,
      this.textureKey
    ) as Phaser.Physics.Arcade.Sprite & CollectibleData;

    // Configure visual properties
    powerup.setScale(this.scale);

    // Set collectible data properties
    powerup.mapRow = this.mapRow;
    powerup.mapCol = this.mapCol;
    powerup.tileType = this.tileType;
    (powerup as any).effect = this.effect;
    (powerup as any).dimension = this.dimension;

    // Add animation if enabled
    if (this.isAnimated) {
      this.setupPowerupAnimation(powerup);
    }

    return powerup;
  }

  private setupPowerupAnimation(powerup: Phaser.Physics.Arcade.Sprite): void {
    // Create a subtle floating animation
    this.scene.tweens.add({
      targets: powerup,
      y: powerup.y - 3,
      duration: 800,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    // Add a pulsing scale effect for special powerups
    if (this.effect === "invincibility" || this.effect === "fire-power") {
      this.scene.tweens.add({
        targets: powerup,
        scaleX: this.scale * 1.1,
        scaleY: this.scale * 1.1,
        duration: 600,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }
}

/**
 * Helper function to create a new PowerupBuilder
 * @param scene The Phaser scene to create the powerup in
 * @param group The static group to add the powerup to
 * @returns A new PowerupBuilder instance
 */
export function createPowerup(
  scene: Phaser.Scene,
  group: Phaser.Physics.Arcade.StaticGroup
): PowerupBuilder {
  return new PowerupBuilder(scene, group);
}

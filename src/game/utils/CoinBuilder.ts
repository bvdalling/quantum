/**
 * QUANTUM JUMPER - COIN BUILDER
 *
 * This builder creates collectible coins that give the player points when collected.
 * Coins are the main scoring mechanism in our platformer game!
 *
 * WHAT ARE COINS?
 * Coins are collectible items that the player can gather by touching them.
 * When collected, they:
 * - Give the player points (different coin types give different amounts)
 * - Disappear from the level
 * - Play a satisfying collection sound effect
 * - Create a small particle burst effect
 * - Can exist in specific dimensions (light, dark, or both)
 *
 * COIN TYPES AND VALUES:
 * - Bronze coins: 1 point (easy to get, common)
 * - Silver coins: 5 points (medium difficulty)
 * - Gold coins: 10 points (harder to reach)
 * - Ruby coins: 25 points (hidden/secret coins)
 *
 * FLUENT API EXAMPLE:
 * createCoin(scene, group)
 *   .atCoords(10, 8)           // Place at grid position (10, 8)
 *   .withTexture("gold-coin")  // Use gold coin graphics
 *   .animated()                // Make it spin and sparkle
 *   .setDimension("dark")      // Only visible in dark dimension
 *   .build();                  // Create it!
 */

import Phaser from "phaser";
import { TILE_SIZE, TileType, COIN_VALUES, Dimension } from "../constants";
import { TextureGenerator } from "./TextureGenerator";
import type { CollectibleData } from "../types";

export class CoinBuilder {
  private scene: Phaser.Scene; // The game scene that will contain this coin
  private group: Phaser.Physics.Arcade.StaticGroup; // The physics group this coin belongs to
  private x: number = 0; // X position in pixels
  private y: number = 0; // Y position in pixels
  private coinValue: number = 1; // How many points this coin is worth
  private textureKey: string = "base-coin"; // Which graphic to use for the coin
  private tileType: TileType = TileType.COIN; // What type of coin this is (for level maps)
  private scale: number = 1; // How big the coin appears
  private isAnimated: boolean = true; // Whether the coin spins and sparkles
  private mapRow: number = 0; // Row in level map (for level building)
  private mapCol: number = 0; // Column in level map (for level building)
  private dimension: Dimension | "both" = "both"; // Which dimension(s) this coin exists in

  constructor(scene: Phaser.Scene, group: Phaser.Physics.Arcade.StaticGroup) {
    this.scene = scene;
    this.group = group;
  }

  /**
   * Set the coin's position using grid coordinates (recommended)
   * @param gridX X coordinate in grid units (each unit = 32 pixels)
   * @param gridY Y coordinate in grid units (each unit = 32 pixels)
   */
  atCoords(gridX: number, gridY: number): CoinBuilder {
    this.x = gridX * TILE_SIZE + TILE_SIZE / 2;
    this.y = gridY * TILE_SIZE + TILE_SIZE / 2;
    this.mapRow = gridY;
    this.mapCol = gridX;
    return this;
  }

  /**
   * Set the coin's position using exact pixel coordinates
   * @param x X coordinate in pixels
   * @param y Y coordinate in pixels
   */
  atPixelCoords(x: number, y: number): CoinBuilder {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Set the coin to use tile-based coordinates (legacy method)
   * @param tileX Tile X coordinate (multiplied by TILE_SIZE)
   * @param tileY Tile Y coordinate (multiplied by TILE_SIZE)
   * @deprecated Use atCoords() instead for consistency
   */
  atTileCoords(tileX: number, tileY: number): CoinBuilder {
    this.x = tileX * TILE_SIZE + TILE_SIZE / 2;
    this.y = tileY * TILE_SIZE + TILE_SIZE / 2;
    this.mapRow = tileY;
    this.mapCol = tileX;
    return this;
  }

  /**
   * Set which dimension this coin exists in
   * @param dimension "light", "dark", or "both" (default)
   */
  setDimension(dimension: Dimension | "both"): CoinBuilder {
    this.dimension = dimension;
    return this;
  }

  /**
   * Set the coin's point value when collected
   * @param value Points awarded when collected
   */
  value(value: number): CoinBuilder {
    this.coinValue = value;
    return this;
  }

  /**
   * Set the coin's texture/appearance
   * @param texture Texture key to use (e.g., 'base-coin', 'bronze-coin', 'silver-coin', 'gold-coin', 'ruby-coin')
   */
  withTexture(texture: string): CoinBuilder {
    this.textureKey = texture;

    // Auto-set tile type and value based on texture
    switch (texture) {
      case "bronze-coin":
        this.tileType = TileType.BRONZE_COIN;
        this.coinValue = COIN_VALUES[TileType.BRONZE_COIN];
        break;
      case "silver-coin":
        this.tileType = TileType.SILVER_COIN;
        this.coinValue = COIN_VALUES[TileType.SILVER_COIN];
        break;
      case "gold-coin":
        this.tileType = TileType.GOLD_COIN;
        this.coinValue = COIN_VALUES[TileType.GOLD_COIN];
        break;
      case "ruby-coin":
        this.tileType = TileType.RUBY_COIN;
        this.coinValue = COIN_VALUES[TileType.RUBY_COIN];
        break;
      default:
        this.tileType = TileType.COIN;
        this.coinValue = COIN_VALUES[TileType.COIN];
        break;
    }

    return this;
  }

  /**
   * Set the coin type directly
   * @param type TileType enum value for the coin
   */
  ofType(type: TileType): CoinBuilder {
    this.tileType = type;
    this.textureKey = TextureGenerator.getTextureKey(type);
    this.coinValue = COIN_VALUES[type] || 1;
    return this;
  }

  /**
   * Set the coin's scale (size)
   * @param scale Scale multiplier (1 = normal size, 2 = double size, etc.)
   */
  withScale(scale: number): CoinBuilder {
    this.scale = scale;
    return this;
  }

  /**
   * Enable floating/bobbing animation for the coin
   */
  animated(): CoinBuilder {
    this.isAnimated = true;
    return this;
  }

  /**
   * Disable animation for the coin (static)
   */
  static(): CoinBuilder {
    this.isAnimated = false;
    return this;
  }

  /**
   * Set the map position for anti-farming system
   * @param row Map row
   * @param col Map column
   */
  atMapPosition(row: number, col: number): CoinBuilder {
    this.mapRow = row;
    this.mapCol = col;
    return this;
  }

  /**
   * Create the coin sprite with all configured properties
   * @returns The created coin sprite with CollectibleData properties
   */
  build(): Phaser.Physics.Arcade.Sprite & CollectibleData {
    // Create the coin sprite in the collectibles group
    const coin = this.group.create(
      this.x,
      this.y,
      this.textureKey
    ) as Phaser.Physics.Arcade.Sprite & CollectibleData;

    // Configure visual properties
    coin.setScale(this.scale);

    // Set collectible data properties
    coin.mapRow = this.mapRow;
    coin.mapCol = this.mapCol;
    coin.tileType = this.tileType;
    (coin as any).value = this.coinValue;
    (coin as any).dimension = this.dimension;

    // Add floating animation if enabled
    if (this.isAnimated) {
      this.setupFloatingAnimation(coin);
    }

    return coin;
  }

  private setupFloatingAnimation(coin: Phaser.Physics.Arcade.Sprite): void {
    // Create a subtle floating/bobbing animation
    this.scene.tweens.add({
      targets: coin,
      y: coin.y - 5,
      duration: 1000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    // Add a slight rotation
    this.scene.tweens.add({
      targets: coin,
      angle: 360,
      duration: 3000,
      repeat: -1,
    });
  }
}

/**
 * Helper function to create a new CoinBuilder
 * @param scene The Phaser scene to create the coin in
 * @param group The static group to add the coin to
 * @returns A new CoinBuilder instance
 */
export function createCoin(
  scene: Phaser.Scene,
  group: Phaser.Physics.Arcade.StaticGroup
): CoinBuilder {
  return new CoinBuilder(scene, group);
}

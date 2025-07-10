/**
 * GAME SCENE BUILDER - THE HEART OF THE FLUENT API
 *
 * This is the most important file for beginners! This class provides all the
 * easy-to-use methods that let you create game objects with simple, readable code.
 *
 * WHAT IS THIS FILE?
 * Think of this as your "magic toolbox" that contains all the tools you need
 * to build a level. Instead of complex game engine code, you get simple methods like:
 * - addPlayer() - adds a player character
 * - addPlatform() - adds a platform to jump on
 * - addCoin() - adds a coin to collect
 * - addPowerup() - adds a powerup with special abilities
 * - addPortal() - adds a portal to travel between levels
 *
 * WHAT IS A "FLUENT API"?
 * It means you can chain methods together with dots, like this:
 *
 * gameBuilder.addPlayer().atPosition(5, 10).withLives(3).build()
 *
 * This reads like English: "Add a player at position 5,10 with 3 lives"
 *
 * GRID SYSTEM:
 * Everything uses a grid system where each square is 32x32 pixels.
 * Position (0,0) is the top-left corner.
 * Position (1,0) is one square to the right.
 * Position (0,1) is one square down.
 *
 * DIMENSIONS EXPLAINED:
 * The game has two dimensions - LIGHT and DARK.
 * Players can press X to switch between them.
 * Objects can exist in:
 * - LIGHT dimension only
 * - DARK dimension only
 * - BOTH dimensions
 *
 * This creates puzzles where players must switch dimensions to progress!
 *
 * HOW TO USE THIS:
 * You don't create this class directly. Instead, use:
 *
 * const game = createGameScene(this);  // 'this' is your scene
 *
 * Then use it like:
 * game.addPlayer().atPosition(5, 10).build();
 * game.addPlatform().atCoords(8, 12).withCollider().build();
 *
 * FOR ABSOLUTE BEGINNERS:
 * Don't worry about understanding all the code in this file!
 * Focus on learning how to USE the methods it provides.
 * The methods you'll use most are:
 * - addPlayer(), addPlatform(), addCoin(), addPowerup(), addPortal()
 * - setScore(), setLives(), setLevel()
 * - switchDimension()
 * - showMessage()
 */

// These are "imports" - we bring in code from other files to use here
// Think of imports like ingredients in a recipe
import Phaser from "phaser"; // The main game engine
import {
  createPlayer, // Function to create player characters
  createPlatform, // Function to create platforms
  createCoin, // Function to create coins
  createPowerup, // Function to create powerups
} from "./ObjectBuilders";
import { createPortal } from "./PortalBuilder"; // Function to create portals
import type {
  PlayerBuilder, // TypeScript type for player creation
  PlatformBuilder, // TypeScript type for platform creation
  CoinBuilder, // TypeScript type for coin creation
  PowerupBuilder, // TypeScript type for powerup creation
} from "./ObjectBuilders";
import type { PortalBuilder } from "./PortalBuilder"; // TypeScript type for portal creation
import { Dimension, TILE_SIZE } from "../constants"; // Game constants

// This is our main class that provides the fluent API
export class GameSceneBuilder {
  // These are "properties" - variables that belong to this class
  // Think of them like pockets where we store important information

  private scene: Phaser.Scene; // The game scene we're building in

  // Groups are like containers that hold multiple game objects of the same type
  private platforms!: Phaser.Physics.Arcade.StaticGroup; // Container for all platforms
  private collectibles!: Phaser.Physics.Arcade.StaticGroup; // Container for all coins
  private powerups!: Phaser.Physics.Arcade.StaticGroup; // Container for all powerups
  private portals!: Phaser.Physics.Arcade.StaticGroup; // Container for all portals

  // Array to store portal particle effects
  private portalParticles: Array<{
    portal: Phaser.GameObjects.Sprite; // The portal sprite
    particles?: Phaser.GameObjects.Particles.ParticleEmitter; // Optional swirling particles
  }> = [];

  private player!: Phaser.Physics.Arcade.Sprite; // The main player character
  private currentDimension: Dimension = Dimension.LIGHT; // Which dimension we're currently in (starts in LIGHT)
  private background!: Phaser.GameObjects.Rectangle; // Background color rectangle
  private dimensionText!: Phaser.GameObjects.Text; // Text showing current dimension

  // === USER INTERFACE (UI) ELEMENTS ===
  // These display information to the player at the top of the screen
  private scoreText!: Phaser.GameObjects.Text; // Shows current score
  private livesText!: Phaser.GameObjects.Text; // Shows remaining lives
  private levelText!: Phaser.GameObjects.Text; // Shows current level number

  // === GRID SYSTEM PROPERTIES ===
  // These control the size of our game world using a grid system
  private worldWidthInTiles: number = 15; // How many tiles wide (default: 15 tiles = 480 pixels)
  private worldHeightInTiles: number = 15; // How many tiles tall (default: 15 tiles = 480 pixels)
  private tileSize: number = TILE_SIZE; // Size of each tile in pixels (32x32)

  // Constructor runs when a new GameSceneBuilder is created
  // It sets up the basic structure but doesn't create any game objects yet
  constructor(scene: Phaser.Scene) {
    this.scene = scene; // Store the scene so we can use it later
    this.setupGroups();
    this.createBackground();
    this.createDimensionUI();
  }

  private setupGroups(): void {
    // Create physics groups for different object types
    this.platforms = this.scene.physics.add.staticGroup();
    this.collectibles = this.scene.physics.add.staticGroup();
    this.powerups = this.scene.physics.add.staticGroup();
    this.portals = this.scene.physics.add.staticGroup();
  }

  /**
   * Create a new player using the fluent builder API
   * @returns PlayerBuilder for method chaining
   */
  addPlayer(): PlayerBuilder {
    return createPlayer(this.scene);
  }

  /**
   * Create a new platform using the fluent builder API
   * @returns PlatformBuilder for method chaining
   */
  addPlatform(): PlatformBuilder {
    return createPlatform(this.scene, this.platforms);
  }

  /**
   * Create a new coin using the fluent builder API
   * @returns CoinBuilder for method chaining
   */
  addCoin(): CoinBuilder {
    return createCoin(this.scene, this.collectibles);
  }

  /**
   * Create a new powerup using the fluent builder API
   * @returns PowerupBuilder for method chaining
   */
  addPowerup(): PowerupBuilder {
    return createPowerup(this.scene, this.powerups);
  }

  /**
   * Create a new portal using the fluent builder API
   * @returns PortalBuilder for method chaining
   */
  addPortal(): PortalBuilder {
    return createPortal(this.scene);
  }

  /**
   * Add a portal to the internal tracking system
   * @param portalData Portal and particle data from PortalBuilder.build()
   */
  registerPortal(portalData: {
    portal: Phaser.GameObjects.Sprite;
    particles?: Phaser.GameObjects.Particles.ParticleEmitter;
  }): void {
    console.log("🌀 DEBUG: Registering portal for collision detection");
    console.log(
      "   Portal position:",
      portalData.portal.x,
      portalData.portal.y
    );
    console.log("   Portal active:", (portalData.portal as any).isActive);
    console.log(
      "   Portal has callback:",
      !!(portalData.portal as any).onActivate
    );
    console.log("   Total portals registered:", this.portals.children.size + 1);

    // Add portal to the physics group for automatic collision detection
    this.portals.add(portalData.portal);

    // Store particle effect separately if it exists
    if (portalData.particles) {
      this.portalParticles.push(portalData);
    }

    console.log("✅ DEBUG: Portal added to physics group successfully");
  }

  /**
   * Set the world size in tiles (grid-based approach)
   * @param widthInTiles Width of the game world in tiles
   * @param heightInTiles Height of the game world in tiles
   */
  setWorldSize(widthInTiles: number, heightInTiles: number): GameSceneBuilder {
    this.worldWidthInTiles = widthInTiles;
    this.worldHeightInTiles = heightInTiles;
    this.setWorldBounds(
      widthInTiles * this.tileSize,
      heightInTiles * this.tileSize
    );
    return this;
  }

  /**
   * Get the world width in tiles
   */
  getWorldWidthInTiles(): number {
    return this.worldWidthInTiles;
  }

  /**
   * Get the world height in tiles
   */
  getWorldHeightInTiles(): number {
    return this.worldHeightInTiles;
  }

  /**
   * Convert tile coordinates to pixel coordinates
   * @param tileX X coordinate in tiles
   * @param tileY Y coordinate in tiles
   * @returns Object with x and y pixel coordinates
   */
  tileToPixel(tileX: number, tileY: number): { x: number; y: number } {
    return {
      x: tileX * this.tileSize + this.tileSize / 2,
      y: tileY * this.tileSize + this.tileSize / 2,
    };
  }

  /**
   * Set up the physics world bounds
   * @param width World width in pixels
   * @param height World height in pixels
   */
  setWorldBounds(width: number, height: number): void {
    this.scene.physics.world.setBounds(0, 0, width, height);
    this.scene.cameras.main.setBounds(0, 0, width, height);
  }
  /**
   * Set the main player (needed for camera following and physics)
   * @param player The player sprite to use as the main player
   */
  setMainPlayer(player: Phaser.Physics.Arcade.Sprite): void {
    this.player = player;
    this.setupPlayerCollisions();
    this.setupCamera();
    this.setupDeathDetection();

    // Initial dimension setup to ensure objects start with correct visibility
    this.updateDimensionVisuals();
    this.updateDimensionUI();

    // Initialize game state UI
    this.updateGameStateUI();
  }

  /**
   * Set up physics collisions between objects
   */
  private setupPlayerCollisions(): void {
    if (!this.player) {
      console.warn("Cannot setup collisions: no main player set");
      return;
    }

    // Player collides with platforms
    this.scene.physics.add.collider(this.player, this.platforms);

    // Player overlaps with collectibles (coins) - check dimension
    this.scene.physics.add.overlap(
      this.player,
      this.collectibles,
      (player, coin) => {
        if (
          this.isObjectVisibleInCurrentDimension(
            coin as Phaser.Physics.Arcade.Sprite
          )
        ) {
          this.handleCoinCollection(player, coin);
        }
      },
      undefined,
      this
    );

    // Player overlaps with powerups - check dimension
    this.scene.physics.add.overlap(
      this.player,
      this.powerups,
      (player, powerup) => {
        if (
          this.isObjectVisibleInCurrentDimension(
            powerup as Phaser.Physics.Arcade.Sprite
          )
        ) {
          this.handlePowerupCollection(player, powerup);
        }
      },
      undefined,
      this
    );

    // Player overlaps with portals - check dimension
    this.scene.physics.add.overlap(
      this.player,
      this.portals,
      (player, portal) => {
        console.log(
          "🌀 DEBUG: Portal overlap detected in setupPlayerCollisions!"
        );
        if (
          this.isObjectVisibleInCurrentDimension(
            portal as Phaser.Physics.Arcade.Sprite
          )
        ) {
          this.handlePortalCollision(player, portal);
        } else {
          console.log("❌ DEBUG: Portal not visible in current dimension");
        }
      },
      undefined,
      this
    );

    console.log("✅ DEBUG: All collision detection set up, including portals");
  }

  /**
   * Set up camera to follow the main player
   */
  private setupCamera(): void {
    if (!this.player) {
      console.warn("Cannot setup camera: no main player set");
      return;
    }

    this.scene.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  /**
   * Set up death detection for the player
   */
  private setupDeathDetection(): void {
    if (!this.player) {
      console.warn("Cannot setup death detection: no main player set");
      return;
    }

    // Check for falling out of world in scene's update method
    // This will be called by the scene that uses this builder
  }

  /**
   * Check if player has fallen out of the world (call this in scene's update)
   * @param deathY Y coordinate below which player dies (default: world height + 100)
   * @returns true if player should die
   */
  checkPlayerDeath(deathY?: number): boolean {
    if (!this.player) return false;

    const worldHeight = this.scene.physics.world.bounds.height;
    const fallDeathY = deathY || worldHeight + 100;

    return this.player.y > fallDeathY;
  }

  /**
   * Respawn the player at a safe position
   * @param x Respawn X coordinate
   * @param y Respawn Y coordinate
   */
  /**
   * Respawn the player at grid coordinates
   * @param gridX X coordinate in grid units
   * @param gridY Y coordinate in grid units
   */
  respawnPlayer(gridX: number, gridY: number): void {
    if (!this.player) return;

    const pixelCoords = this.tileToPixel(gridX, gridY);
    this.player.setPosition(pixelCoords.x, pixelCoords.y);
    this.player.setVelocity(0, 0);

    // Reduce lives using fluent API
    this.addLives(-1);

    console.log(`Player died! Lives remaining: ${this.getLives()}`);
  }

  /**
   * Respawn the player at exact pixel coordinates
   * @param x X coordinate in pixels
   * @param y Y coordinate in pixels
   */
  respawnPlayerAtPixels(x: number, y: number): void {
    if (!this.player) return;

    this.player.setPosition(x, y);
    this.player.setVelocity(0, 0);

    // Reduce lives
    const currentLives = (this.player as any).lives || 3;
    (this.player as any).lives = currentLives - 1;

    console.log(`Player died! Lives remaining: ${(this.player as any).lives}`);
  }

  /**
   * Handle player death - can be overridden by subclasses
   */
  protected handlePlayerDeath(): void {
    console.log("Player has died. Implement respawn or game over logic.");
    // Example: Restart the scene
    this.scene.scene.restart();
  }

  /**
   * Handle coin collection - can be overridden by subclasses
   */
  protected handleCoinCollection(
    _player:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    coin: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const coinSprite = coin as Phaser.Physics.Arcade.Sprite;

    // Create collection particle effect
    this.createCollectionParticles(coinSprite.x, coinSprite.y, 0xffd700); // Gold color

    // Play collection sound
    this.playCollectionSound("coin");

    // Remove the coin
    coinSprite.destroy();

    // Add score using fluent API
    const coinValue = (coinSprite as any).value || 1;
    const coinDimension = (coinSprite as any).dimension || "both";

    // Bonus points for collecting dimension-specific coins
    if (coinDimension === this.currentDimension) {
      const bonus = Math.floor(coinValue * 0.5); // 50% bonus
      this.addScore(coinValue + bonus);
      if (bonus > 0) {
        this.showMessage(`Dimension Bonus! +${bonus}`, 1000, "#ffff00");
      }
    } else {
      this.addScore(coinValue);
    }

    console.log(
      `Collected coin worth ${coinValue} points! Total score: ${this.getScore()}`
    );
  }

  /**
   * Handle powerup collection - can be overridden by subclasses
   */
  protected handlePowerupCollection(
    player:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    powerup:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile
  ): void {
    const powerupSprite = powerup as Phaser.Physics.Arcade.Sprite;

    // Create collection particle effect (different color for powerups)
    this.createCollectionParticles(powerupSprite.x, powerupSprite.y, 0x00ff00); // Green color

    // Play powerup collection sound
    this.playCollectionSound("powerup");

    // Remove the powerup
    powerupSprite.destroy();

    // Apply effect (basic implementation)
    const effect = (powerupSprite as any).effect || "none";
    console.log(`Collected powerup with effect: ${effect}`);

    switch (effect) {
      case "extra-life":
      case "1up":
        this.addLives(1);
        console.log(`Extra life! Total lives: ${this.getLives()}`);
        break;
      case "speed":
        (player as any).moveSpeed = ((player as any).moveSpeed || 160) * 1.5;
        console.log("Speed boost activated!");
        break;
      case "invincibility":
        (player as any).invincible = true;
        console.log("Invincibility activated!");
        // Auto-remove after 10 seconds
        this.scene.time.delayedCall(10000, () => {
          (player as any).invincible = false;
          console.log("Invincibility ended.");
        });
        break;
      // Add more effects as needed
    }
  }

  /**
   * Switch between light and dark dimensions
   */
  switchDimension(): void {
    const oldDimension = this.currentDimension;
    this.currentDimension =
      oldDimension === Dimension.LIGHT ? Dimension.DARK : Dimension.LIGHT;

    this.updateDimensionVisuals();
    this.updateDimensionUI();

    // Play dimension switch sound
    try {
      // Simple audio feedback
      console.log(`Switched to ${this.currentDimension} dimension`);
    } catch (error) {
      console.warn("Could not play dimension sound:", error);
    }
  }

  /**
   * Get the current dimension
   */
  getCurrentDimension(): Dimension {
    return this.currentDimension;
  }

  /**
   * Check if currently in light dimension
   */
  isInLightDimension(): boolean {
    return this.currentDimension === Dimension.LIGHT;
  }

  /**
   * Check if currently in dark dimension
   */
  isInDarkDimension(): boolean {
    return this.currentDimension === Dimension.DARK;
  }

  /**
   * Set the current dimension directly
   * @param dimension The dimension to switch to
   */
  setDimension(dimension: Dimension): void {
    this.currentDimension = dimension;
    this.updateDimensionVisuals();
    this.updateDimensionUI();
  }

  /**
   * Get the platforms group for custom collision setup
   */
  getPlatforms(): Phaser.Physics.Arcade.StaticGroup {
    return this.platforms;
  }

  /**
   * Get the collectibles group for custom collision setup
   */
  getCollectibles(): Phaser.Physics.Arcade.StaticGroup {
    return this.collectibles;
  }

  /**
   * Get the powerups group for custom collision setup
   */
  getPowerups(): Phaser.Physics.Arcade.StaticGroup {
    return this.powerups;
  }

  /**
   * Get the portals group for custom collision setup
   */
  getPortals(): Phaser.Physics.Arcade.StaticGroup {
    return this.portals;
  }

  /**
   * Get the main player
   */
  getMainPlayer(): Phaser.Physics.Arcade.Sprite {
    return this.player;
  }

  /**
   * Create the background rectangle for dimension effects
   */
  private createBackground(): void {
    const { width, height } = this.scene.scale;

    // Background rectangle for dimension color changes
    this.background = this.scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x5c94fc // Mario-style blue sky color
    );
    this.background.setOrigin(0.5, 0.5);
    this.background.setScrollFactor(0); // Keep background fixed to camera
  }

  /**
   * Create the UI elements for dimension indication and game state
   */
  private createDimensionUI(): void {
    const { width } = this.scene.scale;

    // Mario-style Game State UI - Fixed to camera, top-left corner
    this.scoreText = this.scene.add.text(16, 16, "SCORE\n000000", {
      fontSize: "16px",
      color: "#ffffff",
      fontFamily: "monospace",
      align: "left",
      lineSpacing: -4,
    });
    this.scoreText.setOrigin(0, 0);
    this.scoreText.setScrollFactor(0); // Keep fixed to camera

    this.livesText = this.scene.add.text(16, 64, "LIVES\n  3", {
      fontSize: "16px",
      color: "#ffffff",
      fontFamily: "monospace",
      align: "left",
      lineSpacing: -4,
    });
    this.livesText.setOrigin(0, 0);
    this.livesText.setScrollFactor(0); // Keep fixed to camera

    this.levelText = this.scene.add.text(16, 112, "LEVEL\n  1", {
      fontSize: "16px",
      color: "#ffffff",
      fontFamily: "monospace",
      align: "left",
      lineSpacing: -4,
    });
    this.levelText.setOrigin(0, 0);
    this.levelText.setScrollFactor(0); // Keep fixed to camera

    // Dimension indicator - Mario style
    this.dimensionText = this.scene.add.text(width - 16, 16, "LIGHT", {
      fontSize: "16px",
      color: "#ffff00",
      fontFamily: "monospace",
      align: "right",
    });
    this.dimensionText.setOrigin(1, 0);
    this.dimensionText.setScrollFactor(0); // Keep fixed to camera

    // Controls hint (Mario style, bottom of screen)
    const controlsText = this.scene.add.text(
      width / 2,
      this.scene.scale.height - 32,
      "ARROW KEYS: MOVE  •  SPACE: JUMP  •  X: SWITCH DIMENSION",
      {
        fontSize: "12px",
        color: "#cccccc",
        fontFamily: "monospace",
        align: "center",
      }
    );
    controlsText.setOrigin(0.5, 0);
    controlsText.setScrollFactor(0); // Keep fixed to camera
  }

  /**
   * Update the game state UI display - Mario style with leading zeros
   */
  private updateGameStateUI(): void {
    if (!this.player) return;

    const score = (this.player as any).score || 0;
    const lives = (this.player as any).lives || 3;
    const level = (this.player as any).level || 1;

    if (this.scoreText) {
      // Mario-style score with leading zeros (6 digits)
      const formattedScore = score.toString().padStart(6, "0");
      this.scoreText.setText(`SCORE\n${formattedScore}`);
    }

    if (this.livesText) {
      // Mario-style lives with space padding
      const formattedLives = lives.toString().padStart(2, " ");
      this.livesText.setText(`LIVES\n${formattedLives}`);

      // Change color based on lives remaining (Mario style)
      if (lives <= 1) {
        this.livesText.setColor("#ff4444"); // Red for critical
      } else if (lives <= 2) {
        this.livesText.setColor("#ffaa00"); // Orange for warning
      } else {
        this.livesText.setColor("#ffffff"); // White for safe
      }
    }

    if (this.levelText) {
      // Mario-style level with space padding
      const formattedLevel = level.toString().padStart(2, " ");
      this.levelText.setText(`LEVEL\n${formattedLevel}`);
    }
  }

  /**
   * Update the visuals for the current dimension
   */
  private updateDimensionVisuals(): void {
    const isLight = this.currentDimension === Dimension.LIGHT;

    // Update background color - Mario style
    // Light dimension: Blue sky, Dark dimension: Purple/black night
    this.background.setFillStyle(isLight ? 0x5c94fc : 0x1a0d26);

    // Update player tinting for dimension contrast
    this.player.setTint(isLight ? 0xffffff : 0xcccccc);

    // Update visibility of dimension-specific objects
    this.updateObjectDimensionVisibility(this.platforms);
    this.updateObjectDimensionVisibility(this.collectibles);
    this.updateObjectDimensionVisibility(this.powerups);
    this.updateObjectDimensionVisibility(this.portals);
  }

  /**
   * Update visibility and physics for objects based on current dimension
   */
  private updateObjectDimensionVisibility(
    group: Phaser.Physics.Arcade.StaticGroup
  ): void {
    const isLight = this.currentDimension === Dimension.LIGHT;

    group.children.entries.forEach((object) => {
      const sprite = object as Phaser.Physics.Arcade.Sprite;
      const objectDimension = (sprite as any).dimension || "both";

      const shouldBeVisible =
        objectDimension === "both" ||
        (objectDimension === "light" && isLight) ||
        (objectDimension === "dark" && !isLight) ||
        (objectDimension === Dimension.LIGHT && isLight) ||
        (objectDimension === Dimension.DARK && !isLight);

      sprite.setVisible(shouldBeVisible);
      if (sprite.body) {
        const body = sprite.body as
          | Phaser.Physics.Arcade.Body
          | Phaser.Physics.Arcade.StaticBody;
        // For static bodies, use the enable property
        if ("enable" in body) {
          body.enable = shouldBeVisible;
        } else if ("setEnable" in body) {
          // For dynamic bodies, use the setEnable method
          (body as Phaser.Physics.Arcade.Body).setEnable(shouldBeVisible);
        }
      }
    });
  }

  /**
   * Update the dimension UI text - Mario style
   */
  private updateDimensionUI(): void {
    const dimensionName =
      this.currentDimension === Dimension.LIGHT ? "LIGHT" : "DARK";
    const dimensionColor =
      this.currentDimension === Dimension.LIGHT ? "#ffff00" : "#aa00ff";

    this.dimensionText.setText(dimensionName);
    this.dimensionText.setColor(dimensionColor);
  }

  /**
   * Handle portal collision - can be overridden by subclasses
   */
  protected handlePortalCollision(
    _player:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    portal:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile
  ): void {
    console.log("🚀 DEBUG: Portal collision detected!");
    console.log("   Player position:", (_player as any).x, (_player as any).y);
    console.log("   Portal position:", (portal as any).x, (portal as any).y);

    // Cast portal to access custom properties
    const portalSprite = portal as Phaser.GameObjects.Sprite & {
      isActive?: boolean;
      onActivate?: () => void;
      targetLevel?: number;
      targetScene?: string;
      lastActivated?: number;
    };

    console.log("   Portal properties:");
    console.log("     isActive:", portalSprite.isActive);
    console.log("     has onActivate callback:", !!portalSprite.onActivate);
    console.log("     targetLevel:", portalSprite.targetLevel);
    console.log("     targetScene:", portalSprite.targetScene);

    // Check if portal is active
    if (!portalSprite.isActive) {
      console.log("❌ DEBUG: Portal is inactive, ignoring collision");
      return;
    }

    // Prevent rapid re-activation (cooldown of 1 second)
    const now = Date.now();
    if (portalSprite.lastActivated && now - portalSprite.lastActivated < 1000) {
      console.log("⏰ DEBUG: Portal cooldown active, ignoring collision");
      console.log(
        "   Time since last activation:",
        now - portalSprite.lastActivated,
        "ms"
      );
      return;
    }

    portalSprite.lastActivated = now;
    console.log("✅ DEBUG: Portal activation proceeding...");

    // Execute the custom activation callback if it exists
    if (portalSprite.onActivate) {
      console.log("🎯 DEBUG: Executing portal activation callback");
      try {
        portalSprite.onActivate();
        console.log("✅ DEBUG: Portal callback executed successfully");
      } catch (error) {
        console.error("❌ DEBUG: Error executing portal callback:", error);
      }
    } else {
      // Fallback: switch dimension if no custom callback
      console.log(
        "🔄 DEBUG: No portal callback found, switching dimension as fallback"
      );
      this.switchDimension();
    }
  }

  /**
   * Check if an object is visible in the current dimension
   */
  private isObjectVisibleInCurrentDimension(
    object: Phaser.Physics.Arcade.Sprite
  ): boolean {
    const objectDimension = (object as any).dimension || "both";
    const isLight = this.currentDimension === Dimension.LIGHT;

    return (
      objectDimension === "both" ||
      (objectDimension === "light" && isLight) ||
      (objectDimension === "dark" && !isLight) ||
      (objectDimension === Dimension.LIGHT && isLight) ||
      (objectDimension === Dimension.DARK && !isLight)
    );
  }

  /**
   * Create particle effects when collecting an item
   */
  private createCollectionParticles(
    x: number,
    y: number,
    color: number = 0xffd700
  ): void {
    try {
      // Create a simple particle burst effect
      const particles = this.scene.add.particles(x, y, "particle", {
        scale: { start: 0.5, end: 0 },
        speed: { min: 50, max: 150 },
        lifespan: 300,
        quantity: 8,
        tint: color,
      });

      // Auto-destroy the particle system after a short time
      this.scene.time.delayedCall(500, () => {
        particles.destroy();
      });
    } catch (error) {
      // Fallback: create simple circle sprites if particle system fails
      for (let i = 0; i < 6; i++) {
        const particle = this.scene.add.circle(x, y, 3, color);
        this.scene.tweens.add({
          targets: particle,
          x: x + Phaser.Math.Between(-50, 50),
          y: y + Phaser.Math.Between(-50, 50),
          alpha: 0,
          duration: 300,
          onComplete: () => particle.destroy(),
        });
      }
    }
  }

  /**
   * Play collection sound effects
   */
  private playCollectionSound(
    type: "coin" | "powerup" | "portal" = "coin"
  ): void {
    try {
      // Simple audio feedback using Web Audio API
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different collection types
      switch (type) {
        case "coin":
          oscillator.frequency.value = 800;
          break;
        case "powerup":
          oscillator.frequency.value = 600;
          break;
        case "portal":
          oscillator.frequency.value = 400;
          break;
      }

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log(`Collection sound played: ${type}`);
    }
  }

  /**
   * Force update all object visibility based on current dimension
   * Call this after creating all game objects to ensure proper initial visibility
   */
  updateAllObjectVisibility(): void {
    this.updateDimensionVisuals();
    console.log(`Updated visibility for dimension: ${this.currentDimension}`);
  }

  /**
   * Game State Management - Fluent API for updating game state during runtime
   */

  /**
   * Update the player's score
   * @param score New score value or amount to add (if relative is true)
   * @param relative If true, adds to current score; if false, sets absolute value
   */
  setScore(score: number, relative: boolean = false): GameSceneBuilder {
    if (this.player) {
      const currentScore = (this.player as any).score || 0;
      (this.player as any).score = relative ? currentScore + score : score;
      this.updateGameStateUI();
    }
    return this;
  }

  /**
   * Update the player's lives
   * @param lives New lives value or amount to add (if relative is true)
   * @param relative If true, adds to current lives; if false, sets absolute value
   */
  setLives(lives: number, relative: boolean = false): GameSceneBuilder {
    if (this.player) {
      const currentLives = (this.player as any).lives || 3;
      (this.player as any).lives = relative ? currentLives + lives : lives;
      this.updateGameStateUI();
    }
    return this;
  }

  /**
   * Add points to the score (convenience method)
   * @param points Points to add
   */
  addScore(points: number): GameSceneBuilder {
    return this.setScore(points, true);
  }

  /**
   * Add or remove lives (convenience method)
   * @param lives Lives to add (can be negative to remove)
   */
  addLives(lives: number): GameSceneBuilder {
    return this.setLives(lives, true);
  }

  /**
   * Set the current level
   * @param level Level number
   */
  setLevel(level: number): GameSceneBuilder {
    if (this.player) {
      (this.player as any).level = level;
      this.updateGameStateUI();
    }
    return this;
  }

  /**
   * Get current score
   */
  getScore(): number {
    return this.player ? (this.player as any).score || 0 : 0;
  }

  /**
   * Get current lives
   */
  getLives(): number {
    return this.player ? (this.player as any).lives || 3 : 3;
  }

  /**
   * Get current level
   */
  getLevel(): number {
    return this.player ? (this.player as any).level || 1 : 1;
  }

  /**
   * Show a temporary message on screen
   * @param message The message to display
   * @param duration How long to show the message in milliseconds (default: 2000)
   * @param color Text color (default: white)
   */
  showMessage(
    message: string,
    duration: number = 2000,
    color: string = "#ffffff"
  ): GameSceneBuilder {
    const { width, height } = this.scene.scale;

    const messageText = this.scene.add.text(width / 2, height / 2, message, {
      fontSize: "32px",
      color: color,
      fontFamily: "Arial",
      align: "center",
      stroke: "#000000",
      strokeThickness: 4,
    });
    messageText.setOrigin(0.5, 0.5);

    // Fade in
    messageText.setAlpha(0);
    this.scene.tweens.add({
      targets: messageText,
      alpha: 1,
      duration: 300,
      ease: "Power2",
    });

    // Auto-remove after duration
    this.scene.time.delayedCall(duration, () => {
      this.scene.tweens.add({
        targets: messageText,
        alpha: 0,
        duration: 300,
        ease: "Power2",
        onComplete: () => messageText.destroy(),
      });
    });

    return this;
  }

  /**
   * Show game controls on screen
   */
  showControls(): GameSceneBuilder {
    const { width } = this.scene.scale;

    const controlsText = this.scene.add.text(
      width - 20,
      120,
      "Controls:\n" +
        "Arrow Keys - Move\n" +
        "Space/Up - Jump\n" +
        "X - Switch Dimension",
      {
        fontSize: "16px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "right",
        stroke: "#000000",
        strokeThickness: 2,
      }
    );
    controlsText.setOrigin(1, 0);

    return this;
  }

  /**
   * Reset game state to initial values
   */
  resetGameState(): GameSceneBuilder {
    return this.setScore(0).setLives(3).setLevel(1);
  }

  /**
   * Check if player is out of lives
   */
  isGameOver(): boolean {
    return this.getLives() <= 0;
  }

  /**
   * Award bonus points with visual feedback
   * @param points Points to award
   * @param reason Reason for the bonus (displayed in message)
   */
  awardBonus(points: number, reason: string = "Bonus!"): GameSceneBuilder {
    this.addScore(points);
    this.showMessage(`${reason} +${points}`, 1500, "#00ff00");
    return this;
  }
}

/**
 * Helper function to create a new GameSceneBuilder
 * @param scene The Phaser scene to build objects in
 * @returns A new GameSceneBuilder instance
 */
export function createGameScene(scene: Phaser.Scene): GameSceneBuilder {
  return new GameSceneBuilder(scene);
}

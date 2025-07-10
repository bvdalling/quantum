/**
 * Quantum Jumper Game Scene
 *
 * Main game scene that handles all gameplay mechanics
 */

import Phaser from "phaser";
import {
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  TILE_SIZE,
  PLAYER_SPEED,
  JUMP_VELOCITY,
  MIN_JUMP_VELOCITY,
  GRAVITY,
  FALL_GRAVITY,
  AIR_CONTROL,
  JUMP_BUFFER_TIME,
  COYOTE_TIME,
  Dimension,
  JumpState,
  SoundType,
  TileType,
  COIN_VALUES,
  PowerupType,
} from "../constants";
import { LEVEL_MAPS } from "../data/levelMaps";
import { AudioSystem } from "../utils/AudioSystem";
import { TextureGenerator } from "../utils/TextureGenerator";
import type {
  GameState,
  PlayerState,
  CollectibleData,
  MobileInput,
} from "../types";

export class QuantumJumperScene extends Phaser.Scene {
  // Game state
  private gameState!: GameState;
  private playerState!: PlayerState;
  private mobileInput!: MobileInput;
  private collectedItems!: Set<string>;

  // Game objects
  private player!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private collectibles!: Phaser.Physics.Arcade.StaticGroup;
  private powerups!: Phaser.Physics.Arcade.StaticGroup;
  private hazards!: Phaser.GameObjects.Group;
  private portal!: Phaser.GameObjects.Sprite;
  private background!: Phaser.GameObjects.Rectangle;

  // Particles
  private particles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private portalParticles!: Phaser.GameObjects.Particles.ParticleEmitter;

  // UI elements
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private dimensionText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private wasd!: { [key: string]: Phaser.Input.Keyboard.Key };

  // Systems
  private audioSystem!: AudioSystem;
  private textureGenerator!: TextureGenerator;

  constructor() {
    super({ key: "QuantumJumperScene" });
  }

  init(data: { level?: number; isFromLoading?: boolean }): void {
    // Store initialization data to use in create method
    this.registry.set("initData", data);
  }

  preload(): void {
    // Initialize texture generator and load SVG assets
    this.textureGenerator = new TextureGenerator(this);
    this.textureGenerator.loadAllTextures();
  }

  create(): void {
    // Create procedural textures (portal and particles) after SVGs are loaded
    this.textureGenerator.createProceduralTextures();

    // Create player animations
    this.textureGenerator.createPlayerAnimations();

    this.initializeGameState();
    this.initializeSystems();
    this.createGameObjects();
    this.setupInput();
    this.generateLevel();
    this.setupCamera();
  }

  private initializeGameState(): void {
    // Get initialization data from registry
    const initData = this.registry.get("initData") || {};

    // Check if we're restoring from loading screen
    if (initData.isFromLoading) {
      const savedState = this.registry.get("gameState");
      if (savedState) {
        this.gameState = savedState;
        // Update level if specified
        if (initData.level) {
          this.gameState.level = initData.level;
        }
      } else {
        // Fallback to default state
        this.createDefaultGameState();
        if (initData.level) {
          this.gameState.level = initData.level;
        }
      }
    } else {
      // Create new game state
      this.createDefaultGameState();
      if (initData.level) {
        this.gameState.level = initData.level;
      }
    }

    this.playerState = {
      jumpState: JumpState.NONE,
      animationState: "standing" as any,
      isJumpPressed: false,
      jumpBufferTimer: 0,
      coyoteTimer: 0,
      wasOnGround: false,
    };

    this.mobileInput = { left: false, right: false };
    this.collectedItems = new Set<string>();

    // Clear the init data from registry
    this.registry.remove("initData");
  }

  private createDefaultGameState(): void {
    this.gameState = {
      level: 1,
      score: 0,
      lives: 3,
      dimension: Dimension.LIGHT,
      levelTransitioning: false,
      speedBoostActive: false,
      jumpBoostActive: false,
      invincibilityActive: false,
      currentPlayerSpeed: PLAYER_SPEED,
      currentJumpVelocity: JUMP_VELOCITY,
    };
  }

  private initializeSystems(): void {
    this.audioSystem = new AudioSystem();
  }

  private createGameObjects(): void {
    this.createBackground();
    this.createPlayer();
    this.createGroups();
    this.createParticles();
    this.createUI();
  }

  private createBackground(): void {
    this.background = this.add.rectangle(
      0,
      0,
      5000, // Large enough for any level
      VIEWPORT_HEIGHT,
      0x87ceeb
    );
    this.background.setOrigin(0, 0);
    this.background.setScrollFactor(0.1);
  }

  private createPlayer(): void {
    this.player = this.physics.add.sprite(0, 0, "player");
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(false); // We handle boundaries manually

    // Start with idle animation (will be set after animations are created)
    this.time.delayedCall(100, () => {
      if (this.player && this.player.anims) {
        this.player.play("player-idle");
      }
    });
  }

  private createGroups(): void {
    this.platforms = this.physics.add.staticGroup();
    this.collectibles = this.physics.add.staticGroup();
    this.powerups = this.physics.add.staticGroup();
    this.hazards = this.add.group();
  }

  private createParticles(): void {
    this.particles = this.add.particles(0, 0, "particle", {
      speed: { min: 50, max: 150 },
      scale: { start: 1, end: 0 },
      lifespan: 600,
      emitting: false,
    });

    this.portalParticles = this.add.particles(0, 0, "portal_particle", {
      speed: { min: 40, max: 100 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: 800,
      emitting: false,
      quantity: 2,
      frequency: 100,
      alpha: { start: 1, end: 0 },
      blendMode: "ADD",
    });
  }

  private createUI(): void {
    this.scoreText = this.add
      .text(16, 16, "Score: 0", {
        fontSize: "18px",
        color: "#fff",
      })
      .setScrollFactor(0);

    this.livesText = this.add
      .text(16, 40, "Lives: 3", {
        fontSize: "18px",
        color: "#fff",
      })
      .setScrollFactor(0);

    this.dimensionText = this.add
      .text(16, 64, "Dimension: Light", {
        fontSize: "18px",
        color: "#5f5fff",
      })
      .setScrollFactor(0);

    this.levelText = this.add
      .text(VIEWPORT_WIDTH - 120, 16, "Level: 1", {
        fontSize: "18px",
        color: "#fff",
      })
      .setScrollFactor(0);
  }

  private setupInput(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.spaceKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.wasd = this.input.keyboard!.addKeys("W,S,A,D") as {
      [key: string]: Phaser.Input.Keyboard.Key;
    };
  }

  private setupCamera(): void {
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  update(): void {
    if (!this.player || !this.player.body) return;

    this.updateJumpTimers();
    this.handlePlayerMovement();
    this.handlePlayerJump();
    this.handleDimensionShift();
    this.handleCollisions();
    this.updateUI();
  }

  private updateJumpTimers(): void {
    const deltaTime = this.game.loop.delta;

    // Update jump buffer timer
    if (this.playerState.jumpBufferTimer > 0) {
      this.playerState.jumpBufferTimer -= deltaTime;
    }

    // Update coyote timer
    if (this.playerState.coyoteTimer > 0) {
      this.playerState.coyoteTimer -= deltaTime;
    }
  }

  private handlePlayerMovement(): void {
    const isOnGround = this.player.body!.touching.down;
    const playerVelocityY = this.player.body!.velocity.y;

    // Update ground state for coyote time
    if (isOnGround && !this.playerState.wasOnGround) {
      // Just landed
      this.playerState.coyoteTimer = 0;
    } else if (!isOnGround && this.playerState.wasOnGround) {
      // Just left ground - start coyote timer
      this.playerState.coyoteTimer = COYOTE_TIME;
    }
    this.playerState.wasOnGround = isOnGround;

    // Calculate movement speed (reduced in air for Mario-like feel)
    const moveSpeed = isOnGround
      ? this.gameState.currentPlayerSpeed
      : this.gameState.currentPlayerSpeed * AIR_CONTROL;

    // Handle horizontal movement
    if (
      this.cursors.left.isDown ||
      this.wasd.A.isDown ||
      this.mobileInput.left
    ) {
      this.player.setVelocityX(-moveSpeed);
      this.player.setFlipX(true); // Face left

      // Play walking animation if on ground
      if (isOnGround && this.player.anims.currentAnim?.key !== "player-walk") {
        this.player.play("player-walk");
      }
    } else if (
      this.cursors.right.isDown ||
      this.wasd.D.isDown ||
      this.mobileInput.right
    ) {
      this.player.setVelocityX(moveSpeed);
      this.player.setFlipX(false); // Face right

      // Play walking animation if on ground
      if (isOnGround && this.player.anims.currentAnim?.key !== "player-walk") {
        this.player.play("player-walk");
      }
    } else {
      this.player.setVelocityX(0);

      // Play idle animation when not moving and on ground
      if (isOnGround && this.player.anims.currentAnim?.key !== "player-idle") {
        this.player.play("player-idle");
      }
    }

    // Handle dynamic gravity for better jump feel
    if (!isOnGround) {
      if (playerVelocityY < 0 && !this.playerState.isJumpPressed) {
        // Player is rising but not holding jump - apply extra gravity for short hop
        (this.player.body as Phaser.Physics.Arcade.Body).setGravityY(
          FALL_GRAVITY - GRAVITY
        );
      } else if (playerVelocityY > 0) {
        // Player is falling - apply faster gravity
        (this.player.body as Phaser.Physics.Arcade.Body).setGravityY(
          FALL_GRAVITY - GRAVITY
        );
      } else {
        // Normal rising with jump held
        (this.player.body as Phaser.Physics.Arcade.Body).setGravityY(0);
      }
    } else {
      // On ground - normal gravity
      (this.player.body as Phaser.Physics.Arcade.Body).setGravityY(0);
    }

    // Handle jump/fall animations based on vertical movement
    if (!isOnGround) {
      if (playerVelocityY < 0) {
        // Player is rising (jumping)
        if (this.player.anims.currentAnim?.key !== "player-jump") {
          this.player.play("player-jump");
        }
        this.playerState.jumpState = JumpState.RISING;
      } else if (playerVelocityY > 0) {
        // Player is falling
        if (this.player.anims.currentAnim?.key !== "player-fall") {
          this.player.play("player-fall");
        }
        this.playerState.jumpState = JumpState.FALLING;
      }
    } else {
      // Player is on ground
      this.playerState.jumpState = JumpState.NONE;
    }
  }

  private handlePlayerJump(): void {
    const isOnGround = this.player.body!.touching.down;
    const jumpPressed = this.cursors.up.isDown || this.wasd.W.isDown;
    const jumpJustPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.wasd.W);

    // Update jump pressed state
    this.playerState.isJumpPressed = jumpPressed;

    // Jump buffer - if jump is pressed, start buffer timer
    if (jumpJustPressed) {
      this.playerState.jumpBufferTimer = JUMP_BUFFER_TIME;
    }

    // Check if we can jump (on ground, in coyote time, or jump buffered)
    const canJump =
      isOnGround ||
      this.playerState.coyoteTimer > 0 ||
      this.playerState.jumpBufferTimer > 0;

    // Execute jump
    if (canJump && this.playerState.jumpBufferTimer > 0) {
      this.player.setVelocityY(-this.gameState.currentJumpVelocity);
      this.playerState.jumpState = JumpState.RISING;
      this.player.play("player-jump"); // Immediately play jump animation
      this.audioSystem.playSound(SoundType.JUMP);

      // Clear timers
      this.playerState.jumpBufferTimer = 0;
      this.playerState.coyoteTimer = 0;
    }

    // Variable jump height - if jump button is released while rising, cut jump short
    if (
      !jumpPressed &&
      this.playerState.jumpState === JumpState.RISING &&
      this.player.body!.velocity.y < -MIN_JUMP_VELOCITY
    ) {
      this.player.setVelocityY(-MIN_JUMP_VELOCITY);
    }
  }

  private handleDimensionShift(): void {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      // Store player position before dimension shift
      const playerX = this.player.x;
      const playerY = this.player.y;
      const playerVelX = this.player.body!.velocity.x;
      const playerVelY = this.player.body!.velocity.y;

      // Switch dimension
      this.gameState.dimension =
        this.gameState.dimension === Dimension.LIGHT
          ? Dimension.DARK
          : Dimension.LIGHT;

      // Update UI
      this.dimensionText.setText(
        "Dimension: " +
          (this.gameState.dimension === Dimension.LIGHT ? "Light" : "Dark")
      );
      this.dimensionText.setColor(
        this.gameState.dimension === Dimension.LIGHT ? "#5f5fff" : "#ff5f5f"
      );

      // Visual effects
      this.particles.emitParticleAt(this.player.x, this.player.y, 20);
      this.audioSystem.playSound(SoundType.DIMENSION);

      // Reload level with new dimension
      this.clearLevel();
      const levelData =
        LEVEL_MAPS[(this.gameState.level - 1) % LEVEL_MAPS.length];
      const currentMap = levelData[this.gameState.dimension];
      this.loadLevelFromMap(currentMap);

      // Restore player position and velocity
      this.player.setPosition(playerX, playerY);
      this.player.setVelocity(playerVelX, playerVelY);

      // Re-setup physics
      this.setupPhysicsCollisions();
    }
  }

  private handleCollisions(): void {
    const levelData =
      LEVEL_MAPS[(this.gameState.level - 1) % LEVEL_MAPS.length];
    const currentMap = levelData[this.gameState.dimension];
    const mapWidth =
      Math.max(...currentMap.map((row) => row.length)) * TILE_SIZE;
    const mapHeight = currentMap.length * TILE_SIZE;

    // Handle side boundaries
    if (this.player.x < TILE_SIZE / 2) {
      this.player.x = TILE_SIZE / 2;
      this.player.setVelocityX(0);
    }
    if (this.player.x > mapWidth - TILE_SIZE / 2) {
      this.player.x = mapWidth - TILE_SIZE / 2;
      this.player.setVelocityX(0);
    }

    // Death detection - falling out of the bottom
    if (this.player.y > mapHeight - 10) {
      this.handlePlayerDeath(currentMap);
      return;
    }

    // Portal collision
    if (
      this.portal?.visible &&
      !this.gameState.levelTransitioning &&
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        this.portal.getBounds()
      )
    ) {
      this.gameState.levelTransitioning = true;
      this.audioSystem.playSound(SoundType.PORTAL);
      this.nextLevel();
    }
  }

  private handlePlayerDeath(currentMap: string[]): void {
    this.gameState.lives--;

    // Find player start position
    for (let row = 0; row < currentMap.length; row++) {
      for (let col = 0; col < currentMap[row].length; col++) {
        if (currentMap[row][col] === TileType.PLAYER_START) {
          const startX = col * TILE_SIZE + TILE_SIZE / 2;
          const startY = row * TILE_SIZE + TILE_SIZE / 2;
          this.player.setPosition(startX, startY);
          break;
        }
      }
    }

    this.player.setVelocity(0, 0);
    if (this.gameState.lives <= 0) {
      this.gameOver();
    }
  }

  private updateUI(): void {
    this.scoreText.setText("Score: " + this.gameState.score);
    this.livesText.setText("Lives: " + this.gameState.lives);
    this.levelText.setText("Level: " + this.gameState.level);
  }

  private generateLevel(): void {
    this.clearLevel();
    this.gameState.levelTransitioning = false;

    const levelData =
      LEVEL_MAPS[(this.gameState.level - 1) % LEVEL_MAPS.length];
    const currentMap = levelData[this.gameState.dimension];

    // Try to use pre-baked level data for better performance
    const cacheKey = `level_${(this.gameState.level - 1) % LEVEL_MAPS.length}_${
      this.gameState.dimension === Dimension.LIGHT ? "light" : "dark"
    }`;

    if (this.useCachedLevel(cacheKey)) {
      console.log(`Using pre-baked data for ${cacheKey}`);
    } else {
      console.log(`Falling back to runtime generation for ${cacheKey}`);
      this.loadLevelFromMap(currentMap);
    }

    this.setupPhysicsCollisions();
    this.setupWorldBounds(currentMap);
  }

  private useCachedLevel(cacheKey: string): boolean {
    const cachedData = this.registry.get(cacheKey);
    if (!cachedData) {
      return false;
    }

    // Create platforms from cached data
    cachedData.platforms.forEach((pos: { x: number; y: number }) => {
      const platform = this.platforms.create(pos.x, pos.y, "platform");
      platform.refreshBody();
    });

    // Create collectibles from cached data
    cachedData.collectibles.forEach(
      (item: { x: number; y: number; type: TileType }) => {
        const collectibleKey = `${this.gameState.level}_${Math.floor(
          (item.y - 16) / 32
        )}_${Math.floor((item.x - 16) / 32)}_${item.type}`;
        if (!this.collectedItems.has(collectibleKey)) {
          const textureKey = TextureGenerator.getTextureKey(item.type);
          const collectible = this.collectibles.create(
            item.x,
            item.y,
            textureKey
          ) as Phaser.Physics.Arcade.Sprite & CollectibleData;
          collectible.mapRow = Math.floor((item.y - 16) / 32);
          collectible.mapCol = Math.floor((item.x - 16) / 32);
          collectible.tileType = item.type;
        }
      }
    );

    // Create powerups from cached data
    cachedData.powerups.forEach(
      (item: { x: number; y: number; type: TileType }) => {
        const powerupKey = `${this.gameState.level}_${Math.floor(
          (item.y - 16) / 32
        )}_${Math.floor((item.x - 16) / 32)}_${item.type}`;
        if (!this.collectedItems.has(powerupKey)) {
          const textureKey = TextureGenerator.getTextureKey(item.type);
          const powerup = this.powerups.create(
            item.x,
            item.y,
            textureKey
          ) as Phaser.Physics.Arcade.Sprite & CollectibleData;
          powerup.mapRow = Math.floor((item.y - 16) / 32);
          powerup.mapCol = Math.floor((item.x - 16) / 32);
          powerup.tileType = item.type;
        }
      }
    );

    // Set player position
    if (cachedData.player) {
      this.player.setPosition(cachedData.player.x, cachedData.player.y);
      this.player.setVelocity(0, 0);
    }

    // Create portal
    if (cachedData.portal) {
      this.portal = this.add.sprite(
        cachedData.portal.x,
        cachedData.portal.y,
        "portal"
      );
      this.portal.setOrigin(0.5, 0.5);
      this.portalParticles.setPosition(
        cachedData.portal.x,
        cachedData.portal.y
      );
      this.portalParticles.start();
    }

    return true;
  }

  private loadLevelFromMap(mapData: string[]): void {
    for (let row = 0; row < mapData.length; row++) {
      const mapRow = mapData[row];
      for (let col = 0; col < mapRow.length; col++) {
        const char = mapRow[col];
        const x = col * TILE_SIZE + TILE_SIZE / 2;
        const y = row * TILE_SIZE + TILE_SIZE / 2;

        this.createTileObject(char, x, y, row, col);
      }
    }
  }

  private createTileObject(
    tileType: string,
    x: number,
    y: number,
    row: number,
    col: number
  ): void {
    switch (tileType) {
      case TileType.PLAYER_START:
        this.player.setPosition(x, y);
        this.player.setVelocity(0, 0);
        break;

      case TileType.PLATFORM:
        const platform = this.platforms.create(x, y, "platform");
        platform.refreshBody();
        break;

      // Handle all coin types
      case TileType.COIN:
      case TileType.BRONZE_COIN:
      case TileType.SILVER_COIN:
      case TileType.GOLD_COIN:
      case TileType.RUBY_COIN:
        const coinKey = `${this.gameState.level}_${row}_${col}_${tileType}`;
        if (!this.collectedItems.has(coinKey)) {
          const textureKey = TextureGenerator.getTextureKey(tileType);
          const coin = this.collectibles.create(
            x,
            y,
            textureKey
          ) as Phaser.Physics.Arcade.Sprite & CollectibleData;
          coin.mapRow = row;
          coin.mapCol = col;
          coin.tileType = tileType;
        }
        break;

      // Handle all powerup types
      case TileType.POWERUP:
      case TileType.MUSHROOM:
      case TileType.ONE_UP:
      case TileType.POISON:
      case TileType.FIRE_FLOWER:
      case TileType.STAR:
      case TileType.SPEED_BOOST:
        const powerupKey = `${this.gameState.level}_${row}_${col}_${tileType}`;
        if (!this.collectedItems.has(powerupKey)) {
          const textureKey = TextureGenerator.getTextureKey(tileType);
          const powerup = this.powerups.create(
            x,
            y,
            textureKey
          ) as Phaser.Physics.Arcade.Sprite & CollectibleData;
          powerup.mapRow = row;
          powerup.mapCol = col;
          powerup.tileType = tileType;
        }
        break;

      case TileType.PORTAL:
        this.portal = this.add.sprite(x, y, "portal");
        this.portal.setOrigin(0.5, 0.5);
        this.portalParticles.setPosition(x, y);
        this.portalParticles.start();
        break;
    }
  }

  private setupPhysicsCollisions(): void {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.collectibles,
      this.collectCoin as any,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.powerups,
      this.collectPowerup as any,
      undefined,
      this
    );
  }

  private setupWorldBounds(currentMap: string[]): void {
    const mapWidth = currentMap[0].length * TILE_SIZE;
    const mapHeight = currentMap.length * TILE_SIZE;

    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setViewport(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  }

  private collectCoin(
    _player: Phaser.Physics.Arcade.Sprite,
    coin: Phaser.Physics.Arcade.Sprite & CollectibleData
  ): void {
    const coinKey = `${this.gameState.level}_${coin.mapRow}_${coin.mapCol}_${coin.tileType}`;
    this.collectedItems.add(coinKey);

    this.particles.setPosition(coin.x, coin.y);
    this.particles.explode(10);
    coin.destroy();

    this.audioSystem.playSound(SoundType.COIN);

    // Add score based on coin type
    const coinValue = COIN_VALUES[coin.tileType] || 1;
    this.gameState.score += coinValue;
  }

  private collectPowerup(
    _player: Phaser.Physics.Arcade.Sprite,
    powerup: Phaser.Physics.Arcade.Sprite & CollectibleData
  ): void {
    const powerupKey = `${this.gameState.level}_${powerup.mapRow}_${powerup.mapCol}_${powerup.tileType}`;
    this.collectedItems.add(powerupKey);

    this.particles.setPosition(powerup.x, powerup.y);
    this.particles.explode(20);
    powerup.destroy();

    this.audioSystem.playSound(SoundType.POWERUP);

    // Apply powerup effect based on type
    this.applyPowerupEffect(powerup.tileType);
  }

  private applyPowerupEffect(tileType: TileType): void {
    switch (tileType) {
      case TileType.POWERUP:
      case TileType.MUSHROOM:
        // Score boost
        this.gameState.score += 50;
        break;

      case TileType.ONE_UP:
        // Extra life
        this.gameState.lives++;
        break;

      case TileType.POISON:
        // Lose a life
        this.gameState.lives--;
        if (this.gameState.lives <= 0) {
          this.gameOver();
        }
        break;

      case TileType.FIRE_FLOWER:
        // Temporary invincibility
        this.gameState.invincibilityActive = true;
        this.time.delayedCall(8000, () => {
          this.gameState.invincibilityActive = false;
        });
        break;

      case TileType.STAR:
        // Super jump boost
        this.gameState.jumpBoostActive = true;
        this.gameState.currentJumpVelocity = 500;
        this.time.delayedCall(10000, () => {
          this.gameState.jumpBoostActive = false;
          this.gameState.currentJumpVelocity = JUMP_VELOCITY;
        });
        break;

      case TileType.SPEED_BOOST:
        // Speed boost
        this.gameState.speedBoostActive = true;
        this.gameState.currentPlayerSpeed = 280;
        this.time.delayedCall(8000, () => {
          this.gameState.speedBoostActive = false;
          this.gameState.currentPlayerSpeed = PLAYER_SPEED;
        });
        break;
    }
  }

  private nextLevel(): void {
    this.gameState.level++;
    this.gameState.lives++;
    this.collectedItems.clear();

    const overlay = this.add
      .rectangle(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 0x000000, 0.7)
      .setOrigin(0)
      .setScrollFactor(0);

    const levelText = this.add
      .text(
        VIEWPORT_WIDTH / 2,
        VIEWPORT_HEIGHT / 2 - 20,
        `Level ${this.gameState.level - 1} Complete!`,
        { fontSize: "24px", color: "#ffffff" }
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    const nextLevelText = this.add
      .text(
        VIEWPORT_WIDTH / 2,
        VIEWPORT_HEIGHT / 2 + 20,
        `Preparing Level ${this.gameState.level}...`,
        { fontSize: "16px", color: "#87ceeb" }
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    this.time.delayedCall(2000, () => {
      // Save current game state to registry
      this.registry.set("gameState", this.gameState);

      // Transition to loading screen for next level
      this.scene.start("LoadingScene", {
        level: this.gameState.level,
        isInitialLoad: false,
      });
    });
  }

  private gameOver(): void {
    this.physics.pause();

    this.add
      .text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2, "GAME OVER", {
        fontSize: "32px",
        color: "#ff0000",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    this.add
      .text(
        VIEWPORT_WIDTH / 2,
        VIEWPORT_HEIGHT / 2 + 40,
        "Final Score: " + this.gameState.score,
        { fontSize: "24px", color: "#fff" }
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    this.add
      .text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2 + 80, "Click to restart", {
        fontSize: "18px",
        color: "#fff",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    this.input.once("pointerdown", () => {
      this.scene.restart();
    });
  }

  private clearLevel(): void {
    this.platforms.clear(true, true);
    this.collectibles.clear(true, true);
    this.hazards.clear(true, true);
    this.powerups.clear(true, true);
    if (this.portal) {
      this.portal.destroy();
    }
  }
}

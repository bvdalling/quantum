/**
 * QUANTUM JUMPER GAME SCENE - BEGINNER'S GUIDE
 *
 * This is the main game scene where all the action happens! Think of a "scene"
 * like a level or screen in a video game. This particular scene contains:
 * - The player character that you control
 * - Platforms to jump on
 * - Coins to collect for points
 * - Powerups that give special abilities
 * - Portals to travel between levels
 *
 * WHAT IS A "FLUENT API"?
 * A fluent API lets you build game objects by chaining methods together with dots.
 * Instead of writing lots of separate lines, you can write one flowing sentence like:
 *
 * gameBuilder.addPlayer().atPosition(3, 5).withLives(3).build()
 *
 * This reads almost like English: "Add a player at position 3,5 with 3 lives"
 *
 * GRID SYSTEM EXPLAINED:
 * Instead of using exact pixel positions (which are hard to calculate), we use
 * a grid system. The game world is divided into squares called "tiles".
 * Each tile is 32x32 pixels, so:
 * - Grid position (0, 0) = Pixel position (0, 0) - top-left corner
 * - Grid position (1, 0) = Pixel position (32, 0) - one tile to the right
 * - Grid position (0, 1) = Pixel position (0, 32) - one tile down
 *
 * This makes it much easier to place objects exactly where you want them!
 */

// These are "imports" - they bring in code from other files that we need
// Think of imports like ingredients in a recipe - we need these to make our game work

import Phaser from "phaser"; // The game engine - the main library that creates games
import { createGameScene } from "../../utils/GameSceneBuilder"; // Our fluent API builder - the tool that makes creating game objects easy
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, Dimension } from "../../constants"; // Game settings - numbers that control how big the screen is, etc.
import { AudioSystem } from "../../utils/AudioSystem"; // Sound effects - plays jump sounds, coin collection sounds, etc.
import { TextureGenerator } from "../../utils/TextureGenerator"; // Graphics generator - creates the pictures/sprites for our game
import type { GameState } from "../../types"; // TypeScript type definitions - tells the computer what kind of data we're working with

// This is our main class - think of it like a blueprint for our game scene
// "export" means other files can use this class
// "extends Phaser.Scene" means our class gets all the superpowers of Phaser's Scene class
export class QuantumJumperScene extends Phaser.Scene {
  // These are "properties" - variables that belong to this class
  // Think of them like pockets in a jacket where we store important things

  // The "!" tells TypeScript "trust me, this will have a value later"
  // These properties store the main systems our game needs:

  private gameBuilder!: ReturnType<typeof createGameScene>; // Our main tool for creating game objects
  private gameState!: GameState; // Keeps track of score, lives, current level, etc.
  private audioSystem!: AudioSystem; // Handles all sound effects
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // Arrow keys for movement
  private spaceKey!: Phaser.Input.Keyboard.Key; // Space bar for jumping

  // Constructor is like the "birth certificate" of our scene
  // It runs once when the scene is first created
  constructor() {
    super({ key: "QuantumJumperScene" }); // Give this scene a name so we can refer to it later
  }

  // preload() runs before the game starts
  // It's like preparing all your art supplies before you start painting
  preload(): void {
    // Load all the graphics (textures) we need for our game
    // Textures are like the "skins" or "costumes" for our game objects
    const textureGenerator = new TextureGenerator(this);
    textureGenerator.loadAllTextures(); // Load player, platform, coin graphics, etc.
  }

  // create() runs once when the scene starts
  // This is where we actually build our level and set up everything
  create(): void {
    // Step 1: Set up the basic game state (score, lives, etc.)
    this.initializeState();

    // Step 2: Set up systems like sound
    this.initializeSystems();

    // Step 3: Set up keyboard controls
    this.setupInput();

    // Step 4: Create our main game builder tool
    // This is like getting out your LEGO building kit
    this.gameBuilder = createGameScene(this);

    // Step 5: Actually build the level with platforms, coins, etc.
    this.createLevel();

    // Step 6: Set up the camera to follow the player
    this.setupCamera();

    // Step 7: Play a welcome sound
    this.audioSystem.playSound("start" as any);
  }

  // This function sets up the initial game state
  // Game state is like keeping track of your progress in a board game
  private initializeState(): void {
    // Create an object that holds all our game's current status
    this.gameState = {
      score: 0, // Player starts with 0 points
      lives: 3, // Player starts with 3 lives
      level: 1, // We're starting on level 1
      dimension: "light" as any, // We start in the "light" dimension (there are 2 dimensions)
      levelTransitioning: false, // We're not currently changing levels
      speedBoostActive: false, // Player doesn't have speed boost yet
      jumpBoostActive: false, // Player doesn't have jump boost yet
      invincibilityActive: false, // Player is not invincible yet
      currentPlayerSpeed: 200, // How fast the player moves (pixels per second)
      currentJumpVelocity: 800, // How high the player can jump
    };
  }

  // This function sets up the sound system
  private initializeSystems(): void {
    // Create our audio system so we can play sound effects
    this.audioSystem = new AudioSystem();
  }

  // This function sets up keyboard controls
  // It tells the game what to do when players press keys
  private setupInput(): void {
    // Set up arrow keys for movement
    // "createCursorKeys()" gives us up, down, left, right arrow keys
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Set up space bar for jumping
    // "addKey" creates a key that we can check if it's being pressed
    this.spaceKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // Set up the X key for dimension switching
    // This is the special mechanic of our game - switching between light/dark dimensions!
    const xKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    // When X key is pressed down, do this:
    xKey.on("down", () => {
      this.gameBuilder.switchDimension(); // Change between light and dark dimension
      this.audioSystem.playSound("dimension" as any); // Play a "whoosh" sound effect
    });
  }

  // This is the main function that creates our level!
  // Think of this like building a level in Super Mario Maker
  private createLevel(): void {
    // STEP 1: Set up the world size
    // Our world will be 25 tiles wide and 19 tiles tall
    // Since each tile is 32x32 pixels, this makes our world 800x608 pixels
    this.gameBuilder.setWorldSize(25, 19);

    // STEP 2: Create the player character
    // This is like placing Mario at the starting position
    const player = this.gameBuilder
      .addPlayer() // Start creating a player
      .withLives(this.gameState.lives) // Give them 3 lives (from our game state)
      .withScore(this.gameState.score) // Starting score (0 points)
      .atPosition(3, 12) // Place at grid position (3, 12) - that's 3 tiles right, 12 tiles down
      .withSpeed(this.gameState.currentPlayerSpeed) // How fast they move (200 pixels per second)
      .withJumpPower(this.gameState.currentJumpVelocity) // How high they jump (800 pixels per second upward)
      .build(); // Actually create the player!

    // STEP 3: Tell the game this is our main player
    // This is important - it tells the camera to follow this player and enables collisions
    this.gameBuilder.setMainPlayer(player);

    // STEP 4: Set up the game's user interface (UI)
    // The UI shows score, lives, level number, etc. at the top of the screen
    this.gameBuilder
      .setScore(this.gameState.score) // Display current score
      .setLives(this.gameState.lives) // Display current lives
      .setLevel(this.gameState.level) // Display current level number
      .showMessage("Welcome to Quantum Jumper!", 3000, "#00ff00") // Show green welcome message for 3 seconds
      .showControls(); // Show control instructions

    // STEP 5: Create the actual level layout (platforms, coins, etc.)
    this.createSimpleLevel();

    // STEP 6: Make sure all objects show up in the correct dimension
    // This updates the visibility of all platforms, coins, etc. based on current dimension
    this.gameBuilder.updateAllObjectVisibility();

    // STEP 7: Log a message to the console (for debugging)
    // You can see this message if you open Developer Tools in your browser
    console.log("Level created with fluent API!");
  }

  // This function creates the actual level layout
  // It's like painting all the platforms, coins, and other objects onto our level
  private createSimpleLevel(): void {
    // === CREATE THE GROUND ===
    // We need a floor for the player to walk on, so let's create ground platforms
    // This uses a "nested loop" - one loop inside another loop

    // Outer loop: goes through Y positions (vertical - up and down)
    // We start at gridY = 14 and go down to gridY = 18 (that's 5 rows of ground)
    for (let gridY = 14; gridY < 19; gridY++) {
      // Inner loop: goes through X positions (horizontal - left to right)
      // We go from gridX = 0 to gridX = 24 (that's 25 columns across)
      for (let gridX = 0; gridX < 25; gridX++) {
        // For each position, create a platform
        this.gameBuilder
          .addPlatform() // Start creating a platform
          .atCoords(gridX, gridY) // Place it at the current grid position
          .withCollider() // Player can stand on it (has collision)
          .setSolid() // It's solid (won't break when touched)
          .setDimension("both") // Visible in both light and dark dimensions
          .build(); // Actually create this platform
      }
    }
    // After these loops finish, we'll have a solid ground made of 125 platform tiles!

    // === CREATE FLOATING PLATFORMS ===
    // Now let's add some platforms in the air for the player to jump on
    // These platforms will exist in different dimensions to create puzzles

    // FIRST FLOATING PLATFORM - Only in Light Dimension
    // This platform is at grid position (6, 11) - that's 6 tiles right, 11 tiles down
    this.gameBuilder
      .addPlatform() // Start creating a platform
      .atCoords(6, 11) // Place it at grid position (6, 11)
      .withCollider() // Player can stand on it
      .setSolid() // It won't break
      .setDimension(Dimension.LIGHT) // IMPORTANT: Only visible in light dimension!
      .build(); // Create it

    // SECOND FLOATING PLATFORM - Visible in Both Dimensions
    // This one is higher up and in the middle of the level
    this.gameBuilder
      .addPlatform() // Start creating a platform
      .atCoords(12, 9) // Place it at grid position (12, 9) - higher up than the first one
      .withCollider() // Player can stand on it
      .setSolid() // It won't break
      .setDimension("both") // Visible in BOTH dimensions (light and dark)
      .build(); // Create it

    // THIRD FLOATING PLATFORM - Only in Dark Dimension
    // This one is even higher and only appears in the dark dimension
    this.gameBuilder
      .addPlatform() // Start creating a platform
      .atCoords(18, 7) // Place it at grid position (18, 7) - the highest one
      .withCollider() // Player can stand on it
      .setSolid() // It won't break
      .setBreakable()
      .setDimension(Dimension.DARK) // IMPORTANT: Only visible in dark dimension!
      .build(); // Create it

    // === ADD COINS TO COLLECT ===
    // Coins give the player points when collected
    // Different coin types are worth different amounts of points

    // BRONZE COIN - Worth 1 point
    // This coin is above the first platform and only appears in light dimension
    this.gameBuilder
      .addCoin() // Start creating a coin
      .atCoords(6, 10) // Place it above the first platform (one tile up from platform)
      .withTexture("bronze-coin") // Use bronze coin graphics (brown colored)
      .animated() // Make it spin and sparkle
      .setDimension(Dimension.LIGHT) // Only visible in light dimension (same as platform below)
      .build(); // Create it

    // SILVER COIN - Worth 5 points
    // This coin is above the second platform and appears in both dimensions
    this.gameBuilder
      .addCoin() // Start creating a coin
      .atCoords(12, 8) // Place it above the second platform
      .withTexture("silver-coin") // Use silver coin graphics (silver colored, worth more!)
      .animated() // Make it spin and sparkle
      .setDimension("both") // Visible in both dimensions (easier to get)
      .build(); // Create it

    // GOLD COIN - Worth 10 points
    // This coin is above the third platform and only appears in dark dimension
    this.gameBuilder
      .addCoin() // Start creating a coin
      .atCoords(18, 6) // Place it above the third platform
      .withTexture("gold-coin") // Use gold coin graphics (gold colored, worth even more!)
      .animated() // Make it spin and sparkle
      .setDimension(Dimension.DARK) // Only visible in dark dimension (harder to get, but worth more!)
      .build(); // Create it

    // === ADD POWERUPS ===
    // Powerups give the player special abilities when collected

    // MUSHROOM POWERUP - Makes player grow bigger and stronger
    // This is placed on the ground near the middle of the level
    this.gameBuilder
      .addPowerup() // Start creating a powerup
      .atCoords(9, 13) // Place it on the ground (y=13 is one tile above ground)
      .ofType("mushroom") // This is a mushroom powerup (like in Super Mario)
      .animated() // Make it bounce and glow
      .setDimension("both") // Visible in both dimensions (easy to find)
      .build(); // Create it

    // 1-UP POWERUP - Gives player an extra life
    // This is placed higher up and only in light dimension (harder to get)
    this.gameBuilder
      .addPowerup() // Start creating a powerup
      .atCoords(15, 7) // Place it high up (requires jumping to reach)
      .ofType("1up") // This gives an extra life (very valuable!)
      .animated() // Make it bounce and glow
      .setDimension(Dimension.LIGHT) // Only visible in light dimension
      .build(); // Create it

    // === ADD SECRET TREASURE ===
    // RUBY COIN - Worth 25 points (the most valuable coin!)
    // This is a secret coin hidden in the dark dimension
    this.gameBuilder
      .addCoin() // Start creating a coin
      .atCoords(1, 6) // Place it in the top-left area (secret location)
      .withTexture("ruby-coin") // Use ruby coin graphics (red colored, very valuable!)
      .animated() // Make it spin and sparkle
      .setDimension(Dimension.DARK) // Hidden in dark dimension (you have to explore to find it!)
      .build(); // Create it

    // === ADD EXIT PORTAL ===
    // The portal lets the player advance to the next level
    const portalData = this.gameBuilder
      .addPortal() // Start creating a portal
      .atCoords(21, 11) // Place it near the end of the level
      .withParticles() // Show swirling particle effects (looks cool!)
      .goesToNextLevel() // When player touches it, they advance to next level
      .setDimension("both") // Available in both dimensions (player can always exit)
      .goesToScene("Level2Scene") // When player touches it, they go to "Level2" scene
      .build(); // Create it

    // === REGISTER THE PORTAL ===
    // We need to tell the game builder about this portal so it can detect when the player touches it
    this.gameBuilder.registerPortal(portalData);

    // === LEVEL CREATION COMPLETE! ===
    // At this point, we've created:
    // - A solid ground made of platforms
    // - 3 floating platforms (some in light dimension, some in dark, some in both)
    // - 4 coins of different values (bronze=1, silver=5, gold=10, ruby=25 points)
    // - 2 powerups (mushroom for growth, 1-up for extra life)
    // - 1 exit portal to advance to the next level
    //
    // The player can now explore both dimensions to find all the secrets!
  }

  // This function sets up the camera to follow the player
  // Think of it like a movie camera that always keeps the main character in view
  private setupCamera(): void {
    // Get our main player that we created earlier
    const player = this.gameBuilder.getMainPlayer();

    // If we have a player (we should!), set up the camera
    if (player) {
      // startFollow makes the camera follow the player smoothly
      // The numbers (0.08, 0.08) control how smoothly the camera moves
      this.cameras.main.startFollow(player, true, 0.08, 0.08);

      // Set the camera's viewing area to match our game screen size
      this.cameras.main.setViewport(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    }
  }

  // update() runs every frame (60 times per second!)
  // This is where we check for player input and update the game state
  update(): void {
    // Get our main player
    const player = this.gameBuilder.getMainPlayer();

    // If there's no player or the player doesn't have physics, stop here
    // (This shouldn't happen, but it's good to be safe)
    if (!player || !player.body) return;

    // Handle keyboard input (moving, jumping)
    this.handleInput(player);

    // Check if the player has died (fell off the world)
    this.checkPlayerDeath();
  }

  // This function checks if the player has died and handles respawning
  private checkPlayerDeath(): void {
    // Use our game builder to check if the player fell out of the world or got hurt
    if (this.gameBuilder.checkPlayerDeath()) {
      // Check if the player still has lives left
      if (!this.gameBuilder.isGameOver()) {
        // RESPAWN THE PLAYER
        // Put the player back at the starting position (grid coordinates 3, 12)
        this.gameBuilder.respawnPlayer(3, 12);

        // Show a message telling the player they died
        this.gameBuilder.showMessage("You died! Try again.", 2000, "#ff0000");

        // Play a death sound effect
        this.audioSystem.playSound("death" as any);
      } else {
        // GAME OVER - No more lives left
        // Show game over message
        this.gameBuilder.showMessage("Game Over!", 3000, "#ff0000");
        console.log("Game Over!");

        // Wait 3 seconds, then reset the game and restart
        this.time.delayedCall(3000, () => {
          this.gameBuilder.resetGameState(); // Reset score, lives, etc.
          this.scene.restart(); // Restart the entire scene
        });
      }
    }
  }

  // This function handles keyboard input from the player
  // It's called every frame to check what keys are being pressed
  private handleInput(player: Phaser.Physics.Arcade.Sprite): void {
    // Get the player's physics body (this controls movement and collisions)
    const body = player.body as Phaser.Physics.Arcade.Body;

    // Check if the player is touching the ground (for jumping and animations)
    const isOnGround = body.touching.down;

    // === HANDLE LEFT/RIGHT MOVEMENT ===
    if (this.cursors.left.isDown) {
      // LEFT ARROW KEY IS PRESSED
      // Move the player left at their current speed (negative X velocity)
      body.setVelocityX(-this.gameState.currentPlayerSpeed);

      // Flip the player sprite to face left
      player.setFlipX(true);

      // If player is on the ground, play walking animation
      if (isOnGround) player.play("player-walk", true);
    } else if (this.cursors.right.isDown) {
      // RIGHT ARROW KEY IS PRESSED
      // Move the player right at their current speed (positive X velocity)
      body.setVelocityX(this.gameState.currentPlayerSpeed);

      // Make sure player sprite faces right (not flipped)
      player.setFlipX(false);

      // If player is on the ground, play walking animation
      if (isOnGround) player.play("player-walk", true);
    } else {
      // NO LEFT/RIGHT KEYS ARE PRESSED
      // Stop horizontal movement
      body.setVelocityX(0);

      // If player is on the ground, play idle/standing animation
      if (isOnGround) player.play("player-idle", true);
    }

    // === HANDLE JUMPING ===
    // Check if UP arrow or SPACE bar is pressed
    if (this.cursors.up.isDown || this.spaceKey.isDown) {
      // Only allow jumping if the player is on the ground
      if (isOnGround) {
        // Make the player jump by setting upward velocity (negative Y)
        body.setVelocityY(-this.gameState.currentJumpVelocity);

        // Play jump sound effect
        this.audioSystem.playSound("jump" as any);

        // Play jump animation
        player.play("player-jump");
      }
    }

    // === HANDLE FALLING/JUMPING ANIMATIONS ===
    // Update animation based on whether player is in the air and moving up or down
    if (!isOnGround) {
      if (body.velocity.y < 0) {
        // Player is moving upward (jumping)
        player.play("player-jump", true);
      } else {
        // Player is moving downward (falling)
        player.play("player-fall", true);
      }
    }
  }
}

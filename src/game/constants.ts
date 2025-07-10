/**
 * QUANTUM JUMPER - GAME CONSTANTS
 *
 * This file contains all the important numbers and settings that control how our game works.
 * Think of these as the "rules" of our game world - like how fast the player moves,
 * how high they can jump, what different items are worth, etc.
 *
 * BEGINNER TIP: You can change these numbers to customize your game!
 * For example, make PLAYER_SPEED bigger to make the game faster, or change
 * COIN_VALUES to make coins worth more points.
 *
 * WHAT ARE CONSTANTS?
 * Constants are special variables that never change once they're set.
 * We use them instead of "magic numbers" scattered throughout our code.
 * This makes it easy to adjust game settings in one place!
 */

// === GAME IDENTITY ===
// These define what our game is called and who made it
export const GAME_TITLE = "Quantum Jumper"; // The name that appears on screen
export const GAME_VERSION = "1.0.0"; // Version number for tracking updates
export const GAME_DESCRIPTION =
  "A retro-style platformer with dimension-switching mechanics."; // Short description
export const PROGRAMMER_NAME = "<Your Name Here>"; // Replace with your name - you made this!

// === SCREEN SIZE AND GRID SYSTEM ===
// Our game uses a grid system where everything is placed on invisible squares called "tiles"
export const VIEWPORT_TILES_WIDE = 15; // How many tiles fit across the screen (15 tiles)
export const VIEWPORT_TILES_HIGH = 15; // How many tiles fit from top to bottom (15 tiles)
export const TILE_SIZE = 32; // Each tile is 32x32 pixels (this makes sprites crisp and aligned)
export const VIEWPORT_WIDTH = VIEWPORT_TILES_WIDE * TILE_SIZE; // Screen width = 15 × 32 = 480 pixels
export const VIEWPORT_HEIGHT = VIEWPORT_TILES_HIGH * TILE_SIZE; // Screen height = 15 × 32 = 480 pixels

// === PHYSICS AND MOVEMENT ===
// These numbers control how the player moves and feels to control
export const PLAYER_SPEED = 180; // How fast the player moves left/right (pixels per second)
export const JUMP_VELOCITY = 450; // How fast the player launches upward when jumping (pixels per second)
export const MIN_JUMP_VELOCITY = 200; // Minimum jump height if jump button is tapped quickly
export const GRAVITY = 800; // How fast things fall down (pixels per second squared)
export const FALL_GRAVITY = 1200; // Extra gravity when falling for snappier movement
export const AIR_CONTROL = 0.8; // How much control player has while in the air (80% of normal)
export const JUMP_BUFFER_TIME = 150; // Milliseconds - allows jump input slightly before landing
export const COYOTE_TIME = 100; // Milliseconds - allows jumping briefly after leaving a platform

// === GAME DIMENSIONS ===
// Our game has two parallel worlds: Light and Dark dimensions
// Players can switch between them to access different platforms and items
export enum Dimension {
  LIGHT = 0, // The bright, sunny dimension (yellow/blue colors)
  DARK = 1, // The mysterious, shadowy dimension (purple/black colors)
}

// === PLAYER STATES ===
// These track what the player is currently doing (for animations and game logic)
export enum JumpState {
  NONE = "none", // Player is on the ground, not jumping
  RISING = "rising", // Player is moving upward (jumping up)
  FALLING = "falling", // Player is moving downward (falling down)
}

export enum AnimationState {
  STANDING = "standing", // Player is standing still
  WALKING = "walking", // Player is moving left or right
  JUMPING = "jumping", // Player is in the air
  // FUTURE IDEAS: Add "FALLING", "LANDING", "CROUCHING", "CLIMBING" etc.
}

// === SOUND EFFECTS ===
// These define all the different sound effects our game can play
export enum SoundType {
  JUMP = "jump", // Sound when player jumps
  COIN = "coin", // Sound when collecting coins
  POWERUP = "powerup", // Sound when collecting powerups
  PORTAL = "portal", // Sound when using portals
  DIMENSION = "dimension", // Sound when switching dimensions
}

// === LEVEL MAP SYMBOLS ===
// These single characters represent different objects when creating levels from text maps
// Think of this like a legend on a treasure map - each symbol means something specific
export enum TileType {
  EMPTY = ".", // Empty space (nothing there)
  PLAYER_START = "P", // Where the player starts the level
  PLATFORM = "#", // Solid platform that player can stand on
  COIN = "C", // Generic coin (bronze, worth 1 point)
  POWERUP = "U", // Generic powerup (mushroom)
  PORTAL = "E", // Exit portal to next level

  // === SPECIFIC COIN TYPES ===
  BRONZE_COIN = "B", // Bronze coin (1 point) - easiest to get
  SILVER_COIN = "S", // Silver coin (5 points) - medium difficulty
  GOLD_COIN = "G", // Gold coin (10 points) - harder to reach
  RUBY_COIN = "R", // Ruby coin (25 points) - hidden/secret coins

  // === SPECIFIC POWERUP TYPES ===
  MUSHROOM = "M", // Makes player bigger and stronger
  ONE_UP = "1", // Gives an extra life (very valuable!)
  POISON = "X", // Dangerous - makes player lose a life
  FIRE_FLOWER = "F", // Gives temporary invincibility power
  STAR = "*", // Super jump boost (jump extra high)
  SPEED_BOOST = "T", // Temporary speed boost (T for Turbo)
}

// === SCORING SYSTEM ===
// This table shows how many points each type of coin is worth
// Higher risk coins (harder to reach) give more points!
export const COIN_VALUES: Record<string, number> = {
  [TileType.COIN]: 1, // Generic coin = 1 point
  [TileType.BRONZE_COIN]: 1, // Bronze coin = 1 point (easy to get)
  [TileType.SILVER_COIN]: 5, // Silver coin = 5 points (medium difficulty)
  [TileType.GOLD_COIN]: 10, // Gold coin = 10 points (harder to reach)
  [TileType.RUBY_COIN]: 25, // Ruby coin = 25 points (secret/hidden)
};

// === POWERUP TYPES ===
// These define all the different special powers the player can collect
export enum PowerupType {
  MUSHROOM = "mushroom", // Gives score bonus and makes player grow
  ONE_UP = "1up", // Gives an extra life (very important!)
  POISON = "poison", // Dangerous - makes player lose a life
  FIRE_FLOWER = "fire_flower", // Temporary invincibility (can't be hurt)
  STAR = "star", // Super jump boost (jump much higher)
  SPEED_BOOST = "speed_boost", // Temporary speed boost (run faster)
}

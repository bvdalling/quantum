/**
 * Game Constants
 *
 * All the core constants used throughout the Quantum Jumper game.
 *
 * Learn More: https://geeksforgeeks.org/typescript-constants/
 */

// YOU CAN EDIT THESE CONSTANTS TO CUSTOMIZE YOUR GAME!
export const GAME_TITLE = "Quantum Jumper";
export const GAME_VERSION = "1.0.0";
export const GAME_DESCRIPTION =
  "A retro-style platformer with dimension-switching mechanics.";
export const PROGRAMMER_NAME = "<Your Name Here>"; // Replace with your name

// === VIEWPORT CONSTANTS ===
export const VIEWPORT_TILES_WIDE = 15;
export const VIEWPORT_TILES_HIGH = 15;
export const TILE_SIZE = 32; // All sprites are 32x32 pixels
export const VIEWPORT_WIDTH = VIEWPORT_TILES_WIDE * TILE_SIZE; // 480 pixels
export const VIEWPORT_HEIGHT = VIEWPORT_TILES_HIGH * TILE_SIZE; // 480 pixels

// === PHYSICS CONSTANTS ===
export const PLAYER_SPEED = 180;
export const JUMP_VELOCITY = 450; // Initial jump velocity
export const MIN_JUMP_VELOCITY = 200; // Minimum jump if button released quickly
export const GRAVITY = 800;
export const FALL_GRAVITY = 1200; // Faster falling for snappier feel
export const AIR_CONTROL = 0.8; // Air movement control factor (80% of ground speed)
export const JUMP_BUFFER_TIME = 150; // ms to allow jump input before landing
export const COYOTE_TIME = 100; // ms after leaving ground where jump is still allowed

// === GAME STATES ===
export enum Dimension {
  LIGHT = 0,
  DARK = 1,
}

export enum JumpState {
  NONE = "none",
  RISING = "rising",
  FALLING = "falling",
}

export enum AnimationState {
  STANDING = "standing",
  WALKING = "walking",
  JUMPING = "jumping",
  // Idea... Add more states like "FALLING", "LANDING", etc.
}

// === SOUND TYPES ===
export enum SoundType {
  JUMP = "jump",
  COIN = "coin",
  POWERUP = "powerup",
  PORTAL = "portal",
  DIMENSION = "dimension",
}

// === TILE TYPES ===
export enum TileType {
  EMPTY = ".",
  PLAYER_START = "P",
  PLATFORM = "#",
  COIN = "C", // Generic coin (bronze)
  POWERUP = "U", // Generic powerup (mushroom)
  PORTAL = "E",
  // Specific coin types
  BRONZE_COIN = "B",
  SILVER_COIN = "S",
  GOLD_COIN = "G",
  RUBY_COIN = "R",
  // Specific powerup types
  MUSHROOM = "M",
  ONE_UP = "1",
  POISON = "X",
  FIRE_FLOWER = "F",
  STAR = "*",
  SPEED_BOOST = "T", // T for Turbo
}

// === COIN VALUES ===
export const COIN_VALUES: Record<string, number> = {
  [TileType.COIN]: 1,
  [TileType.BRONZE_COIN]: 1,
  [TileType.SILVER_COIN]: 5,
  [TileType.GOLD_COIN]: 10,
  [TileType.RUBY_COIN]: 25,
};

// === POWERUP EFFECTS ===
export enum PowerupType {
  MUSHROOM = "mushroom", // Score boost
  ONE_UP = "1up", // Extra life
  POISON = "poison", // Lose life
  FIRE_FLOWER = "fire_flower", // Temporary invincibility
  STAR = "star", // Super jump boost
  SPEED_BOOST = "speed_boost", // Temporary speed boost
}

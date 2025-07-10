/**
 * Game Constants
 *
 * All the core constants used throughout the Quantum Jumper game.
 *
 * Learn More: https://geeksforgeeks.org/typescript-constants/
 */

// === VIEWPORT CONSTANTS ===
export const VIEWPORT_TILES_WIDE = 15;
export const VIEWPORT_TILES_HIGH = 15;
export const TILE_SIZE = 32; // All sprites are 32x32 pixels
export const VIEWPORT_WIDTH = VIEWPORT_TILES_WIDE * TILE_SIZE; // 480 pixels
export const VIEWPORT_HEIGHT = VIEWPORT_TILES_HIGH * TILE_SIZE; // 480 pixels

// === PHYSICS CONSTANTS ===
export const PLAYER_SPEED = 180;
export const JUMP_VELOCITY = 400;
export const GRAVITY = 800;

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
  COIN = "C",
  POWERUP = "U",
  PORTAL = "E",
}

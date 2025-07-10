/**
 * QUANTUM JUMPER - TYPE DEFINITIONS
 *
 * This file defines the "shapes" of data that our game uses. Think of types like
 * forms you fill out - they tell the computer exactly what information to expect.
 *
 * WHAT ARE INTERFACES?
 * Interfaces are like contracts that say "this object must have these properties."
 * For example, GameState must have a score, lives, level, etc.
 *
 * WHY USE TYPES?
 * Types help catch bugs before they happen! If you try to put a string where
 * the computer expects a number, TypeScript will warn you.
 */

import {
  Dimension,
  JumpState,
  AnimationState,
  TileType,
  PowerupType,
} from "../constants";

/**
 * GameState - Tracks everything about the current game session
 * This is like the "save file" of our game - it remembers the player's progress
 */
export interface GameState {
  level: number; // What level the player is currently on (1, 2, 3, etc.)
  score: number; // Total points the player has earned
  lives: number; // How many lives the player has left (usually starts at 3)
  dimension: Dimension; // Which dimension the player is currently in (LIGHT or DARK)
  levelTransitioning: boolean; // True if we're currently changing levels
  speedBoostActive: boolean; // True if player has temporary speed boost
  jumpBoostActive: boolean; // True if player has temporary jump boost
  invincibilityActive: boolean; // True if player is temporarily invincible
  currentPlayerSpeed: number; // Current movement speed (can be boosted by powerups)
  currentJumpVelocity: number; // Current jump power (can be boosted by powerups)
}

/**
 * PlayerState - Tracks the player's current movement and animation
 * This handles the technical details of how the player moves and looks
 */
export interface PlayerState {
  jumpState: JumpState; // Is the player jumping, falling, or on ground?
  animationState: AnimationState; // What animation should be playing?
  isJumpPressed: boolean; // Is the jump button currently held down?
  jumpBufferTimer: number; // Timer for "jump buffering" (allows early jump input)
  coyoteTimer: number; // Timer for "coyote time" (allows late jump after leaving platform)
  wasOnGround: boolean; // Was the player on the ground last frame?
}

/**
 * CollectibleData - Information about coins and other collectible items
 * Used when building levels from text maps
 */
export interface CollectibleData {
  mapRow: number; // Which row in the text map this item is on
  mapCol: number; // Which column in the text map this item is on
  tileType: TileType; // What type of collectible this is (bronze coin, silver coin, etc.)
}

/**
 * PowerupData - Information about powerup items that give special abilities
 * Used when building levels from text maps
 */
export interface PowerupData {
  mapRow: number; // Which row in the text map this powerup is on
  mapCol: number; // Which column in the text map this powerup is on
  tileType: TileType; // What symbol represents this in the text map
  powerupType: PowerupType; // What type of powerup this is (mushroom, 1-up, etc.)
}

/**
 * MobileInput - For future mobile device support
 * This would handle touch controls on phones and tablets
 */
export interface MobileInput {
  left: boolean; // Is the left arrow button being touched?
  right: boolean; // Is the right arrow button being touched?
  jump: boolean; // Is the jump button being touched?
}

/**
 * AudioConfig - Settings for generating retro-style sound effects
 * Our game generates sounds using math instead of audio files
 */
export interface AudioConfig {
  frequency?: number; // How high or low the sound is (Hz - higher = more squeaky)
  duration?: number; // How long the sound lasts (milliseconds)
  volume?: number; // How loud the sound is (0.0 = silent, 1.0 = loudest)
}

/**
 * LevelBounds - Defines the size of a game level
 * This tells us how big the level is in tiles (not pixels)
 */
export interface LevelBounds {
  width: number; // How many tiles wide the level is
  height: number; // How many tiles tall the level is
}

/**
 * Type definitions for the Quantum Jumper game
 */

import {
  Dimension,
  JumpState,
  AnimationState,
  TileType,
  PowerupType,
} from "../constants";

export interface GameState {
  level: number;
  score: number;
  lives: number;
  dimension: Dimension;
  levelTransitioning: boolean;
  speedBoostActive: boolean;
  jumpBoostActive: boolean;
  invincibilityActive: boolean;
  currentPlayerSpeed: number;
  currentJumpVelocity: number;
}

export interface PlayerState {
  jumpState: JumpState;
  animationState: AnimationState;
  isJumpPressed: boolean;
  jumpBufferTimer: number;
  coyoteTimer: number;
  wasOnGround: boolean;
}

export interface CollectibleData {
  mapRow: number;
  mapCol: number;
  tileType: TileType;
}

export interface PowerupData {
  mapRow: number;
  mapCol: number;
  tileType: TileType;
  powerupType: PowerupType;
}

export interface MobileInput {
  left: boolean;
  right: boolean;
}

export interface AudioConfig {
  frequency?: number;
  duration?: number;
  volume?: number;
}

export interface LevelBounds {
  width: number;
  height: number;
}

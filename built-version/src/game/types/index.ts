/**
 * Type definitions for the Quantum Jumper game
 */

import { Dimension, JumpState, AnimationState } from "../constants";

export interface GameState {
  level: number;
  score: number;
  lives: number;
  dimension: Dimension;
  levelTransitioning: boolean;
  speedBoostActive: boolean;
  jumpBoostActive: boolean;
  currentPlayerSpeed: number;
  currentJumpVelocity: number;
}

export interface PlayerState {
  jumpState: JumpState;
  animationState: AnimationState;
}

export interface CollectibleData {
  mapRow: number;
  mapCol: number;
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

/**
 * Game Builder - Simple API for creating Quantum Jumper games
 *
 * This hides all the complex Phaser setup and provides a beginner-friendly interface
 */

import Phaser from "phaser";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, GRAVITY } from "../constants";
import { StartScreenScene } from "../scenes/StartScreenScene";
import { LoadingScene } from "../scenes/LoadingScene";
import { QuantumJumperScene } from "../scenes/Levels/Level1";
import { Level2Scene } from "../scenes/Levels/Level2";

export class GameBuilder {
  private config: Phaser.Types.Core.GameConfig;

  constructor() {
    // Set up sensible defaults that beginners don't need to worry about
    this.config = {
      type: Phaser.AUTO,
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      parent: "game-container",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: GRAVITY },
          debug: false,
        },
      },
      scene: [StartScreenScene, LoadingScene, QuantumJumperScene, Level2Scene],
      backgroundColor: "#87CEEB",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      render: {
        antialias: false,
        pixelArt: true,
      },
    };
  }

  /**
   * Enable debug mode to see collision boxes and physics info
   */
  withDebugMode(): GameBuilder {
    if (this.config.physics?.arcade) {
      this.config.physics.arcade.debug = true;
    }
    return this;
  }

  /**
   * Change the game's background color
   * @param color - Hex color string like "#FF0000" or color name
   */
  withBackgroundColor(color: string): GameBuilder {
    this.config.backgroundColor = color;
    return this;
  }

  /**
   * Set custom gravity (higher = falls faster)
   * @param gravity - Gravity strength (default: 800)
   */
  withGravity(gravity: number): GameBuilder {
    if (this.config.physics?.arcade) {
      this.config.physics.arcade.gravity = { y: gravity };
    }
    return this;
  }

  /**
   * Set the HTML container where the game will appear
   * @param containerId - ID of the HTML element (default: "game-container")
   */
  withContainer(containerId: string): GameBuilder {
    this.config.parent = containerId;
    return this;
  }

  /**
   * Create and start the game
   * @returns The Phaser game instance
   */
  build(): Phaser.Game {
    const game = new Phaser.Game(this.config);

    // Handle window resize automatically
    window.addEventListener("resize", () => {
      game.scale.refresh();
    });

    return game;
  }
}

/**
 * Quick start method for beginners - creates a game with default settings
 */
export function createQuantumJumperGame(): Phaser.Game {
  return new GameBuilder().build();
}

/**
 * Easy debug mode for development
 */
export function createDebugGame(): Phaser.Game {
  return new GameBuilder()
    .withDebugMode()
    .withBackgroundColor("#444444")
    .build();
}

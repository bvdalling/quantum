/**
 * Quantum Jumper - Main Entry Point
 *
 * Initializes and starts the Phaser 3 game
 */

import Phaser from "phaser";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, GRAVITY } from "./game/constants";
import { QuantumJumperScene } from "./game/scenes/QuantumJumperScene";

// Phaser game configuration
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: VIEWPORT_WIDTH, // 480 pixels (15x32)
  height: VIEWPORT_HEIGHT, // 480 pixels (15x32)
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: GRAVITY },
      debug: false,
    },
  },
  scene: QuantumJumperScene,
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

// Create and start the game
const game = new Phaser.Game(config);

// Handle window resize
window.addEventListener("resize", () => {
  game.scale.refresh();
});

export default game;

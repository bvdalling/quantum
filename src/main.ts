/**
 * QUANTUM JUMPER - MAIN ENTRY POINT
 *
 * Welcome to the main entry point of Quantum Jumper! This file is like the
 * "power button" for your game - when you run the game, this is the first
 * code that executes.
 *
 * WHAT HAPPENS HERE:
 * 1. We import (bring in) the game creation function
 * 2. We create the game with default settings
 * 3. We export it so the browser can display it
 *
 * FOR BEGINNERS:
 * You probably don't need to edit this file. If you want to customize
 * the game, look at these files instead:
 *
 * 📁 LEVEL DESIGN:
 * - src/game/scenes/QuantumJumperScene.ts (main level creation)
 * - src/game/examples/StepByStepLevelExamples.ts (example levels)
 *
 * ⚙️ GAME SETTINGS:
 * - src/game/utils/GameSettings.ts (difficulty, speeds, etc.)
 * - src/game/constants.ts (core game values)
 *
 * 🎨 GRAPHICS & SOUNDS:
 * - src/game/utils/TextureGenerator.ts (game graphics)
 * - src/game/utils/AudioSystem.ts (sound effects)
 *
 * PROGRAMMING CONCEPTS EXPLAINED:
 *
 * "import" = Bring in code from another file
 * Think of it like borrowing tools from a friend's toolbox
 *
 * "const" = Create a constant variable (its value won't change)
 * Think of it like putting a label on a box that won't be changed
 *
 * "export default" = Share this with other files
 * Think of it like putting your creation on display for others to see
 */

// Import the game creation function from our game builder
// This function knows how to set up the entire game with all its systems
import { createQuantumJumperGame } from "./game/utils/GameBuilder";

// Create the game with sensible default settings
// This sets up:
// - The game window (480x480 pixels)
// - Physics system (gravity, collisions)
// - Input system (keyboard controls)
// - Graphics renderer (draws everything on screen)
// - Scene management (different screens/levels)
// - Audio system (sound effects)
const game = createQuantumJumperGame();

// Export the game so the browser can display it
// This is what actually makes the game appear on your web page
export default game;

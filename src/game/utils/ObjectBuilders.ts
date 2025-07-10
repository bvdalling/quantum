/**
 * QUANTUM JUMPER - OBJECT BUILDERS COLLECTION
 *
 * This file brings together all our fluent builder classes in one convenient place.
 * Think of this as an "import hub" where we collect all our building tools.
 *
 * WHAT ARE BUILDERS?
 * Builders are special classes that make it easy to create game objects using
 * simple, readable code. Instead of complex constructor calls, you get methods
 * that read like English sentences.
 *
 * FLUENT API EXAMPLES:
 *
 * Creating a player:
 * createPlayer(scene)
 *   .withLives(3)
 *   .withScore(100)
 *   .atPosition(5, 10)
 *   .build();
 *
 * Creating a platform:
 * createPlatform(scene, group)
 *   .atCoords(8, 12)
 *   .withCollider()
 *   .setSolid()
 *   .setDimension("light")
 *   .build();
 *
 * Creating a coin:
 * createCoin(scene, group)
 *   .atCoords(10, 8)
 *   .withTexture("gold-coin")
 *   .animated()
 *   .setDimension("dark")
 *   .build();
 *
 * Creating a powerup:
 * createPowerup(scene, group)
 *   .atCoords(15, 10)
 *   .ofType("mushroom")
 *   .animated()
 *   .setDimension("both")
 *   .build();
 *
 * Creating a portal:
 * createPortal(scene)
 *   .atCoords(20, 12)
 *   .withParticles()
 *   .goesToNextLevel()
 *   .setDimension("both")
 *   .build();
 *
 * WHY USE THIS PATTERN?
 * - Easy to read and understand
 * - Hard to make mistakes
 * - Consistent across all object types
 * - Great for beginners learning game development
 */

// === BUILDER CLASS EXPORTS ===
// Import and re-export all our builder classes so they can be used together
export { PlayerBuilder, createPlayer } from "./PlayerBuilder"; // For creating player characters
export { PlatformBuilder, createPlatform } from "./PlatformBuilder"; // For creating platforms to jump on
export { CoinBuilder, createCoin } from "./CoinBuilder"; // For creating collectible coins
export { PowerupBuilder, createPowerup } from "./PowerupBuilder"; // For creating special powerup items
export { PortalBuilder, createPortal } from "./PortalBuilder"; // For creating level exit portals

// === TYPE AND CONSTANT EXPORTS ===
// Re-export useful types and constants for convenience
export type { CollectibleData } from "../types"; // Type for coin/collectible data
export { TileType, COIN_VALUES, Dimension } from "../constants"; // Enums and values for game objects

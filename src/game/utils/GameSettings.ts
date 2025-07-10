/**
 * Game Settings - Easy configuration for beginners
 *
 * Provides simple methods to customize game behavior without touching complex constants
 */

export class GameSettings {
  // Player Settings
  static playerSpeed: number = 180;
  static jumpHeight: number = 400;
  static jumpBoostHeight: number = 500;
  static speedBoostSpeed: number = 280;

  // Physics Settings
  static gravity: number = 800;
  static lowGravity: number = 600;
  static highGravity: number = 1000;

  // Game Balance
  static startingLives: number = 3;
  static coinValues = {
    bronze: 1,
    silver: 5,
    gold: 10,
    ruby: 25,
  };

  // Power-up Durations (in milliseconds)
  static powerupDurations = {
    invincibility: 8000, // Fire flower
    speedBoost: 8000, // Speed boost
    jumpBoost: 10000, // Star power
  };

  // Visual Settings
  static backgroundColor: string = "#87CEEB";
  static viewportSize = { width: 480, height: 480 };
  static tileSize: number = 32;

  /**
   * Make the player move faster
   * @param speed - New movement speed (default: 180)
   */
  static setPlayerSpeed(speed: number): void {
    this.playerSpeed = speed;
  }

  /**
   * Change how high the player can jump
   * @param height - Jump velocity (default: 400, higher = jumps higher)
   */
  static setJumpHeight(height: number): void {
    this.jumpHeight = height;
  }

  /**
   * Change how fast things fall
   * @param gravity - Gravity strength (default: 800, higher = falls faster)
   */
  static setGravity(gravity: number): void {
    this.gravity = gravity;
  }

  /**
   * Set how many lives the player starts with
   * @param lives - Number of starting lives (default: 3)
   */
  static setStartingLives(lives: number): void {
    this.startingLives = lives;
  }

  /**
   * Change coin values
   * @param bronze - Points for bronze coins (default: 1)
   * @param silver - Points for silver coins (default: 5)
   * @param gold - Points for gold coins (default: 10)
   * @param ruby - Points for ruby coins (default: 25)
   */
  static setCoinValues(
    bronze: number = 1,
    silver: number = 5,
    gold: number = 10,
    ruby: number = 25
  ): void {
    this.coinValues = { bronze, silver, gold, ruby };
  }

  /**
   * Make the game easier for beginners
   */
  static makeEasier(): void {
    this.setPlayerSpeed(200); // Faster movement
    this.setJumpHeight(450); // Higher jumps
    this.setGravity(700); // Less gravity
    this.setStartingLives(5); // More lives
    this.powerupDurations.invincibility = 12000; // Longer power-ups
    this.powerupDurations.speedBoost = 12000;
    this.powerupDurations.jumpBoost = 15000;
  }

  /**
   * Make the game harder for experienced players
   */
  static makeHarder(): void {
    this.setPlayerSpeed(160); // Slower movement
    this.setJumpHeight(350); // Lower jumps
    this.setGravity(900); // More gravity
    this.setStartingLives(1); // Fewer lives
    this.powerupDurations.invincibility = 5000; // Shorter power-ups
    this.powerupDurations.speedBoost = 5000;
    this.powerupDurations.jumpBoost = 6000;
  }

  /**
   * Reset all settings to default values
   */
  static resetToDefaults(): void {
    this.playerSpeed = 180;
    this.jumpHeight = 400;
    this.gravity = 800;
    this.startingLives = 3;
    this.coinValues = { bronze: 1, silver: 5, gold: 10, ruby: 25 };
    this.powerupDurations = {
      invincibility: 8000,
      speedBoost: 8000,
      jumpBoost: 10000,
    };
  }

  /**
   * Get current settings as a readable object
   */
  static getSettings() {
    return {
      player: {
        speed: this.playerSpeed,
        jumpHeight: this.jumpHeight,
        startingLives: this.startingLives,
      },
      physics: {
        gravity: this.gravity,
      },
      scoring: {
        coinValues: this.coinValues,
      },
      powerups: {
        durations: this.powerupDurations,
      },
    };
  }
}

/**
 * Quick presets for common difficulty levels
 */
export const DifficultyPresets = {
  /**
   * Perfect for kids and new players
   */
  Beginner: () => GameSettings.makeEasier(),

  /**
   * Standard Mario-like difficulty
   */
  Normal: () => GameSettings.resetToDefaults(),

  /**
   * Challenge for experienced players
   */
  Hard: () => GameSettings.makeHarder(),

  /**
   * Custom difficulty
   */
  Custom: (settings: {
    playerSpeed?: number;
    jumpHeight?: number;
    gravity?: number;
    lives?: number;
  }) => {
    if (settings.playerSpeed) GameSettings.setPlayerSpeed(settings.playerSpeed);
    if (settings.jumpHeight) GameSettings.setJumpHeight(settings.jumpHeight);
    if (settings.gravity) GameSettings.setGravity(settings.gravity);
    if (settings.lives) GameSettings.setStartingLives(settings.lives);
  },
};

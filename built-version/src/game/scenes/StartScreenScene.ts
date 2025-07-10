/**
 * Start Screen Scene
 *
 * Displays the game title, instructions, and allows player to start the game
 */

import Phaser from "phaser";
import {
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  PROGRAMMER_NAME,
  GAME_TITLE,
  GAME_DESCRIPTION,
  GAME_VERSION,
} from "../constants";

export class StartScreenScene extends Phaser.Scene {
  private startText!: Phaser.GameObjects.Text;
  private titleText!: Phaser.GameObjects.Text;
  private instructionsText!: Phaser.GameObjects.Text;
  private creditsText!: Phaser.GameObjects.Text;
  private background!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: "StartScreenScene" });
  }

  preload(): void {
    // No assets to preload for start screen
  }

  create(): void {
    this.createBackground();
    this.createTexts();
    this.setupInput();
    this.createAnimations();
  }

  private createBackground(): void {
    // Create a gradient-like background using multiple rectangles
    this.background = this.add.rectangle(
      VIEWPORT_WIDTH / 2,
      VIEWPORT_HEIGHT / 2,
      VIEWPORT_WIDTH,
      VIEWPORT_HEIGHT,
      0x1a1a2e
    );

    // Add some floating particles for visual appeal
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, VIEWPORT_WIDTH);
      const y = Phaser.Math.Between(0, VIEWPORT_HEIGHT);
      const particle = this.add.circle(x, y, 2, 0x4a90e2, 0.6);

      // Animate particles floating up
      this.tweens.add({
        targets: particle,
        y: y - 100,
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        yoyo: false,
        onComplete: () => {
          particle.y = VIEWPORT_HEIGHT + 10;
          particle.alpha = 0.6;
        },
      });
    }
  }

  private createTexts(): void {
    // Main title
    this.titleText = this.add
      .text(VIEWPORT_WIDTH / 2, 100, GAME_TITLE, {
        fontSize: "36px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#4a90e2",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(VIEWPORT_WIDTH / 2, 140, GAME_DESCRIPTION, {
        fontSize: "16px",
        fontFamily: "Arial",
        color: "#87ceeb",
        fontStyle: "italic",
      })
      .setOrigin(0.5);

    // Instructions
    this.instructionsText = this.add
      .text(
        VIEWPORT_WIDTH / 2,
        210,
        "• ARROW KEYS or WASD - Move and Jump\n" +
          "• SPACEBAR - Switch Dimensions\n" +
          "• Collect coins and powerups\n" +
          "• Reach the green portal to advance\n" +
          "• Avoid falling off the world!",
        {
          fontSize: "14px",
          fontFamily: "Arial",
          color: "#ffffff",
          align: "center",
          lineSpacing: 5,
        }
      )
      .setOrigin(0.5);

    // Start instruction (blinking)
    this.startText = this.add
      .text(VIEWPORT_WIDTH / 2, 350, "Press ENTER or SPACE to Start", {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Credits
    this.creditsText = this.add
      .text(VIEWPORT_WIDTH / 2, 420, "Built by " + PROGRAMMER_NAME, {
        fontSize: "12px",
        fontFamily: "Arial",
        color: "#888888",
      })
      .setOrigin(0.5);

    // Version
    this.add
      .text(VIEWPORT_WIDTH / 2, 440, "Version: " + GAME_VERSION, {
        fontSize: "12px",
        fontFamily: "Arial",
        color: "#888888",
      })
      .setOrigin(0.5);
  }

  private setupInput(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.spaceKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.enterKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    // Handle click/touch input
    this.input.on("pointerdown", this.startGame, this);
  }

  private createAnimations(): void {
    // Make title text pulse
    this.tweens.add({
      targets: this.titleText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Make start text blink
    this.tweens.add({
      targets: this.startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Power2",
    });
  }

  update(): void {
    // Check for input to start game
    if (
      Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
      Phaser.Input.Keyboard.JustDown(this.enterKey)
    ) {
      this.startGame();
    }
  }

  private startGame(): void {
    // Add a nice transition effect
    this.cameras.main.fadeOut(500, 0, 0, 0);

    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("LoadingScene", {
        level: 1,
        isInitialLoad: true,
      });
    });
  }
}

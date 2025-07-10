/**
 * Loading Scene
 *
 * Pre-bakes level data and assets for smooth gameplay
 */

import Phaser from "phaser";
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, TileType } from "../constants";
import { LEVEL_MAPS } from "../data/levelMaps";
import { TextureGenerator } from "../utils/TextureGenerator";

export class LoadingScene extends Phaser.Scene {
  private loadingText!: Phaser.GameObjects.Text;
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBarBg!: Phaser.GameObjects.Graphics;
  private textureGenerator!: TextureGenerator;
  private loadingSteps: string[] = [];
  private currentStep: number = 0;
  private targetLevel: number = 1;
  private isInitialLoad: boolean = true;

  constructor() {
    super({ key: "LoadingScene" });
  }

  init(data: { level?: number; isInitialLoad?: boolean }): void {
    this.targetLevel = data.level || 1;
    this.isInitialLoad = data.isInitialLoad !== false;
  }

  preload(): void {
    this.createLoadingUI();
    this.setupLoadingSteps();

    // Initialize texture generator and load all assets
    this.textureGenerator = new TextureGenerator(this);
    this.textureGenerator.loadAllTextures();

    // Set up loading progress events
    this.load.on("progress", this.updateProgress, this);
    this.load.on("complete", this.onLoadComplete, this);
  }

  private createLoadingUI(): void {
    // Background
    this.add.rectangle(
      VIEWPORT_WIDTH / 2,
      VIEWPORT_HEIGHT / 2,
      VIEWPORT_WIDTH,
      VIEWPORT_HEIGHT,
      0x000000
    );

    // Loading title
    const title = this.isInitialLoad
      ? "LOADING QUANTUM JUMPER"
      : `LOADING LEVEL ${this.targetLevel}`;

    this.add
      .text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2 - 100, title, {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Progress bar background
    this.progressBarBg = this.add.graphics();
    this.progressBarBg.fillStyle(0x333333);
    this.progressBarBg.fillRect(
      VIEWPORT_WIDTH / 2 - 150,
      VIEWPORT_HEIGHT / 2,
      300,
      20
    );

    // Progress bar
    this.progressBar = this.add.graphics();

    // Loading status text
    this.loadingText = this.add
      .text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2 + 50, "Initializing...", {
        fontSize: "16px",
        fontFamily: "Arial",
        color: "#87ceeb",
      })
      .setOrigin(0.5);

    // Spinning loader animation
    const spinner = this.add
      .text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2 + 100, "⟳", {
        fontSize: "32px",
        fontFamily: "Arial",
        color: "#4a90e2",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: spinner,
      rotation: Math.PI * 2,
      duration: 1000,
      repeat: -1,
      ease: "Linear",
    });
  }

  private setupLoadingSteps(): void {
    if (this.isInitialLoad) {
      this.loadingSteps = [
        "Loading textures...",
        "Creating animations...",
        "Pre-baking level 1...",
        "Pre-baking level 2...",
        "Pre-baking level 3...",
        "Initializing physics...",
        "Setting up audio...",
        "Ready to play!",
      ];
    } else {
      this.loadingSteps = [
        `Preparing level ${this.targetLevel}...`,
        "Optimizing tile layout...",
        "Setting up collectibles...",
        "Initializing physics...",
        "Level ready!",
      ];
    }
  }

  private updateProgress(progress: number): void {
    // Update progress bar
    this.progressBar.clear();
    this.progressBar.fillStyle(0x4a90e2);
    this.progressBar.fillRect(
      VIEWPORT_WIDTH / 2 - 150,
      VIEWPORT_HEIGHT / 2,
      300 * progress,
      20
    );

    // Update loading text based on progress
    const stepIndex = Math.floor(progress * this.loadingSteps.length);
    if (
      stepIndex < this.loadingSteps.length &&
      stepIndex !== this.currentStep
    ) {
      this.currentStep = stepIndex;
      this.loadingText.setText(this.loadingSteps[stepIndex]);
    }
  }

  private onLoadComplete(): void {
    if (this.isInitialLoad) {
      // Create procedural textures and animations only on initial load
      this.textureGenerator.createProceduralTextures();
      this.textureGenerator.createPlayerAnimations();

      // Pre-bake all levels on initial load
      this.prebakeLevels();
    } else {
      // For level transitions, just pre-bake the specific level
      this.prebakeSpecificLevel(this.targetLevel);
    }

    // // Final loading step
    // const finalMessage = this.isInitialLoad ? "Ready to play!" : "Level ready!";
    // this.loadingText.setText(finalMessage);

    // Wait a moment then transition to game
    this.time.delayedCall(800, () => {
      this.transitionToGame();
    });
  }

  private prebakeLevels(): void {
    // Pre-process level data to optimize runtime performance
    for (let levelIndex = 0; levelIndex < LEVEL_MAPS.length; levelIndex++) {
      const [lightMap, darkMap] = LEVEL_MAPS[levelIndex];

      // Pre-validate level data
      this.validateLevelMap(lightMap, `Level ${levelIndex + 1} Light`);
      this.validateLevelMap(darkMap, `Level ${levelIndex + 1} Dark`);

      // Cache tile positions for faster level generation
      this.cacheTilePositions(lightMap, `level_${levelIndex}_light`);
      this.cacheTilePositions(darkMap, `level_${levelIndex}_dark`);
    }
  }

  private prebakeSpecificLevel(levelIndex: number): void {
    if (levelIndex - 1 < 0 || levelIndex - 1 >= LEVEL_MAPS.length) {
      console.warn(`Invalid level index: ${levelIndex}`);
      return;
    }

    const [lightMap, darkMap] = LEVEL_MAPS[levelIndex - 1];

    // Pre-validate level data
    this.validateLevelMap(lightMap, `Level ${levelIndex} Light`);
    this.validateLevelMap(darkMap, `Level ${levelIndex} Dark`);

    // Cache tile positions for faster level generation
    this.cacheTilePositions(lightMap, `level_${levelIndex - 1}_light`);
    this.cacheTilePositions(darkMap, `level_${levelIndex - 1}_dark`);
  }

  private validateLevelMap(map: string[], mapName: string): void {
    let hasPlayer = false;
    let hasPortal = false;

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const tile = map[row][col] as TileType;

        if (tile === TileType.PLAYER_START) {
          hasPlayer = true;
        } else if (tile === TileType.PORTAL) {
          hasPortal = true;
        }
      }
    }

    if (!hasPlayer) {
      console.warn(`${mapName}: No player start position found`);
    }
    if (!hasPortal) {
      console.warn(`${mapName}: No exit portal found`);
    }
  }

  private cacheTilePositions(map: string[], cacheKey: string): void {
    const tileCache = {
      platforms: [] as { x: number; y: number }[],
      collectibles: [] as { x: number; y: number; type: TileType }[],
      powerups: [] as { x: number; y: number; type: TileType }[],
      player: null as { x: number; y: number } | null,
      portal: null as { x: number; y: number } | null,
    };

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const tile = map[row][col] as TileType;
        const x = col * 32 + 16; // Center of tile
        const y = row * 32 + 16;

        switch (tile) {
          case TileType.PLATFORM:
            tileCache.platforms.push({ x, y });
            break;
          case TileType.PLAYER_START:
            tileCache.player = { x, y };
            break;
          case TileType.PORTAL:
            tileCache.portal = { x, y };
            break;
          default:
            if (TextureGenerator.isCoinType(tile)) {
              tileCache.collectibles.push({ x, y, type: tile });
            } else if (TextureGenerator.isPowerupType(tile)) {
              tileCache.powerups.push({ x, y, type: tile });
            }
            break;
        }
      }
    }

    // Store in registry for quick access during gameplay
    this.registry.set(cacheKey, tileCache);
  }

  private transitionToGame(): void {
    // Fade out and start the main game scene
    this.cameras.main.fadeOut(500, 0, 0, 0);

    this.cameras.main.once("camerafadeoutcomplete", () => {
      // Pass level data to the game scene
      this.scene.start("QuantumJumperScene", {
        level: this.targetLevel,
        isFromLoading: true,
      });
    });
  }
}

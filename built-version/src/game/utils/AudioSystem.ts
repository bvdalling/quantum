/**
 * Audio System
 *
 * Handles all sound generation using the Web Audio API
 */

import { SoundType } from "../constants";
import type { AudioConfig } from "../types";

export class AudioSystem {
  private audioContext: AudioContext | null = null;
  private audioInitialized = false;

  constructor() {
    this.setupAudio();
  }

  private setupAudio(): void {
    // Audio context will be initialized on first user interaction
    document.addEventListener("pointerdown", () => this.initializeAudio(), {
      once: true,
    });
    document.addEventListener("keydown", () => this.initializeAudio(), {
      once: true,
    });
  }

  private initializeAudio(): void {
    if (this.audioInitialized) return;

    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.audioInitialized = true;
      console.log("Audio initialized successfully! 🔊");
    } catch (error) {
      console.warn("Audio not supported:", error);
    }
  }

  /**
   * Play a sound effect
   */
  playSound(type: SoundType, config: AudioConfig = {}): void {
    if (!this.audioContext) return;

    let { frequency = 440, duration = 0.2, volume = 0.1 } = config;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configure sound based on type (may modify duration and volume)
      const updatedConfig = this.configureSoundType(oscillator, type, {
        frequency,
        duration,
        volume,
      });
      duration = updatedConfig.duration!;
      volume = updatedConfig.volume!;

      // Volume envelope
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        volume,
        this.audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + duration
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn("Error playing sound:", error);
    }
  }

  private configureSoundType(
    oscillator: OscillatorNode,
    type: SoundType,
    config: Required<AudioConfig>
  ): Required<AudioConfig> {
    const currentTime = this.audioContext!.currentTime;
    let { frequency, duration, volume } = config;

    switch (type) {
      case SoundType.JUMP:
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(300, currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          500,
          currentTime + 0.1
        );
        break;

      case SoundType.COIN:
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(523, currentTime); // C5
        oscillator.frequency.setValueAtTime(659, currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(784, currentTime + 0.2); // G5
        break;

      case SoundType.POWERUP:
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(200, currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          800,
          currentTime + 0.3
        );
        duration = 0.4;
        volume = 0.15;
        break;

      case SoundType.PORTAL:
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(100, currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          1000,
          currentTime + 0.5
        );
        duration = 0.6;
        volume = 0.12;
        break;

      case SoundType.DIMENSION:
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(880, currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          220,
          currentTime + 0.3
        );
        duration = 0.4;
        volume = 0.08;
        break;

      default:
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, currentTime);
    }

    return { frequency, duration, volume };
  }
}

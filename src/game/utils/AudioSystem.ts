/**
 * QUANTUM JUMPER - AUDIO SYSTEM
 *
 * This system creates all the retro-style sound effects for our game!
 * Instead of loading audio files, we generate sounds using math and the Web Audio API.
 * This keeps our game lightweight and gives it that classic 8-bit feel.
 *
 * HOW IT WORKS:
 * - We create "oscillators" (sound generators) that make pure tones
 * - We shape these tones with different wave types (sine, square, sawtooth)
 * - We change the frequency (pitch) and volume over time to create effects
 * - Each sound type (jump, coin, etc.) has its own unique pattern
 *
 * BEGINNER TIP: You can customize the sounds by changing the frequencies
 * and durations in the configureSoundType method!
 */

import { SoundType } from "../constants";
import type { AudioConfig } from "../types";

export class AudioSystem {
  private audioContext: AudioContext | null = null; // The Web Audio API context
  private audioInitialized = false; // Track if audio is ready to use

  constructor() {
    this.setupAudio(); // Set up audio system when created
  }

  /**
   * Set up audio initialization listeners
   * Modern browsers require user interaction before audio can play
   */
  private setupAudio(): void {
    // Wait for user to click or press a key before initializing audio
    // This is required by modern browsers to prevent auto-playing sounds
    document.addEventListener("pointerdown", () => this.initializeAudio(), {
      once: true, // Only run this once
    });
    document.addEventListener("keydown", () => this.initializeAudio(), {
      once: true, // Only run this once
    });
  }

  /**
   * Initialize the Web Audio API context
   * This sets up the "sound factory" that creates all our audio
   */
  private initializeAudio(): void {
    // Don't initialize twice
    if (this.audioInitialized) return;

    try {
      // Create the audio context (works in different browsers)
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.audioInitialized = true;
      console.log("Audio initialized successfully! 🔊");
    } catch (error) {
      console.warn("Audio not supported:", error);
    }
  }

  /**
   * Play a retro-style sound effect
   * @param type - What kind of sound to play (jump, coin, powerup, etc.)
   * @param config - Optional custom settings (frequency, duration, volume)
   */
  playSound(type: SoundType, config: AudioConfig = {}): void {
    // Can't play sounds if audio isn't ready
    if (!this.audioContext) return;

    // Set default values if not provided
    let { frequency = 440, duration = 0.2, volume = 0.1 } = config;

    try {
      // Create the sound generator (oscillator)
      const oscillator = this.audioContext.createOscillator();
      // Create the volume controller (gain node)
      const gainNode = this.audioContext.createGain();

      // Connect oscillator → volume control → speakers
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configure the sound based on its type (jump, coin, etc.)
      // This may modify the duration and volume settings
      const updatedConfig = this.configureSoundType(oscillator, type, {
        frequency,
        duration,
        volume,
      });
      duration = updatedConfig.duration!;
      volume = updatedConfig.volume!;

      // Create a smooth volume envelope (fade in and out)
      // This prevents annoying "clicks" and sounds more natural
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime); // Start silent
      gainNode.gain.linearRampToValueAtTime(
        volume,
        this.audioContext.currentTime + 0.01 // Quick fade in
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + duration // Gradual fade out
      );

      // Start and stop the sound
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn("Error playing sound:", error);
    }
  }

  /**
   * Configure the oscillator based on the sound type
   * Each sound type has a unique "recipe" of frequencies and wave shapes
   * This is where we create the character of each sound effect!
   */
  private configureSoundType(
    oscillator: OscillatorNode,
    type: SoundType,
    config: Required<AudioConfig>
  ): Required<AudioConfig> {
    const currentTime = this.audioContext!.currentTime;
    let { frequency, duration, volume } = config;

    switch (type) {
      case SoundType.JUMP:
        // Jump sound: Quick upward "boing" sound
        oscillator.type = "square"; // Square wave = classic 8-bit sound
        oscillator.frequency.setValueAtTime(300, currentTime); // Start low
        oscillator.frequency.exponentialRampToValueAtTime(
          500, // End higher (upward sound)
          currentTime + 0.1
        );
        break;

      case SoundType.COIN:
        // Coin sound: Pleasant musical chime (like Mario coins!)
        oscillator.type = "sine"; // Sine wave = pure, musical tone
        oscillator.frequency.setValueAtTime(523, currentTime); // C5 note
        oscillator.frequency.setValueAtTime(659, currentTime + 0.1); // E5 note
        oscillator.frequency.setValueAtTime(784, currentTime + 0.2); // G5 note
        break;

      case SoundType.POWERUP:
        // Powerup sound: Rising "power up" sweep
        oscillator.type = "sawtooth"; // Sawtooth = buzzy, energetic sound
        oscillator.frequency.setValueAtTime(200, currentTime); // Start low
        oscillator.frequency.exponentialRampToValueAtTime(
          800, // Sweep up high
          currentTime + 0.3
        );
        duration = 0.4; // Longer duration for dramatic effect
        volume = 0.15; // Slightly louder
        break;

      case SoundType.PORTAL:
        // Portal sound: Mystical "whoosh" effect
        oscillator.type = "sine"; // Sine wave = smooth, otherworldly
        oscillator.frequency.setValueAtTime(100, currentTime); // Start very low
        oscillator.frequency.exponentialRampToValueAtTime(
          1000, // Sweep way up high
          currentTime + 0.5
        );
        duration = 0.6; // Long duration for magical effect
        volume = 0.12; // Medium volume
        break;

      case SoundType.DIMENSION:
        // Dimension switch sound: Mysterious "warp" effect
        oscillator.type = "triangle"; // Triangle wave = mellow but distinctive
        oscillator.frequency.setValueAtTime(880, currentTime); // Start high
        oscillator.frequency.exponentialRampToValueAtTime(
          220, // Drop down low (like shifting reality)
          currentTime + 0.3
        );
        duration = 0.4; // Medium duration
        volume = 0.08; // Quieter (subtle effect)
        break;

      default:
        // Fallback for unknown sound types
        oscillator.type = "sine"; // Simple sine wave
        oscillator.frequency.setValueAtTime(frequency, currentTime); // Use provided frequency
    }

    return { frequency, duration, volume }; // Return the final settings
  }
}

# Copilot Instructions for Quantum Jumper

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Phaser 3 game called "Quantum Jumper" built with Vite and TypeScript. It's a platformer game with dimension-shifting mechanics.

## Code Style and Patterns

- Use TypeScript with strict type checking
- Follow Phaser 3 best practices for game development
- Use ES6+ features and modules
- Prefer composition over inheritance for game objects
- Use descriptive variable and function names for beginners
- Include comprehensive comments explaining game mechanics

## Phaser 3 Specific Guidelines

- Use Phaser 3.70.0 APIs and patterns
- Organize scenes into separate TypeScript classes
- Use Phaser's built-in physics system (Arcade Physics)
- Implement proper asset loading in preload methods
- Use Phaser's event system for game state management
- Follow Phaser's lifecycle methods (preload, create, update)

## Game-Specific Context

- This is a dual-dimension platformer (light/dark dimensions)
- Features include: player movement, collectibles, powerups, portals
- Uses a tile-based level system with text-based map data
- Implements an anti-farming system to prevent infinite collectible farming
- Sound system uses Web Audio API for retro-style sound effects
- Viewport is fixed at 480x480 pixels (15x15 tiles of 32x32 each)

## Architecture Preferences

- Separate game logic into modular TypeScript files
- Use interfaces for game objects and configurations
- Implement proper error handling and validation
- Use enums for game states and constants
- Create reusable utility functions for common operations

# Installation Guide - Quantum Jumper

Welcome to the Quantum Jumper installation guide! This document will walk you through everything you need to set up the game development environment and run Quantum Jumper on your computer.

## Table of Contents

1. [Complete Beginner Setup](#complete-beginner-setup)
2. [Installing Node.js and npm](#installing-nodejs-and-npm)
3. [Setting Up VS Code](#setting-up-vs-code)
4. [Getting the Game Code](#getting-the-game-code)
5. [Installing Game Dependencies](#installing-game-dependencies)
6. [Running the Game](#running-the-game)
7. [Troubleshooting Common Issues](#troubleshooting-common-issues)
8. [Next Steps](#next-steps)

## Complete Beginner Setup

If you're completely new to programming, don't worry! Follow these steps in order and you'll have everything working.

### What You'll Need

- A computer (Windows, Mac, or Linux)
- Internet connection
- About 30 minutes of setup time

### Overview of Tools

Before we start, here's what we'll be installing and why:

- **Node.js**: JavaScript runtime that lets us run JavaScript outside of web browsers
- **npm**: Package manager that comes with Node.js - helps us download and manage code libraries
- **VS Code**: Free code editor made by Microsoft - where we'll write and edit our game code
- **Git**: Version control system (optional but recommended) - helps track changes to code

## Installing Node.js and npm

Node.js is the foundation that lets us run our game development tools.

### Step 1: Download Node.js

1. Go to [nodejs.org](https://nodejs.org/)
2. You'll see two download options:
   - **LTS (Long Term Support)** - Choose this one! It's more stable
   - **Current** - Has newest features but might be less stable
3. Click the **LTS** download button for your operating system

### Step 2: Install Node.js

#### For Windows:
1. Run the downloaded `.msi` file
2. Follow the installation wizard:
   - Click "Next" through the welcome screens
   - Accept the license agreement
   - Keep the default installation location
   - **Important**: Make sure "Add to PATH" is checked
   - Click "Install"
3. Restart your computer when installation finishes

#### For Mac:
1. Run the downloaded `.pkg` file
2. Follow the installation wizard:
   - Click "Continue" through the introduction
   - Accept the license agreement
   - Keep the default installation location
   - Click "Install"
3. Enter your Mac password when prompted

#### For Linux (Ubuntu/Debian):
```bash
# Update package list
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

### Step 3: Verify Installation

1. Open a terminal/command prompt:
   - **Windows**: Press `Win + R`, type `cmd`, press Enter
   - **Mac**: Press `Cmd + Space`, type `terminal`, press Enter
   - **Linux**: Press `Ctrl + Alt + T`

2. Type these commands to check if everything installed correctly:

```bash
node --version
```
You should see something like: `v18.17.0` (version numbers may vary)

```bash
npm --version
```
You should see something like: `9.6.7` (version numbers may vary)

If you see version numbers, congratulations! Node.js and npm are installed correctly.

### Troubleshooting Node.js Installation

**Problem**: Command not found or not recognized
- **Solution**: Restart your computer and try again
- **Alternative**: Re-install Node.js and make sure "Add to PATH" is checked

**Problem**: Permission errors on Mac/Linux
- **Solution**: Use `sudo` before commands, or follow [npm's guide to fix permissions](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

## Setting Up VS Code

VS Code is a free, powerful code editor that makes writing code much easier.

### Step 1: Download VS Code

1. Go to [code.visualstudio.com](https://code.visualstudio.com/)
2. Click the big download button
3. The website should automatically detect your operating system

### Step 2: Install VS Code

#### For Windows:
1. Run the downloaded `.exe` file
2. Follow the installation wizard:
   - Accept the license agreement
   - Choose installation location (default is fine)
   - **Important**: Check these options:
     - "Add 'Open with Code' action to Windows Explorer file context menu"
     - "Add 'Open with Code' action to Windows Explorer directory context menu"
     - "Register Code as an editor for supported file types"
     - "Add to PATH"
   - Click "Install"

#### For Mac:
1. Open the downloaded `.zip` file
2. Drag "Visual Studio Code" to your Applications folder
3. Open VS Code from Applications
4. If you see a security warning, click "Open"

#### For Linux:
```bash
# Download and install VS Code
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt update
sudo apt install code
```

### Step 3: Install Helpful VS Code Extensions

These extensions will make coding much easier:

1. Open VS Code
2. Click the Extensions icon in the sidebar (looks like building blocks)
3. Search for and install these extensions:

**Essential Extensions:**
- **TypeScript and JavaScript Language Features** (usually pre-installed)
- **Prettier - Code formatter**: Makes your code look neat and consistent
- **Auto Rename Tag**: Automatically renames matching HTML tags
- **Bracket Pair Colorizer**: Makes matching brackets the same color

**Game Development Extensions:**
- **Live Server**: Preview your game in the browser with auto-refresh
- **GitLens**: Helpful Git features (if you use Git)

### Step 4: Configure VS Code Settings

1. Press `Ctrl+,` (Windows/Linux) or `Cmd+,` (Mac) to open settings
2. Search for "format on save"
3. Check the box for "Editor: Format On Save"
4. Search for "tab size"
5. Set "Editor: Tab Size" to `2` (common for web development)

## Getting the Game Code

There are two ways to get the Quantum Jumper code: downloading a ZIP file or using Git.

### Option 1: Download ZIP (Easier for Beginners)

1. Go to the Quantum Jumper repository on GitHub
2. Click the green "Code" button
3. Click "Download ZIP"
4. Extract the ZIP file to a folder like:
   - Windows: `C:\Users\[YourName]\Documents\quantum-jumper`
   - Mac: `/Users/[YourName]/Documents/quantum-jumper`
   - Linux: `/home/[YourName]/Documents/quantum-jumper`

### Option 2: Using Git (Recommended for Learning)

First, install Git:

#### Installing Git:

**Windows:**
1. Go to [git-scm.com](https://git-scm.com/)
2. Download and run the installer
3. Use default settings during installation

**Mac:**
Git might already be installed. Open Terminal and type:
```bash
git --version
```
If not installed, follow the prompts to install Xcode Command Line Tools.

**Linux:**
```bash
sudo apt update
sudo apt install git
```

#### Cloning the Repository:

1. Open terminal/command prompt
2. Navigate to where you want the project:
```bash
cd Documents
```

3. Clone the repository:
```bash
git clone [repository-url]
cd quantum-jumper
```

## Installing Game Dependencies

Now we need to download all the libraries and tools the game needs to run.

### Step 1: Open the Project in VS Code

1. Open VS Code
2. Go to File → Open Folder
3. Navigate to and select your `quantum-jumper` folder
4. Click "Select Folder" (Windows) or "Open" (Mac)

### Step 2: Open the Terminal in VS Code

1. In VS Code, go to Terminal → New Terminal
2. You should see a terminal window at the bottom of VS Code
3. The terminal should already be in your project folder

### Step 3: Install Dependencies

In the VS Code terminal, type:

```bash
npm install
```

This command will:
- Read the `package.json` file to see what libraries are needed
- Download all required packages
- Create a `node_modules` folder with all the code libraries
- Create a `package-lock.json` file that locks specific versions

**This might take a few minutes** depending on your internet connection. You'll see lots of text scrolling by - this is normal!

### What Gets Installed

The main packages include:
- **Phaser**: The game engine that powers Quantum Jumper
- **TypeScript**: Adds types to JavaScript for better error catching
- **Vite**: Fast build tool and development server
- **Various other tools**: For building, testing, and optimizing the game

## Running the Game

Now for the exciting part - actually running the game!

### Step 1: Start the Development Server

In the VS Code terminal, type:

```bash
npm run dev
```

You should see output like:
```
  VITE v4.4.5  ready in 1034 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 2: Open the Game in Your Browser

1. Hold `Ctrl` (Windows/Linux) or `Cmd` (Mac) and click on `http://localhost:5173/`
2. Or manually open your web browser and go to `http://localhost:5173/`

### Step 3: Play the Game!

You should now see the Quantum Jumper start screen! 

**Controls:**
- **Arrow Keys**: Move left and right
- **Spacebar**: Jump
- **X Key**: Switch between Light and Dark dimensions
- **Enter**: Start the game from the main menu

### Step 4: Making Changes

The development server has "hot reload" - when you save changes to the code, the browser automatically refreshes with your changes!

Try this:
1. Open `src/game/scenes/Levels/Level1.ts` in VS Code
2. Find a coin creation section
3. Change a coin's value or position
4. Save the file (`Ctrl+S` or `Cmd+S`)
5. Watch the browser automatically refresh with your changes!

## Troubleshooting Common Issues

### "npm command not found"

**Problem**: Terminal says npm is not recognized
**Solution**: 
1. Restart your computer
2. Make sure Node.js was installed with "Add to PATH" checked
3. Re-install Node.js if necessary

### Port 5173 Already in Use

**Problem**: Error says port is already in use
**Solution**:
```bash
# Stop the current server with Ctrl+C, then:
npm run dev -- --port 3000
```

### Permission Errors (Mac/Linux)

**Problem**: Permission denied errors when running npm commands
**Solution**:
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### Game Not Loading in Browser

**Problem**: Browser shows error or blank page
**Solutions**:
1. Check the browser console (F12) for error messages
2. Make sure the development server is still running
3. Try refreshing the page
4. Try a different browser (Chrome, Firefox, Safari)

### TypeScript Errors in VS Code

**Problem**: Red squiggly lines under code
**Solution**: 
- These are often helpful warnings, not critical errors
- The game might still run fine
- Read the error message - it often tells you exactly what's wrong

### Can't Find Project Files

**Problem**: VS Code shows empty folder or can't find files
**Solution**:
1. Make sure you opened the correct folder (the one with `package.json`)
2. Check that you extracted the ZIP file properly
3. Try File → Open Folder again and navigate carefully

## Building for Production

When you're ready to share your game or deploy it to a website:

### Step 1: Build the Game

```bash
npm run build
```

This creates a `dist` folder with optimized files ready for deployment.

### Step 2: Preview the Build

```bash
npm run preview
```

This lets you test the production build locally before deploying.

### Step 3: Deploy (Optional)

You can deploy the contents of the `dist` folder to:
- **GitHub Pages**: Free hosting for GitHub repositories
- **Netlify**: Drag and drop the dist folder for instant hosting
- **Vercel**: Connect your GitHub repository for automatic deployments

## Next Steps

Congratulations! You now have Quantum Jumper running on your computer. Here's what to do next:

### 1. Learn the Basics
- Read through the [Learning TypeScript guide](learning-typescript.md)
- Study the [What Makes a Game documentation](what-makes-a-game.md)
- Follow the [Tutorial](tutorial.md) to create your first custom level

### 2. Explore the Code
- Look at `src/game/scenes/Levels/Level1.ts` to see how levels are built
- Check out the builder classes in `src/game/utils/` to understand the fluent API
- Experiment with changing values and see what happens

### 3. Create Your Own Content
- Modify existing levels
- Create new levels using the tutorial
- Add new types of objects or mechanics

### 4. Join the Community
- Share your creations with others
- Ask questions when you get stuck
- Help other beginners who are just starting

### 5. Keep Learning
- Watch the recommended video tutorials
- Practice TypeScript and JavaScript
- Learn more about Phaser 3 and game development

## Useful Commands Reference

Here are the most common commands you'll use:

```bash
# Install dependencies (run once when you first get the code)
npm install

# Start development server (for coding and testing)
npm run dev

# Build for production (when ready to share/deploy)
npm run build

# Preview production build
npm run preview

# Check for TypeScript errors
npm run type-check

# Format code (if Prettier is set up)
npm run format
```

## Getting Help

If you run into issues:

1. **Check the error message carefully** - they're often more helpful than you think
2. **Search online** - Add "quantum jumper", "phaser 3", or "vite" to your search
3. **Check the browser console** - Press F12 and look for error messages
4. **Ask for help** - Don't be afraid to ask questions in forums or communities

Remember: Every developer started as a beginner and faced these same challenges. With patience and practice, you'll be creating amazing games in no time!

## Video Resources

If you prefer learning through videos, check out these excellent tutorials:

- **[Learn TypeScript - Full Course for Beginners](https://www.youtube.com/watch?v=gp5H0Vw39yw)** - Comprehensive TypeScript tutorial
- **[Phaser Tutorial | Make Your First 2D JavaScript Game](https://www.youtube.com/watch?v=0qtg-9M3peI)** - Learn Phaser 3 basics
- **[npm for absolute beginners](https://www.youtube.com/watch?v=UYz-9UaUp2E&t=24s)** - Understanding package management
- **[How to get started with VS Code](https://www.youtube.com/watch?v=EUJlVYggR1Y)** - Code editor setup and usage

Happy coding! 🎮✨

## Need Help? 
Reach out to a staff member (yellow lanyards and badges) or check-in on the event discord server for assistance.
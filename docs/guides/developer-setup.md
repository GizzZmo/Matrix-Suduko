# Developer Setup Guide

This guide will help you set up your development environment for Matrix Sudoku.

## 📋 Prerequisites

### Required Software

#### Node.js and npm
- **Node.js**: Version 16.x or higher
- **npm**: Comes with Node.js (version 8.x or higher)

**Installation:**
```bash
# Check if already installed
node --version
npm --version

# Download from https://nodejs.org/ or use package manager:

# macOS (using Homebrew)
brew install node

# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Windows (using Chocolatey)
choco install nodejs
```

#### Git
Version control system for source code management.

```bash
# Check installation
git --version

# Install if needed:
# macOS: git comes pre-installed or via Xcode
# Ubuntu/Debian
sudo apt install git

# Windows: Download from https://git-scm.com/
```

### Optional but Recommended

#### Code Editor
- **Visual Studio Code** (recommended)
- **WebStorm**
- **Atom**
- **Sublime Text**

#### Browser Developer Tools
- **Chrome DevTools** (recommended)
- **Firefox Developer Tools**

## 🚀 Quick Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/GizzZmo/Matrix-Suduko.git
cd Matrix-Suduko

# Or if you forked it:
git clone https://github.com/YOUR_USERNAME/Matrix-Suduko.git
cd Matrix-Suduko
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# This will install:
# - electron (for desktop app)
# - electron-builder (for building distributables)
# - express (for web server)
# - socket.io (for multiplayer)
# - jest (for testing)
```

### 3. Verify Installation

```bash
# Run tests to verify everything is working
npm test

# Start the development server
npm run dev
```

If everything is set up correctly, you should see the Matrix Sudoku application window open.

## 🎯 Development Workflows

### Running the Application

#### Desktop Application (Electron)
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

#### Web Application (Browser)
```bash
# Start web server
npm run web

# Open http://localhost:3000 in your browser
```

### Building for Distribution

#### Build for All Platforms
```bash
npm run build
```

#### Platform-Specific Builds
```bash
# Windows
npm run build-win

# macOS
npm run build-mac

# Linux
npm run build-linux
```

**Build Output:**
- Windows: `dist/Matrix Sudoku Setup.exe`
- macOS: `dist/Matrix Sudoku.dmg`
- Linux: `dist/Matrix Sudoku.AppImage`

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Linting and Code Quality

```bash
# Install ESLint globally (optional)
npm install -g eslint

# Run linting (if configured)
npx eslint js/ src/

# Auto-fix linting issues
npx eslint js/ src/ --fix
```

## 🗂️ Project Structure

```
Matrix-Suduko/
├── src/                    # Electron-specific files
│   ├── index.html         # Main HTML file
│   ├── main.js            # Electron main process
│   ├── preload.js         # Electron preload script
│   └── server.js          # Web server for browser version
├── js/                    # JavaScript modules
│   ├── app.js             # Main application logic
│   ├── game-controller.js # Game state management
│   ├── sudoku-engine.js   # Core Sudoku logic
│   ├── sudoku-ui.js       # User interface
│   ├── matrix-background.js # Background animation
│   ├── theme-manager.js   # Theme system
│   ├── achievement-manager.js # Achievements
│   ├── daily-challenge-manager.js # Daily challenges
│   ├── multiplayer-manager.js # Multiplayer
│   └── social-sharing-manager.js # Social features
├── css/                   # Stylesheets
│   ├── matrix-theme.css   # Matrix theme
│   ├── themes.css         # Theme system
│   └── sudoku-game.css    # Game styles
├── assets/                # Static assets
│   └── sounds/            # Audio files
├── tests/                 # Test files
├── docs/                  # Documentation
├── dist/                  # Build output (created by build process)
├── package.json           # Project configuration
└── README.md              # Project overview
```

## 🛠️ Development Tools Setup

### Visual Studio Code Configuration

#### Recommended Extensions
Create `.vscode/extensions.json`:
```json
{
    "recommendations": [
        "ms-vscode.vscode-typescript-next",
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "ms-vscode.vscode-json"
    ]
}
```

#### Workspace Settings
Create `.vscode/settings.json`:
```json
{
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "javascript.suggest.autoImports": true,
    "typescript.suggest.autoImports": true
}
```

### Git Hooks Setup

#### Pre-commit Hook
Create `.git/hooks/pre-commit`:
```bash
#!/bin/sh
# Run tests before commit
npm test
if [ $? -ne 0 ]; then
    echo "Tests failed. Commit aborted."
    exit 1
fi
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

## 🔧 Environment Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):
```bash
# Development settings
NODE_ENV=development
DEBUG=true

# Web server settings
PORT=3000
HOST=localhost

# Multiplayer settings (optional)
SOCKET_PORT=3001
```

### Development vs Production

#### Development Mode Features:
- Hot reload
- Debug logging
- Development tools enabled
- Source maps

#### Production Mode Features:
- Minified code
- Optimized assets
- Error tracking
- Performance monitoring

## 🐛 Debugging

### Electron Application

#### Main Process Debugging
```bash
# Start with debug flags
electron --inspect=5858 .

# Or in package.json script:
"debug": "electron --inspect=5858 ."
```

#### Renderer Process Debugging
- Open DevTools in the application: `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS)
- Or programmatically: `Menu > View > Toggle Developer Tools`

### Web Application

#### Browser Debugging
- Open browser DevTools: `F12` or `Ctrl+Shift+I`
- Use breakpoints in Sources tab
- Console logging and error tracking

#### Network Debugging
- Monitor network requests in DevTools
- Check WebSocket connections for multiplayer
- Analyze performance in Network tab

## 🧪 Testing Setup

### Unit Testing with Jest

#### Basic Test Structure
```javascript
// tests/example.test.js
describe('SudokuEngine', () => {
    let engine;
    
    beforeEach(() => {
        engine = new SudokuEngine();
    });
    
    test('should generate valid puzzle', () => {
        const puzzle = engine.generatePuzzle('medium');
        expect(puzzle.grid).toBeDefined();
        expect(puzzle.solution).toBeDefined();
    });
});
```

#### Running Specific Tests
```bash
# Run specific test file
npm test -- sudoku-engine.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should generate"
```

### End-to-End Testing (Future Enhancement)

Consider adding tools like:
- **Playwright** for browser automation
- **Spectron** for Electron testing
- **Cypress** for integration testing

## 🔍 Common Issues and Solutions

### Installation Issues

#### Node Version Conflicts
```bash
# Use nvm to manage Node versions
nvm install 16
nvm use 16
```

#### Permission Issues on Linux/macOS
```bash
# Don't use sudo with npm install
# Instead, configure npm to use a different directory
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

#### Windows Build Issues
```bash
# Install windows-build-tools
npm install --global windows-build-tools
```

### Runtime Issues

#### Electron Won't Start
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Check Node version compatibility
3. Verify all dependencies are installed

#### Web Server Port Conflicts
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run web
```

### Development Issues

#### Hot Reload Not Working
1. Check file watching permissions
2. Restart development server
3. Clear browser cache

#### Build Failures
1. Check disk space
2. Clear dist directory: `rm -rf dist`
3. Verify all dependencies are installed

## 📚 Additional Resources

### Documentation
- [Electron Documentation](https://electronjs.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [Jest Testing Framework](https://jestjs.io/docs)

### Learning Resources
- [JavaScript ES6+ Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Electron Tutorial](https://electronjs.org/docs/tutorial)
- [Canvas API for Matrix Background](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

### Community
- [GitHub Issues](https://github.com/GizzZmo/Matrix-Suduko/issues)
- [GitHub Discussions](https://github.com/GizzZmo/Matrix-Suduko/discussions)

## 🤝 Next Steps

1. **Read the [Architecture Guide](../architecture/)** to understand the system design
2. **Explore the [API Reference](../api/)** for detailed class documentation
3. **Check the [Contributing Guide](../contributing/CONTRIBUTING.md)** for contribution guidelines
4. **Review the [Testing Guide](testing.md)** for testing best practices

---

*If you encounter any issues not covered here, please [create an issue](https://github.com/GizzZmo/Matrix-Suduko/issues/new) on GitHub.*
# Matrix Sudoku - Cross-Platform Sudoku Game

A stunning Matrix-themed Sudoku game with exceptional UI/UX, built with HTML5, Node.js, and Electron for cross-platform deployment.

## 🎮 Features

- **Matrix-themed UI**: Iconic green digital rain background animation
- **Cross-platform support**: Windows, Linux, macOS, iOS, and Android
- **Multiple difficulty levels**: Easy, Medium, Hard, and Expert
- **Touch-friendly interface**: 0-9 number buttons with touch/mouse support
- **Real-time validation**: Instant error detection and highlighting
- **Hint system**: Get help when you're stuck
- **Auto-save**: Never lose your progress
- **Responsive design**: Perfect for desktop, tablet, and mobile
- **Sound effects**: Matrix-themed audio feedback
- **Keyboard shortcuts**: Full keyboard navigation support
- **🎨 Multiple themes**: Matrix (classic), Cyberpunk, Neon, and Classic themes
- **🏆 Achievement system**: Unlock badges for various accomplishments
- **📅 Daily challenges**: New puzzle every day with bonus points
- **🌐 Multiplayer support**: Play with friends in real-time
- **📊 Online leaderboards**: Compete with players worldwide
- **📱 Social sharing**: Share your achievements and high scores

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GizzZmo/Matrix-Suduko.git
cd Matrix-Suduko
```

2. Install dependencies:
```bash
npm install
```

3. Start the game:

**Web version:**
```bash
npm run web
```

**Desktop application:**
```bash
npm start
```

**Development mode:**
```bash
npm run dev
```

## 🎯 How to Play

### Objective
Fill the 9×9 grid so that each column, row, and 3×3 box contains the digits 1-9.

### Controls

#### Mouse/Touch
- **Click/Tap**: Select a cell
- **Right-click/Long-press**: Erase a cell
- **Number buttons**: Enter numbers 1-9
- **ERASE button**: Clear selected cell

#### Keyboard
- **1-9 keys**: Enter numbers
- **0, Delete, Backspace**: Erase cell
- **Arrow keys**: Navigate between cells
- **Escape**: Deselect current cell

### Game Features

#### Difficulty Levels
- **Easy**: 45 given numbers
- **Medium**: 35 given numbers  
- **Hard**: 25 given numbers
- **Expert**: 17 given numbers

#### Assistance Features
- **Hint**: Get the correct number for a selected cell
- **Check**: Validate your current solution
- **Solve**: Automatically complete the puzzle

#### Visual Feedback
- **Cell highlighting**: Related rows, columns, and boxes
- **Error indication**: Invalid moves are highlighted in red
- **Completion animation**: Celebrate your success!

## 🔧 Development

### Project Structure

```
Matrix-Suduko/
├── src/                    # Main application files
│   ├── index.html         # Main HTML file
│   ├── main.js            # Electron main process
│   ├── preload.js         # Electron preload script
│   └── server.js          # Web server
├── css/                   # Stylesheets
│   ├── matrix-theme.css   # Matrix theme styles
│   └── sudoku-game.css    # Game-specific styles
├── js/                    # JavaScript modules
│   ├── app.js             # Main application
│   ├── game-controller.js # Game coordination
│   ├── matrix-background.js # Matrix animation
│   ├── sudoku-engine.js   # Game logic
│   └── sudoku-ui.js       # User interface
├── assets/                # Game assets
│   ├── sounds/            # Audio files
│   └── icons/             # Application icons
├── tests/                 # Test files
└── docs/                  # Documentation
```

### Architecture

The game follows a modular architecture with clear separation of concerns:

- **SudokuEngine**: Core game logic and puzzle generation
- **SudokuUI**: User interface management and interactions
- **GameController**: Coordinates engine and UI components
- **MatrixBackground**: Animated background effects
- **MatrixSudokuApp**: Main application orchestrator

### Building for Different Platforms

**Windows:**
```bash
npm run build-win
```

**macOS:**
```bash
npm run build-mac
```

**Linux:**
```bash
npm run build-linux
```

**All platforms:**
```bash
npm run build
```

## 📄 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🔮 Future Enhancements

- [x] Multiplayer support
- [x] Online leaderboards
- [x] More themes (Cyberpunk, Neon, Classic)
- [x] Achievement system
- [x] Daily challenges
- [x] Social sharing features

---

**Made with ❤️ and lots of ☕ by the Matrix Sudoku Team**

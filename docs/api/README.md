# API Reference

This section provides detailed API documentation for all classes and modules in Matrix Sudoku.

## 📚 Core Classes

### Game Engine
- **[SudokuEngine](SudokuEngine.md)** - Core game logic and puzzle generation
- **[GameController](GameController.md)** - Game state management and coordination

### User Interface
- **[SudokuUI](SudokuUI.md)** - User interface management and interactions
- **[MatrixBackground](MatrixBackground.md)** - Animated background effects

### Application Core
- **[MatrixSudokuApp](MatrixSudokuApp.md)** - Main application orchestrator

### Feature Modules
- **[AchievementManager](AchievementManager.md)** - Achievement system management
- **[ThemeManager](ThemeManager.md)** - Theme system and styling
- **[DailyChallengeManager](DailyChallengeManager.md)** - Daily challenge features
- **[MultiplayerManager](MultiplayerManager.md)** - Multiplayer functionality
- **[SocialSharingManager](SocialSharingManager.md)** - Social sharing features

### Electron Integration
- **[Main Process](electron/MainProcess.md)** - Electron main process (main.js)
- **[Preload Script](electron/PreloadScript.md)** - Electron preload script (preload.js)

## 🔧 Utility Functions

### Helper Functions
- **[Validation Utilities](utils/Validation.md)** - Input validation and sanitization
- **[Storage Utilities](utils/Storage.md)** - Local storage management
- **[Math Utilities](utils/Math.md)** - Mathematical helper functions

## 📋 Type Definitions

### Game Types
```typescript
interface Grid {
    cells: number[][];
    isValid: boolean;
    difficulty: DifficultyLevel;
}

interface GameState {
    grid: Grid;
    solution: number[][];
    startTime: Date;
    currentTime: number;
    errors: number;
    hintsUsed: number;
}

interface PlayerStats {
    gamesCompleted: number;
    bestTime: number;
    totalPlayTime: number;
    achievements: Achievement[];
}
```

### Achievement Types
```typescript
interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    condition: AchievementCondition;
    points: number;
    unlocked: boolean;
    unlockedAt?: Date;
}

interface AchievementCondition {
    type: 'games_completed' | 'best_time' | 'zero_errors' | 'difficulty_completed';
    value: number;
    operator?: '>' | '<' | '=' | '>=' | '<=';
}
```

### Theme Types
```typescript
interface Theme {
    name: string;
    colors: ThemeColors;
    fonts: ThemeFonts;
    animations: ThemeAnimations;
}

interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    error: string;
    success: string;
}
```

## 🎯 Event System

### Game Events
```typescript
// Puzzle events
'puzzleGenerated' - (puzzle: Puzzle) => void
'puzzleCompleted' - (stats: GameStats) => void
'puzzleReset' - () => void

// Move events
'cellSelected' - (row: number, col: number) => void
'numberEntered' - (row: number, col: number, value: number) => void
'moveValidated' - (isValid: boolean, row: number, col: number) => void

// Game state events
'gameStarted' - (difficulty: DifficultyLevel) => void
'gamePaused' - () => void
'gameResumed' - () => void
'timerUpdated' - (seconds: number) => void
```

### UI Events
```typescript
// Theme events
'themeChanged' - (theme: Theme) => void
'themeLoaded' - (themeName: string) => void

// Settings events
'settingsChanged' - (settings: GameSettings) => void
'settingsSaved' - () => void

// Achievement events
'achievementUnlocked' - (achievement: Achievement) => void
'achievementProgress' - (achievementId: string, progress: number) => void
```

## 📖 Usage Examples

### Basic Game Initialization
```javascript
// Initialize the application
const app = new MatrixSudokuApp();
await app.init();

// Create a new game
const controller = new GameController();
const puzzle = controller.newGame('medium');
```

### Custom Theme Creation
```javascript
// Register a new theme
const customTheme = {
    name: 'Custom',
    colors: {
        primary: '#ff6b6b',
        secondary: '#4ecdc4',
        // ...
    }
};

ThemeManager.registerTheme(customTheme);
ThemeManager.setTheme('Custom');
```

### Achievement System Integration
```javascript
// Listen for achievements
AchievementManager.on('achievementUnlocked', (achievement) => {
    console.log(`Achievement unlocked: ${achievement.name}`);
});

// Check for achievements after game completion
AchievementManager.checkProgress({
    type: 'puzzleCompleted',
    difficulty: 'hard',
    time: 180,
    errors: 0
});
```

## 🔍 Error Handling

### Common Error Types
```typescript
class SudokuError extends Error {
    constructor(message: string, code: string) {
        super(message);
        this.name = 'SudokuError';
        this.code = code;
    }
}

// Error codes
'INVALID_MOVE' - Invalid number placement
'PUZZLE_UNSOLVABLE' - Generated puzzle has no solution
'SAVE_FAILED' - Game state save operation failed
'LOAD_FAILED' - Game state load operation failed
'THEME_NOT_FOUND' - Requested theme doesn't exist
```

### Error Handling Examples
```javascript
try {
    const result = engine.makeMove(row, col, value);
} catch (error) {
    if (error instanceof SudokuError) {
        switch (error.code) {
            case 'INVALID_MOVE':
                ui.showInvalidMoveError(row, col);
                break;
            default:
                ui.showGenericError(error.message);
        }
    }
}
```

## 🔗 Cross-References

- [Architecture Guide](../architecture/) - System design overview
- [Developer Setup](../guides/developer-setup.md) - Development environment setup
- [Testing Guide](../guides/testing.md) - Testing procedures and examples

---

*For specific class documentation, click on the class names above to view detailed API reference.*
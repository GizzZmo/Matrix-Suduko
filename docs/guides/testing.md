# Testing Guide

This guide covers testing procedures and best practices for Matrix Sudoku development.

## 🧪 Testing Strategy

Matrix Sudoku employs a multi-layered testing approach:

1. **Unit Tests** - Individual component testing
2. **Integration Tests** - Component interaction testing  
3. **End-to-End Tests** - Complete user workflow testing
4. **Manual Testing** - Human verification of features
5. **Performance Testing** - Speed and memory optimization

## 🛠️ Test Setup

### Installing Test Dependencies

```bash
# Install Jest and testing utilities
npm install --save-dev jest
npm install --save-dev @testing-library/jest-dom
npm install --save-dev jest-environment-jsdom
```

### Jest Configuration

Create `jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'js/**/*.js',
    'src/**/*.js',
    '!js/**/*.min.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
```

### Test Setup File

Create `tests/setup.js`:

```javascript
// Mock browser APIs
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn();

// Mock Canvas API
global.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  fillText: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn()
}));

// Mock audio
global.Audio = jest.fn(() => ({
  play: jest.fn(),
  pause: jest.fn(),
  load: jest.fn()
}));
```

## 📝 Writing Unit Tests

### SudokuEngine Tests

```javascript
// tests/sudoku-engine.test.js
describe('SudokuEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new SudokuEngine();
  });

  describe('generatePuzzle', () => {
    test('should generate valid puzzle with correct difficulty', () => {
      const puzzle = engine.generatePuzzle('medium');
      
      expect(puzzle).toBeDefined();
      expect(puzzle.grid).toHaveLength(9);
      expect(puzzle.grid[0]).toHaveLength(9);
      expect(puzzle.solution).toHaveLength(9);
      expect(puzzle.difficulty).toBe('medium');
    });

    test('should generate puzzle with correct number of clues', () => {
      const puzzle = engine.generatePuzzle('easy');
      const filledCells = puzzle.grid.flat().filter(cell => cell !== 0);
      
      expect(filledCells).toHaveLength(45); // Easy difficulty
    });

    test('should throw error for invalid difficulty', () => {
      expect(() => {
        engine.generatePuzzle('invalid');
      }).toThrow();
    });
  });

  describe('validatePuzzle', () => {
    test('should validate correct puzzle', () => {
      const validGrid = [
        [5,3,4,6,7,8,9,1,2],
        [6,7,2,1,9,5,3,4,8],
        [1,9,8,3,4,2,5,6,7],
        [8,5,9,7,6,1,4,2,3],
        [4,2,6,8,5,3,7,9,1],
        [7,1,3,9,2,4,8,5,6],
        [9,6,1,5,3,7,2,8,4],
        [2,8,7,4,1,9,6,3,5],
        [3,4,5,2,8,6,1,7,9]
      ];

      const result = engine.validatePuzzle(validGrid);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect row conflicts', () => {
      const invalidGrid = [
        [5,3,5,6,7,8,9,1,2], // Duplicate 5 in row
        [6,7,2,1,9,5,3,4,8],
        // ... rest of grid
      ];

      const result = engine.validatePuzzle(invalidGrid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        row: 0,
        col: expect.any(Number),
        type: 'duplicate_row'
      });
    });
  });

  describe('solvePuzzle', () => {
    test('should solve valid puzzle', () => {
      const puzzle = engine.generatePuzzle('medium');
      const solved = engine.solvePuzzle(puzzle.grid);
      
      expect(solved).toBe(true);
      expect(engine.isComplete(puzzle.grid)).toBe(true);
    });

    test('should return false for unsolvable puzzle', () => {
      const unsolvableGrid = [
        [1,1,1,1,1,1,1,1,1], // Invalid puzzle
        [0,0,0,0,0,0,0,0,0],
        // ... rest zeros
      ];

      const solved = engine.solvePuzzle(unsolvableGrid);
      expect(solved).toBe(false);
    });
  });

  describe('getHint', () => {
    test('should provide valid hint', () => {
      const puzzle = engine.generatePuzzle('easy');
      const hint = engine.getHint(puzzle.grid);
      
      if (hint) {
        expect(hint).toHaveProperty('row');
        expect(hint).toHaveProperty('col');
        expect(hint).toHaveProperty('value');
        expect(hint.row).toBeGreaterThanOrEqual(0);
        expect(hint.row).toBeLessThan(9);
        expect(hint.col).toBeGreaterThanOrEqual(0);
        expect(hint.col).toBeLessThan(9);
        expect(hint.value).toBeGreaterThanOrEqual(1);
        expect(hint.value).toBeLessThanOrEqual(9);
      }
    });

    test('should return null for complete puzzle', () => {
      const completeGrid = [
        [5,3,4,6,7,8,9,1,2],
        [6,7,2,1,9,5,3,4,8],
        [1,9,8,3,4,2,5,6,7],
        [8,5,9,7,6,1,4,2,3],
        [4,2,6,8,5,3,7,9,1],
        [7,1,3,9,2,4,8,5,6],
        [9,6,1,5,3,7,2,8,4],
        [2,8,7,4,1,9,6,3,5],
        [3,4,5,2,8,6,1,7,9]
      ];

      const hint = engine.getHint(completeGrid);
      expect(hint).toBeNull();
    });
  });
});
```

### AchievementManager Tests

```javascript
// tests/achievement-manager.test.js
describe('AchievementManager', () => {
  let achievementManager;
  
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    achievementManager = new AchievementManager();
  });

  test('should initialize with default achievements', () => {
    const achievements = achievementManager.getAchievements();
    
    expect(achievements).toBeDefined();
    expect(Object.keys(achievements)).toContain('first_solve');
    expect(Object.keys(achievements)).toContain('speed_demon');
    expect(Object.keys(achievements)).toContain('perfectionist');
  });

  test('should unlock achievement when condition is met', () => {
    const gameStats = {
      completed: true,
      difficulty: 'medium',
      time: 300,
      errors: 0
    };

    achievementManager.checkProgress(gameStats);
    
    const progress = achievementManager.getProgress();
    expect(progress.first_solve.unlocked).toBe(true);
    expect(progress.first_solve.unlockedAt).toBeDefined();
  });

  test('should not unlock achievement when condition is not met', () => {
    const gameStats = {
      completed: false,
      difficulty: 'medium',
      time: 300,
      errors: 0
    };

    achievementManager.checkProgress(gameStats);
    
    const progress = achievementManager.getProgress();
    expect(progress.first_solve.unlocked).toBe(false);
  });

  test('should save and load progress from localStorage', () => {
    // Unlock an achievement
    achievementManager.unlockAchievement('first_solve');
    
    // Create new instance (simulates page reload)
    const newManager = new AchievementManager();
    const progress = newManager.getProgress();
    
    expect(progress.first_solve.unlocked).toBe(true);
  });
});
```

## 🔗 Integration Tests

### Game Flow Tests

```javascript
// tests/integration/game-flow.test.js
describe('Game Flow Integration', () => {
  let gameController;
  let sudokuUI;
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="game-container">
        <div id="sudoku-grid"></div>
        <div id="controls"></div>
      </div>
    `;
    
    gameController = new GameController();
    sudokuUI = new SudokuUI(gameController.engine);
  });

  test('should complete full game flow', async () => {
    // Start new game
    const puzzle = gameController.newGame('easy');
    expect(puzzle).toBeDefined();
    
    // Make valid move
    const result = gameController.makeMove(0, 0, 5);
    expect(result.success).toBe(true);
    
    // Check game state
    const gameState = gameController.getGameState();
    expect(gameState.grid[0][0]).toBe(5);
    expect(gameState.moves).toBe(1);
  });

  test('should handle invalid moves correctly', () => {
    gameController.newGame('medium');
    
    // Try invalid move (duplicate in row)
    const result = gameController.makeMove(0, 0, 1);
    if (!result.success) {
      expect(result.error).toBeDefined();
      expect(result.error.type).toBe('invalid_move');
    }
  });

  test('should trigger completion when puzzle is solved', () => {
    const completionSpy = jest.fn();
    gameController.on('puzzleComplete', completionSpy);
    
    // Simulate solving the puzzle
    const puzzle = gameController.newGame('easy');
    gameController.solvePuzzle();
    
    expect(completionSpy).toHaveBeenCalled();
  });
});
```

## 🎭 Mock and Stub Utilities

### Common Mocks

```javascript
// tests/mocks/dom-mocks.js
export const mockElement = (tagName = 'div', properties = {}) => {
  const element = document.createElement(tagName);
  Object.assign(element, properties);
  
  // Mock commonly used methods
  element.querySelector = jest.fn();
  element.querySelectorAll = jest.fn(() => []);
  element.addEventListener = jest.fn();
  element.removeEventListener = jest.fn();
  
  return element;
};

export const mockCanvas = () => {
  const canvas = mockElement('canvas');
  canvas.getContext = jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    fillText: jest.fn(),
    measureText: jest.fn(() => ({ width: 100 })),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn()
  }));
  return canvas;
};
```

### Game State Mocks

```javascript
// tests/mocks/game-mocks.js
export const mockGameState = (overrides = {}) => ({
  grid: Array(9).fill().map(() => Array(9).fill(0)),
  solution: Array(9).fill().map(() => Array(9).fill(0)),
  difficulty: 'medium',
  startTime: new Date(),
  currentTime: 0,
  errors: 0,
  hintsUsed: 0,
  isComplete: false,
  ...overrides
});

export const mockPuzzle = (difficulty = 'medium') => ({
  grid: [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    // ... rest of puzzle
  ],
  solution: [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    // ... complete solution
  ],
  difficulty
});
```

## 🚀 Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- sudoku-engine.test.js

# Run tests with coverage
npm test -- --coverage

# Run tests matching pattern
npm test -- --testNamePattern="should generate"
```

### Advanced Test Options

```bash
# Verbose output
npm test -- --verbose

# Update snapshots
npm test -- --updateSnapshot

# Run only changed files
npm test -- --onlyChanged

# Run failed tests from last run
npm test -- --onlyFailures

# Maximum worker processes
npm test -- --maxWorkers=4
```

### Test Coverage

```bash
# Generate coverage report
npm test -- --coverage

# Coverage with threshold
npm test -- --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'

# Open coverage report
open coverage/lcov-report/index.html
```

## 📊 Performance Testing

### Benchmark Tests

```javascript
// tests/performance/benchmark.test.js
describe('Performance Benchmarks', () => {
  test('puzzle generation should complete within time limit', () => {
    const engine = new SudokuEngine();
    const startTime = performance.now();
    
    engine.generatePuzzle('expert');
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(1000); // Should complete in under 1 second
  });

  test('puzzle solving should be efficient', () => {
    const engine = new SudokuEngine();
    const puzzle = engine.generatePuzzle('medium');
    
    const startTime = performance.now();
    engine.solvePuzzle(puzzle.grid);
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(500);
  });
});
```

### Memory Usage Tests

```javascript
// tests/performance/memory.test.js
describe('Memory Usage', () => {
  test('should not leak memory during multiple games', () => {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Play multiple games
    for (let i = 0; i < 100; i++) {
      const engine = new SudokuEngine();
      engine.generatePuzzle('medium');
      // Simulate game completion
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be reasonable
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
  });
});
```

## 🎯 End-to-End Testing

While not currently implemented, E2E testing would use tools like:

### Playwright Setup

```javascript
// tests/e2e/game.spec.js (future implementation)
const { test, expect } = require('@playwright/test');

test('complete game flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Start new game
  await page.click('[data-testid="new-game"]');
  
  // Select difficulty
  await page.click('[data-testid="difficulty-medium"]');
  
  // Make moves
  await page.click('[data-testid="cell-0-0"]');
  await page.click('[data-testid="number-5"]');
  
  // Verify move was made
  await expect(page.locator('[data-testid="cell-0-0"]')).toHaveText('5');
});
```

## 📋 Test Checklist

Before submitting code:

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Code coverage above 80%
- [ ] No console errors in tests
- [ ] Performance tests within limits
- [ ] Manual testing completed
- [ ] Edge cases covered
- [ ] Error scenarios tested

## 🐛 Debugging Tests

### Common Issues

#### Tests Timeout
```javascript
// Increase timeout for slow tests
test('slow operation', async () => {
  // ... test code
}, 10000); // 10 second timeout
```

#### Async Test Issues
```javascript
// Proper async/await usage
test('async operation', async () => {
  const result = await someAsyncFunction();
  expect(result).toBeDefined();
});

// Or using promises
test('promise operation', () => {
  return somePromiseFunction().then(result => {
    expect(result).toBeDefined();
  });
});
```

#### DOM Cleanup
```javascript
// Clean up after each test
afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});
```

## 📚 Testing Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)
- [Jest Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## 🔄 Continuous Integration

Tests should run automatically in CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
```

---

*For more information about specific testing scenarios, see the individual test files in the `/tests` directory.*
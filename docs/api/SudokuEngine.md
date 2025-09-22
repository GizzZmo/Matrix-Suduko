# SudokuEngine API Reference

The `SudokuEngine` class is the core component responsible for Sudoku puzzle generation, solving, and validation.

## Class Overview

```javascript
class SudokuEngine {
    constructor()
    generatePuzzle(difficulty)
    solvePuzzle(grid)
    validatePuzzle(grid)
    isComplete(grid)
    getHint(grid)
    // ... more methods
}
```

## Constructor

### `new SudokuEngine()`

Creates a new instance of the Sudoku engine.

**Example:**
```javascript
const engine = new SudokuEngine();
```

**Properties initialized:**
- `grid` - Current puzzle grid (9x9 array)
- `solution` - Complete solution (9x9 array)
- `initialGrid` - Initial puzzle state (9x9 array)
- `difficulty` - Current difficulty level
- `difficultySettings` - Difficulty configuration object

## Public Methods

### `generatePuzzle(difficulty)`

Generates a new Sudoku puzzle with the specified difficulty level.

**Parameters:**
- `difficulty` (string) - Difficulty level: 'easy', 'medium', 'hard', or 'expert'

**Returns:**
- `Object` - Puzzle object containing:
  - `grid` (Array<Array<number>>) - The puzzle grid with some cells filled
  - `solution` (Array<Array<number>>) - The complete solution
  - `difficulty` (string) - The difficulty level used

**Example:**
```javascript
const puzzle = engine.generatePuzzle('medium');
console.log(puzzle.grid);      // [[5,3,0,0,7,0,0,0,0], ...]
console.log(puzzle.solution);  // [[5,3,4,6,7,8,9,1,2], ...]
console.log(puzzle.difficulty); // "medium"
```

**Difficulty Settings:**
- **Easy**: 45 clues (filled cells)
- **Medium**: 35 clues
- **Hard**: 25 clues
- **Expert**: 17 clues

### `solvePuzzle(grid)`

Solves a given Sudoku puzzle using backtracking algorithm.

**Parameters:**
- `grid` (Array<Array<number>>) - 9x9 grid with 0 representing empty cells

**Returns:**
- `boolean` - `true` if puzzle was solved, `false` if unsolvable

**Example:**
```javascript
const puzzle = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    // ... rest of puzzle
];

const solved = engine.solvePuzzle(puzzle);
if (solved) {
    console.log("Puzzle solved!", puzzle);
} else {
    console.log("Puzzle is unsolvable");
}
```

**Algorithm:** Uses recursive backtracking with constraint propagation for efficient solving.

### `validatePuzzle(grid)`

Validates the current state of a Sudoku puzzle.

**Parameters:**
- `grid` (Array<Array<number>>) - Current puzzle state

**Returns:**
- `Object` - Validation result:
  - `isValid` (boolean) - Whether the current state is valid
  - `errors` (Array<Object>) - Array of error objects with `row`, `col`, and `type`
  - `conflicts` (Array<Object>) - Array of conflicting cells

**Example:**
```javascript
const validation = engine.validatePuzzle(currentGrid);

if (validation.isValid) {
    console.log("Puzzle state is valid");
} else {
    validation.errors.forEach(error => {
        console.log(`Error at ${error.row},${error.col}: ${error.type}`);
    });
}
```

**Error Types:**
- `'duplicate_row'` - Duplicate number in row
- `'duplicate_col'` - Duplicate number in column
- `'duplicate_box'` - Duplicate number in 3x3 box

### `isComplete(grid)`

Checks if the puzzle is completely and correctly solved.

**Parameters:**
- `grid` (Array<Array<number>>) - Grid to check

**Returns:**
- `boolean` - `true` if puzzle is complete and valid

**Example:**
```javascript
if (engine.isComplete(currentGrid)) {
    console.log("Congratulations! Puzzle completed!");
    // Trigger completion logic
}
```

### `getHint(grid)`

Provides a hint by finding the next logical move.

**Parameters:**
- `grid` (Array<Array<number>>) - Current puzzle state

**Returns:**
- `Object|null` - Hint object or `null` if no hint available:
  - `row` (number) - Row index (0-8)
  - `col` (number) - Column index (0-8)
  - `value` (number) - Correct value for the cell
  - `reason` (string) - Explanation of the hint logic

**Example:**
```javascript
const hint = engine.getHint(currentGrid);

if (hint) {
    console.log(`Hint: Place ${hint.value} at row ${hint.row + 1}, column ${hint.col + 1}`);
    console.log(`Reason: ${hint.reason}`);
} else {
    console.log("No hints available - try advanced solving techniques!");
}
```

**Hint Strategies:**
1. **Naked Singles** - Cells with only one possible value
2. **Hidden Singles** - Only one cell in a unit can contain a value
3. **Pointing Pairs** - Elimination based on box-line interactions

### `isValidMove(grid, row, col, num)`

Checks if placing a number at a specific position is valid.

**Parameters:**
- `grid` (Array<Array<number>>) - Current grid state
- `row` (number) - Row index (0-8)
- `col` (number) - Column index (0-8)
- `num` (number) - Number to place (1-9)

**Returns:**
- `boolean` - `true` if the move is valid

**Example:**
```javascript
const isValid = engine.isValidMove(grid, 4, 6, 7);
if (isValid) {
    grid[4][6] = 7; // Make the move
    ui.updateCell(4, 6, 7);
} else {
    ui.showError(4, 6);
}
```

### `getPossibleValues(grid, row, col)`

Gets all possible values for a specific cell.

**Parameters:**
- `grid` (Array<Array<number>>) - Current grid state
- `row` (number) - Row index (0-8)
- `col` (number) - Column index (0-8)

**Returns:**
- `Array<number>` - Array of possible values (1-9)

**Example:**
```javascript
const possibleValues = engine.getPossibleValues(grid, 3, 5);
console.log(`Cell (3,5) can contain: ${possibleValues.join(', ')}`);
// Output: "Cell (3,5) can contain: 2, 4, 8"
```

## Private Methods

### `generateCompleteGrid()`

Generates a complete, valid 9x9 Sudoku grid using backtracking.

### `createPuzzle()`

Removes numbers from the complete grid to create a puzzle with unique solution.

### `shuffleGrid()`

Shuffles the complete grid to create variety while maintaining validity.

### `hasUniqueSolution()`

Verifies that the generated puzzle has exactly one solution.

### `findAllSolutions(grid, solutions, maxSolutions)`

Finds multiple solutions to verify uniqueness (used internally).

### `shuffleArray(array)`

Utility method for array shuffling using Fisher-Yates algorithm.

## Properties

### `grid`
- **Type:** `Array<Array<number>>`
- **Description:** Current puzzle state (9x9 array with 0 for empty cells)

### `solution`
- **Type:** `Array<Array<number>>`
- **Description:** Complete solution to the current puzzle

### `initialGrid`
- **Type:** `Array<Array<number>>`
- **Description:** Initial puzzle state (for reset functionality)

### `difficulty`
- **Type:** `string`
- **Description:** Current difficulty level ('easy', 'medium', 'hard', 'expert')

### `difficultySettings`
- **Type:** `Object`
- **Description:** Configuration object defining clue counts for each difficulty

## Usage Patterns

### Complete Game Flow
```javascript
// Initialize engine
const engine = new SudokuEngine();

// Generate new puzzle
const puzzle = engine.generatePuzzle('medium');

// Game loop
while (!engine.isComplete(puzzle.grid)) {
    // Player makes a move
    const move = await getPlayerMove();
    
    if (engine.isValidMove(puzzle.grid, move.row, move.col, move.value)) {
        puzzle.grid[move.row][move.col] = move.value;
    } else {
        showErrorFeedback();
    }
}

console.log("Puzzle completed!");
```

### Hint System Integration
```javascript
function provideHint() {
    const hint = engine.getHint(currentGrid);
    
    if (hint) {
        // Highlight the cell
        ui.highlightCell(hint.row, hint.col);
        
        // Show hint dialog
        ui.showHintDialog(hint);
        
        // Track hint usage
        gameStats.hintsUsed++;
    } else {
        ui.showMessage("No more hints available!");
    }
}
```

## Performance Considerations

- **Grid Generation**: Average time ~10-50ms depending on difficulty
- **Validation**: O(1) for single cell, O(81) for full grid
- **Solving**: Exponential worst case, but typically fast for valid puzzles
- **Memory Usage**: Minimal - primarily three 9x9 arrays

## Error Handling

The engine throws `SudokuError` exceptions for:
- Invalid difficulty levels
- Malformed grid inputs
- Unsolvable puzzle generation (rare)

**Example:**
```javascript
try {
    const puzzle = engine.generatePuzzle('invalid');
} catch (error) {
    if (error instanceof SudokuError) {
        console.error(`Sudoku Engine Error: ${error.message}`);
    }
}
```

## Related Classes

- **[GameController](GameController.md)** - Uses SudokuEngine for game management
- **[SudokuUI](SudokuUI.md)** - Displays engine state and receives player input
- **[AchievementManager](AchievementManager.md)** - Tracks engine events for achievements

---

*For more information about the overall architecture, see the [Architecture Guide](../architecture/).*
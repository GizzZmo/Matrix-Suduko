/**
 * Sudoku Game Engine
 * Core logic for generating, solving, and validating Sudoku puzzles
 * 
 * @author Matrix Sudoku Team
 * @version 1.0.0
 */

class SudokuEngine {
    /**
     * Initialize the Sudoku engine
     */
    constructor() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.initialGrid = Array(9).fill().map(() => Array(9).fill(0));
        this.difficulty = 'medium';
        this.difficultySettings = {
            easy: { clues: 45 },
            medium: { clues: 35 },
            hard: { clues: 25 },
            expert: { clues: 17 }
        };
    }

    /**
     * Generate a new Sudoku puzzle
     * @param {string} difficulty - Difficulty level (easy, medium, hard, expert)
     * @returns {Object} Generated puzzle with grid and solution
     */
    generatePuzzle(difficulty = 'medium') {
        this.difficulty = difficulty;
        
        // Create a complete valid Sudoku grid
        this.generateCompleteGrid();
        
        // Copy the complete grid as solution
        this.solution = this.grid.map(row => [...row]);
        
        // Remove numbers to create puzzle
        this.createPuzzle();
        
        // Store initial state
        this.initialGrid = this.grid.map(row => [...row]);
        
        return {
            grid: this.grid,
            solution: this.solution,
            difficulty: this.difficulty
        };
    }

    /**
     * Generate a complete valid 9x9 Sudoku grid
     */
    generateCompleteGrid() {
        // Reset grid
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        
        // Fill the grid using backtracking
        this.solvePuzzle(this.grid);
        
        // Shuffle the grid to create variety
        this.shuffleGrid();
    }

    /**
     * Solve a Sudoku puzzle using backtracking algorithm
     * @param {Array} grid - 9x9 grid to solve
     * @returns {boolean} True if solved, false if unsolvable
     */
    solvePuzzle(grid) {
        const empty = this.findEmptyCell(grid);
        if (!empty) {
            return true; // Puzzle solved
        }

        const [row, col] = empty;
        const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (let num of numbers) {
            if (this.isValidMove(grid, row, col, num)) {
                grid[row][col] = num;

                if (this.solvePuzzle(grid)) {
                    return true;
                }

                grid[row][col] = 0; // Backtrack
            }
        }

        return false;
    }

    /**
     * Solve puzzle with step-by-step tracking for animation
     * @param {Array} grid - 9x9 grid to solve
     * @param {Array} steps - Array to store solving steps
     * @returns {boolean} True if solved, false if unsolvable
     */
    solvePuzzleWithSteps(grid, steps = []) {
        const empty = this.findEmptyCell(grid);
        if (!empty) {
            return true; // Puzzle solved
        }

        const [row, col] = empty;
        
        // Use ordered numbers for more logical solving
        for (let num = 1; num <= 9; num++) {
            if (this.isValidMove(grid, row, col, num)) {
                grid[row][col] = num;
                steps.push({ row, col, value: num, type: 'place' });

                if (this.solvePuzzleWithSteps(grid, steps)) {
                    return true;
                }

                // Backtrack
                grid[row][col] = 0;
                steps.push({ row, col, value: 0, type: 'backtrack' });
            }
        }

        return false;
    }

    /**
     * Solve current puzzle using backtracking algorithm
     * @returns {Object} Solution result with success status and steps
     */
    solveCurrentPuzzle() {
        // Create a copy of current grid to solve
        const gridCopy = this.grid.map(row => [...row]);
        const steps = [];
        
        const solved = this.solvePuzzleWithSteps(gridCopy, steps);
        
        return {
            success: solved,
            solution: solved ? gridCopy : null,
            steps: steps.filter(step => step.type === 'place') // Only include placement steps for animation
        };
    }

    /**
     * Find the next empty cell in the grid
     * @param {Array} grid - 9x9 grid
     * @returns {Array|null} [row, col] of empty cell or null if none
     */
    findEmptyCell(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    return [row, col];
                }
            }
        }
        return null;
    }

    /**
     * Check if a move is valid according to Sudoku rules
     * @param {Array} grid - 9x9 grid
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {number} num - Number to place
     * @returns {boolean} True if valid move
     */
    isValidMove(grid, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) {
                return false;
            }
        }

        // Check column
        for (let x = 0; x < 9; x++) {
            if (grid[x][col] === num) {
                return false;
            }
        }

        // Check 3x3 box
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Create puzzle by removing numbers from complete grid
     */
    createPuzzle() {
        const clues = this.difficultySettings[this.difficulty].clues;
        const cellsToRemove = 81 - clues;
        
        let attempts = 0;
        let removed = 0;
        
        while (removed < cellsToRemove && attempts < 1000) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            
            if (this.grid[row][col] !== 0) {
                const backup = this.grid[row][col];
                this.grid[row][col] = 0;
                
                // Check if puzzle still has unique solution
                if (this.hasUniqueSolution()) {
                    removed++;
                } else {
                    this.grid[row][col] = backup; // Restore if multiple solutions
                }
            }
            attempts++;
        }
    }

    /**
     * Check if the puzzle has a unique solution
     * @returns {boolean} True if unique solution exists
     */
    hasUniqueSolution() {
        const testGrid = this.grid.map(row => [...row]);
        const solutions = [];
        
        this.findAllSolutions(testGrid, solutions, 2); // Stop after finding 2 solutions
        
        return solutions.length === 1;
    }

    /**
     * Find all possible solutions (up to maxSolutions)
     * @param {Array} grid - Grid to solve
     * @param {Array} solutions - Array to store solutions
     * @param {number} maxSolutions - Maximum solutions to find
     * @returns {boolean} True if should continue searching
     */
    findAllSolutions(grid, solutions, maxSolutions) {
        if (solutions.length >= maxSolutions) {
            return false;
        }

        const empty = this.findEmptyCell(grid);
        if (!empty) {
            solutions.push(grid.map(row => [...row]));
            return solutions.length < maxSolutions;
        }

        const [row, col] = empty;

        for (let num = 1; num <= 9; num++) {
            if (this.isValidMove(grid, row, col, num)) {
                grid[row][col] = num;

                if (!this.findAllSolutions(grid, solutions, maxSolutions)) {
                    grid[row][col] = 0;
                    return false;
                }

                grid[row][col] = 0;
            }
        }

        return true;
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Shuffle the complete grid for variety
     */
    shuffleGrid() {
        // Shuffle rows within each 3-row group
        for (let group = 0; group < 3; group++) {
            const rows = [group * 3, group * 3 + 1, group * 3 + 2];
            const shuffledRows = this.shuffleArray(rows);
            
            const tempGrid = this.grid.map(row => [...row]);
            for (let i = 0; i < 3; i++) {
                this.grid[group * 3 + i] = tempGrid[shuffledRows[i]];
            }
        }

        // Shuffle columns within each 3-column group
        for (let group = 0; group < 3; group++) {
            const cols = [group * 3, group * 3 + 1, group * 3 + 2];
            const shuffledCols = this.shuffleArray(cols);
            
            for (let row = 0; row < 9; row++) {
                const tempRow = [...this.grid[row]];
                for (let i = 0; i < 3; i++) {
                    this.grid[row][group * 3 + i] = tempRow[shuffledCols[i]];
                }
            }
        }
    }

    /**
     * Validate the current state of the puzzle
     * @param {Array} grid - Current grid state
     * @returns {Object} Validation result with errors
     */
    validatePuzzle(grid) {
        const errors = [];
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] !== 0) {
                    const num = grid[row][col];
                    grid[row][col] = 0; // Temporarily remove to check validity
                    
                    if (!this.isValidMove(grid, row, col, num)) {
                        errors.push({ row, col, value: num });
                    }
                    
                    grid[row][col] = num; // Restore
                }
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Check if the puzzle is complete
     * @param {Array} grid - Grid to check
     * @returns {boolean} True if complete
     */
    isComplete(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    return false;
                }
            }
        }
        return this.validatePuzzle(grid).isValid;
    }

    /**
     * Get a hint for the current puzzle
     * @param {Array} grid - Current grid state
     * @returns {Object|null} Hint with row, col, and value
     */
    getHint(grid) {
        const emptyCells = [];
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length === 0) {
            return null;
        }
        
        // Find a cell with the fewest possible values (most constrained)
        let bestCell = null;
        let minPossibilities = 10;
        
        for (let cell of emptyCells) {
            const possibilities = this.getPossibleValues(grid, cell.row, cell.col);
            if (possibilities.length < minPossibilities) {
                minPossibilities = possibilities.length;
                bestCell = cell;
                
                if (minPossibilities === 1) {
                    break; // Found a cell with only one possibility
                }
            }
        }
        
        if (bestCell) {
            return {
                row: bestCell.row,
                col: bestCell.col,
                value: this.solution[bestCell.row][bestCell.col]
            };
        }
        
        return null;
    }

    /**
     * Get possible values for a cell
     * @param {Array} grid - Current grid
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {Array} Array of possible values
     */
    getPossibleValues(grid, row, col) {
        const possibilities = [];
        
        for (let num = 1; num <= 9; num++) {
            if (this.isValidMove(grid, row, col, num)) {
                possibilities.push(num);
            }
        }
        
        return possibilities;
    }

    /**
     * Get the current grid state
     * @returns {Array} Current grid
     */
    getGrid() {
        return this.grid;
    }

    /**
     * Get the solution grid
     * @returns {Array} Solution grid
     */
    getSolution() {
        return this.solution;
    }

    /**
     * Check if a cell was given in the initial puzzle
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {boolean} True if cell was given
     */
    isGivenCell(row, col) {
        return this.initialGrid[row][col] !== 0;
    }
}
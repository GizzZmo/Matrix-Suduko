/**
 * Sudoku Engine Tests
 * Unit tests for the core Sudoku game logic
 * 
 * @author Matrix Sudoku Team
 * @version 1.0.0
 */

// Since we're in browser environment, we'll simulate basic test functionality
class SudokuEngineTests {
    constructor() {
        this.passed = 0;
        this.failed = 0;
        this.engine = new SudokuEngine();
    }

    /**
     * Run all tests
     */
    runAll() {
        console.log('🧪 Running Sudoku Engine Tests...\n');
        
        this.testPuzzleGeneration();
        this.testValidation();
        this.testSolving();
        this.testHints();
        this.testDifficultyLevels();
        
        this.printResults();
    }

    /**
     * Test puzzle generation
     */
    testPuzzleGeneration() {
        console.log('Testing puzzle generation...');
        
        // Test that a puzzle is generated
        const puzzle = this.engine.generatePuzzle('medium');
        this.assert(puzzle !== null, 'Puzzle should be generated');
        this.assert(puzzle.grid !== null, 'Puzzle should have a grid');
        this.assert(puzzle.solution !== null, 'Puzzle should have a solution');
        
        // Test grid dimensions
        this.assert(puzzle.grid.length === 9, 'Grid should have 9 rows');
        this.assert(puzzle.grid[0].length === 9, 'Grid should have 9 columns');
        
        // Test that some cells are filled (clues)
        let filledCells = 0;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (puzzle.grid[row][col] !== 0) {
                    filledCells++;
                }
            }
        }
        this.assert(filledCells > 0, 'Puzzle should have some filled cells');
        this.assert(filledCells < 81, 'Puzzle should not be completely filled');
        
        console.log('✅ Puzzle generation tests passed\n');
    }

    /**
     * Test validation logic
     */
    testValidation() {
        console.log('Testing validation logic...');
        
        // Create a test grid with a known conflict
        const testGrid = Array(9).fill().map(() => Array(9).fill(0));
        testGrid[0][0] = 1;
        testGrid[0][1] = 1; // Duplicate in same row
        
        this.assert(!this.engine.isValidMove(testGrid, 0, 1, 1), 'Should detect row conflict');
        this.assert(this.engine.isValidMove(testGrid, 1, 1, 1), 'Should allow valid move');
        
        // Test column conflict
        testGrid[1][0] = 2;
        this.assert(!this.engine.isValidMove(testGrid, 1, 0, 1), 'Should detect column conflict');
        
        // Test 3x3 box conflict
        testGrid[1][1] = 3;
        this.assert(!this.engine.isValidMove(testGrid, 2, 2, 3), 'Should detect box conflict');
        
        console.log('✅ Validation tests passed\n');
    }

    /**
     * Test solving algorithm
     */
    testSolving() {
        console.log('Testing solving algorithm...');
        
        // Create a simple puzzle
        const simpleGrid = Array(9).fill().map(() => Array(9).fill(0));
        
        // Add some clues to make it solvable
        simpleGrid[0][0] = 1;
        simpleGrid[0][1] = 2;
        simpleGrid[1][0] = 3;
        
        const solved = this.engine.solvePuzzle(simpleGrid);
        this.assert(solved, 'Should be able to solve a valid puzzle');
        
        // Verify solution
        const validation = this.engine.validatePuzzle(simpleGrid);
        this.assert(validation.isValid, 'Solved puzzle should be valid');
        
        console.log('✅ Solving tests passed\n');
    }

    /**
     * Test hint system
     */
    testHints() {
        console.log('Testing hint system...');
        
        // Generate a puzzle and get a hint
        const puzzle = this.engine.generatePuzzle('easy');
        const hint = this.engine.getHint(puzzle.grid);
        
        if (hint) {
            this.assert(hint.row >= 0 && hint.row < 9, 'Hint row should be valid');
            this.assert(hint.col >= 0 && hint.col < 9, 'Hint col should be valid');
            this.assert(hint.value >= 1 && hint.value <= 9, 'Hint value should be valid');
            
            // Verify the hint is correct
            const correctValue = puzzle.solution[hint.row][hint.col];
            this.assert(hint.value === correctValue, 'Hint should provide correct value');
        }
        
        console.log('✅ Hint tests passed\n');
    }

    /**
     * Test different difficulty levels
     */
    testDifficultyLevels() {
        console.log('Testing difficulty levels...');
        
        const difficulties = ['easy', 'medium', 'hard', 'expert'];
        const expectedClues = { easy: 45, medium: 35, hard: 25, expert: 17 };
        
        difficulties.forEach(difficulty => {
            const puzzle = this.engine.generatePuzzle(difficulty);
            
            let clueCount = 0;
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (puzzle.grid[row][col] !== 0) {
                        clueCount++;
                    }
                }
            }
            
            // Allow some variance in clue count due to random generation
            const expected = expectedClues[difficulty];
            const tolerance = 5;
            this.assert(
                Math.abs(clueCount - expected) <= tolerance, 
                `${difficulty} should have approximately ${expected} clues (got ${clueCount})`
            );
        });
        
        console.log('✅ Difficulty level tests passed\n');
    }

    /**
     * Assert function for testing
     */
    assert(condition, message) {
        if (condition) {
            this.passed++;
        } else {
            this.failed++;
            console.error(`❌ FAILED: ${message}`);
        }
    }

    /**
     * Print test results
     */
    printResults() {
        const total = this.passed + this.failed;
        const passRate = ((this.passed / total) * 100).toFixed(1);
        
        console.log('🎯 Test Results:');
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📊 Pass rate: ${passRate}%`);
        
        if (this.failed === 0) {
            console.log('🎉 All tests passed!');
        } else {
            console.log('⚠️  Some tests failed. Please review the code.');
        }
    }
}

// Auto-run tests when in development mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for the engine to load
        setTimeout(() => {
            if (typeof SudokuEngine !== 'undefined') {
                const tests = new SudokuEngineTests();
                tests.runAll();
            }
        }, 1000);
    });
}

// Export for use in other environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SudokuEngineTests;
}
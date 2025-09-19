/**
 * Matrix Sudoku Web Server
 * Express.js server for web deployment of the game
 * 
 * @author Matrix Sudoku Team
 * @version 1.0.0
 */

const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

/**
 * Web server class for Matrix Sudoku
 */
class MatrixSudokuServer {
    /**
     * Initialize the server
     */
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        
        this.port = process.env.PORT || 3000;
        this.isDevelopment = process.env.NODE_ENV === 'development';
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSocket();
    }

    /**
     * Setup Express middleware
     */
    setupMiddleware() {
        // Security headers
        this.app.use((req, res, next) => {
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            
            // CSP for security
            res.setHeader('Content-Security-Policy', 
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline'; " +
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com; " +
                "img-src 'self' data:; " +
                "media-src 'self'; " +
                "connect-src 'self' ws: wss:;"
            );
            
            next();
        });

        // Static file serving
        this.app.use(express.static(path.join(__dirname, '../')));
        this.app.use('/assets', express.static(path.join(__dirname, '../assets')));
        this.app.use('/css', express.static(path.join(__dirname, '../css')));
        this.app.use('/js', express.static(path.join(__dirname, '../js')));

        // JSON parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Logging middleware
        if (this.isDevelopment) {
            this.app.use((req, res, next) => {
                console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
                next();
            });
        }
    }

    /**
     * Setup Express routes
     */
    setupRoutes() {
        // Main game route
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });

        // Game API routes
        this.app.get('/api/health', (req, res) => {
            res.json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                uptime: process.uptime()
            });
        });

        // Game statistics API
        this.app.get('/api/stats', (req, res) => {
            res.json({
                connectedPlayers: this.io.engine.clientsCount,
                totalGames: this.gameStats.totalGames,
                totalSolutions: this.gameStats.totalSolutions,
                averageTime: this.gameStats.averageTime
            });
        });

        // Save game state (for web version)
        this.app.post('/api/save-game', (req, res) => {
            try {
                const gameData = req.body;
                // In a real implementation, save to database
                // For now, just return success
                res.json({ success: true, message: 'Game saved successfully' });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Load game state (for web version)
        this.app.get('/api/load-game/:sessionId?', (req, res) => {
            try {
                const sessionId = req.params.sessionId;
                // In a real implementation, load from database
                // For now, return empty state
                res.json({ success: true, data: null });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // High scores API
        this.app.get('/api/leaderboard/:difficulty?', (req, res) => {
            const difficulty = req.params.difficulty || 'all';
            // In a real implementation, fetch from database
            res.json({
                difficulty: difficulty,
                scores: [
                    { rank: 1, time: '02:15', errors: 0, difficulty: 'expert', date: '2024-01-15' },
                    { rank: 2, time: '02:33', errors: 1, difficulty: 'expert', date: '2024-01-14' },
                    { rank: 3, time: '03:01', errors: 0, difficulty: 'hard', date: '2024-01-13' }
                ]
            });
        });

        // 404 handler
        this.app.use((req, res) => {
            res.status(404).sendFile(path.join(__dirname, 'index.html'));
        });

        // Error handler
        this.app.use((error, req, res, next) => {
            console.error('Server error:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: this.isDevelopment ? error.message : 'Something went wrong'
            });
        });
    }

    /**
     * Setup Socket.IO for real-time features
     */
    setupSocket() {
        this.gameStats = {
            totalGames: 0,
            totalSolutions: 0,
            averageTime: 0,
            connectedPlayers: 0
        };

        this.io.on('connection', (socket) => {
            this.gameStats.connectedPlayers++;
            console.log(`Player connected: ${socket.id} (Total: ${this.gameStats.connectedPlayers})`);

            // Broadcast player count update
            this.io.emit('player-count', this.gameStats.connectedPlayers);

            // Handle game events
            socket.on('game-started', (data) => {
                this.gameStats.totalGames++;
                console.log(`Game started by ${socket.id}: ${data.difficulty}`);
            });

            socket.on('game-completed', (data) => {
                this.gameStats.totalSolutions++;
                
                // Update average time
                const totalTime = this.gameStats.averageTime * (this.gameStats.totalSolutions - 1);
                this.gameStats.averageTime = (totalTime + data.timeInSeconds) / this.gameStats.totalSolutions;
                
                console.log(`Game completed by ${socket.id}: ${data.timeElapsed} (${data.difficulty})`);
                
                // Broadcast achievement
                this.io.emit('player-completed', {
                    difficulty: data.difficulty,
                    time: data.timeElapsed,
                    errors: data.errors
                });
            });

            socket.on('hint-used', (data) => {
                console.log(`Hint used by ${socket.id}`);
            });

            socket.on('error-made', (data) => {
                console.log(`Error made by ${socket.id}`);
            });

            // Handle multiplayer features (future enhancement)
            socket.on('join-room', (roomId) => {
                socket.join(roomId);
                console.log(`Player ${socket.id} joined room ${roomId}`);
            });

            socket.on('leave-room', (roomId) => {
                socket.leave(roomId);
                console.log(`Player ${socket.id} left room ${roomId}`);
            });

            // Handle disconnect
            socket.on('disconnect', () => {
                this.gameStats.connectedPlayers--;
                console.log(`Player disconnected: ${socket.id} (Total: ${this.gameStats.connectedPlayers})`);
                this.io.emit('player-count', this.gameStats.connectedPlayers);
            });
        });
    }

    /**
     * Start the server
     */
    start() {
        this.server.listen(this.port, () => {
            console.log(`
╔═══════════════════════════════════════╗
║         MATRIX SUDOKU SERVER         ║
╠═══════════════════════════════════════╣
║ Status: Running                       ║
║ Port: ${this.port.toString().padEnd(30)} ║
║ Environment: ${(this.isDevelopment ? 'Development' : 'Production').padEnd(21)} ║
║ URL: http://localhost:${this.port.toString().padEnd(16)} ║
╚═══════════════════════════════════════╝
            `);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received, shutting down gracefully');
            this.server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('SIGINT received, shutting down gracefully');
            this.server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });
    }

    /**
     * Stop the server
     */
    stop() {
        return new Promise((resolve) => {
            this.server.close(resolve);
        });
    }
}

// Start server if run directly
if (require.main === module) {
    const server = new MatrixSudokuServer();
    server.start();
}

module.exports = MatrixSudokuServer;
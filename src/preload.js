/**
 * Electron Preload Script
 * Provides secure communication between main and renderer processes
 * 
 * @author Matrix Sudoku Team
 * @version 1.0.0
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    /**
     * Save game data to local storage
     * @param {Object} gameData - Game data to save
     * @returns {Promise<Object>} Save result
     */
    saveGame: (gameData) => ipcRenderer.invoke('save-game', gameData),
    
    /**
     * Load game data from local storage
     * @returns {Promise<Object>} Load result with game data
     */
    loadGame: () => ipcRenderer.invoke('load-game'),
    
    /**
     * Export game data to file
     * @param {Object} gameData - Game data to export
     * @returns {Promise<Object>} Export result
     */
    exportGame: (gameData) => ipcRenderer.invoke('export-game', gameData),
    
    /**
     * Import game data from file
     * @returns {Promise<Object>} Import result with game data
     */
    importGame: () => ipcRenderer.invoke('import-game'),
    
    /**
     * Get application information
     * @returns {Promise<Object>} Application info
     */
    getAppInfo: () => ipcRenderer.invoke('get-app-info'),
    
    /**
     * Listen for menu actions
     * @param {Function} callback - Callback function
     */
    onMenuAction: (callback) => {
        ipcRenderer.on('menu-action', (event, action) => callback(action));
    },
    
    /**
     * Remove menu action listener
     * @param {Function} callback - Callback function to remove
     */
    removeMenuActionListener: (callback) => {
        ipcRenderer.removeListener('menu-action', callback);
    },
    
    /**
     * Platform information
     */
    platform: process.platform,
    
    /**
     * Check if running in Electron
     */
    isElectron: true
});
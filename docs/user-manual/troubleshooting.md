# Troubleshooting Guide

This guide helps you resolve common issues with Matrix Sudoku.

## 🚨 Common Issues

### Application Won't Start

#### Desktop Application (Electron)

**Symptoms:**
- Application window doesn't appear
- Error messages during startup
- Immediate crash after launch

**Solutions:**

1. **Check System Requirements**
   ```bash
   # Verify Node.js version
   node --version  # Should be 16.x or higher
   
   # Check available memory
   free -h  # Linux
   # Or Activity Monitor on macOS, Task Manager on Windows
   ```

2. **Clear Application Data**
   ```bash
   # Windows
   del /f /s /q "%APPDATA%/Matrix Sudoku"
   
   # macOS
   rm -rf ~/Library/Application\ Support/Matrix\ Sudoku
   
   # Linux
   rm -rf ~/.config/Matrix\ Sudoku
   ```

3. **Run from Terminal for Debug Info**
   ```bash
   # Navigate to installation directory and run
   ./Matrix\ Sudoku --debug
   
   # Or on Windows
   "Matrix Sudoku.exe" --debug
   ```

4. **Reinstall Application**
   - Uninstall completely
   - Download latest version
   - Install with administrator privileges

#### Web Application (Browser)

**Symptoms:**
- Page doesn't load
- White screen or error messages
- Features not working

**Solutions:**

1. **Check Browser Compatibility**
   - Chrome 80+ ✅
   - Firefox 75+ ✅
   - Safari 13+ ✅
   - Edge 80+ ✅
   - Internet Explorer ❌ (Not supported)

2. **Clear Browser Data**
   ```javascript
   // Open browser console (F12) and run:
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

3. **Disable Browser Extensions**
   - Open incognito/private mode
   - Disable ad blockers temporarily
   - Try different browser

4. **Check Console for Errors**
   - Press F12 to open developer tools
   - Look for red error messages in Console tab
   - Take screenshot and report if needed

### Performance Issues

#### Slow Performance

**Symptoms:**
- Lag when clicking cells
- Slow animations
- High CPU/memory usage

**Solutions:**

1. **Reduce Visual Effects**
   ```javascript
   // Open browser console and run:
   localStorage.setItem('matrixSudokuSettings', JSON.stringify({
     animationsEnabled: false,
     matrixEffectIntensity: 'low'
   }));
   location.reload();
   ```

2. **Close Other Applications**
   - Free up system memory
   - Close unnecessary browser tabs
   - Stop background applications

3. **Update Graphics Drivers**
   - Visit manufacturer website
   - Download latest drivers
   - Restart computer after installation

4. **Lower Game Settings**
   - Settings → Visual → Animation Speed: Slow
   - Settings → Visual → Background Effects: Minimal
   - Settings → Audio → Disable sound effects

#### High Memory Usage

**Symptoms:**
- Computer becomes slow
- Browser crashes
- "Out of memory" errors

**Solutions:**

1. **Monitor Memory Usage**
   ```bash
   # Check browser memory usage
   # Chrome: chrome://memory-redirect/
   # Firefox: about:memory
   ```

2. **Clear Game Data Periodically**
   ```javascript
   // Clear saved games (keeps settings)
   localStorage.removeItem('matrixSudokuSaves');
   ```

3. **Restart Browser Regularly**
   - Close and reopen browser
   - Clear cache and cookies
   - Disable memory-heavy extensions

### Game Logic Issues

#### Puzzle Won't Generate

**Symptoms:**
- "Generating puzzle..." message stuck
- Error when starting new game
- Invalid puzzle layouts

**Solutions:**

1. **Clear Puzzle Cache**
   ```javascript
   localStorage.removeItem('matrixSudokuPuzzleCache');
   location.reload();
   ```

2. **Try Different Difficulty**
   - Start with Easy difficulty
   - Gradually increase difficulty
   - Report if specific difficulty always fails

3. **Check for JavaScript Errors**
   - Open browser console
   - Look for red error messages
   - Refresh page and try again

#### Validation Errors

**Symptoms:**
- Valid moves marked as invalid
- Invalid moves accepted
- Puzzle completion not detected

**Solutions:**

1. **Reset Current Game**
   - Game Menu → Reset Puzzle
   - Or refresh browser page

2. **Clear Game State**
   ```javascript
   localStorage.removeItem('matrixSudokuCurrentGame');
   location.reload();
   ```

3. **Report Bug with Screenshot**
   - Take screenshot of issue
   - Note steps to reproduce
   - Submit to GitHub Issues

### Audio Issues

#### No Sound Effects

**Symptoms:**
- Game is silent
- Sound settings show as enabled
- Other audio works fine

**Solutions:**

1. **Check Browser Audio Permissions**
   - Click lock icon in address bar
   - Allow audio for the site
   - Refresh page

2. **Verify Audio Settings**
   ```javascript
   // Check if audio is enabled
   const settings = JSON.parse(localStorage.getItem('matrixSudokuSettings') || '{}');
   console.log('Audio enabled:', settings.audioEnabled);
   ```

3. **Test Audio Context**
   ```javascript
   // Test if browser supports audio
   try {
     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
     console.log('Audio context created successfully');
   } catch (error) {
     console.error('Audio not supported:', error);
   }
   ```

4. **Try Different Browser**
   - Some browsers block autoplay audio
   - User interaction required for audio
   - Check browser audio policies

#### Audio Lag or Glitches

**Solutions:**

1. **Adjust Audio Buffer Size**
   ```javascript
   // Lower audio quality for better performance
   localStorage.setItem('matrixSudokuAudioQuality', 'low');
   ```

2. **Disable Background Music**
   - Keep only essential sound effects
   - Settings → Audio → Background Music: Off

3. **Update Audio Drivers**
   - System-specific driver updates
   - Restart after installation

### Save/Load Issues

#### Game Progress Lost

**Symptoms:**
- Previous games don't appear
- Statistics reset to zero
- Settings reverted to defaults

**Solutions:**

1. **Check Local Storage**
   ```javascript
   // Verify saved data exists
   console.log('Saved games:', localStorage.getItem('matrixSudokuSaves'));
   console.log('Settings:', localStorage.getItem('matrixSudokuSettings'));
   console.log('Statistics:', localStorage.getItem('matrixSudokuStats'));
   ```

2. **Restore from Backup**
   ```javascript
   // If you have backup data
   localStorage.setItem('matrixSudokuSaves', backupData);
   location.reload();
   ```

3. **Enable Persistent Storage**
   ```javascript
   // Request persistent storage
   if ('storage' in navigator && 'persist' in navigator.storage) {
     navigator.storage.persist().then(granted => {
       console.log('Persistent storage:', granted);
     });
   }
   ```

#### Export/Import Failures

**Solutions:**

1. **Check File Format**
   - Export creates JSON files
   - Ensure file extension is .json
   - Verify file isn't corrupted

2. **Manual Data Transfer**
   ```javascript
   // Export data manually
   const gameData = {
     saves: localStorage.getItem('matrixSudokuSaves'),
     settings: localStorage.getItem('matrixSudokuSettings'),
     stats: localStorage.getItem('matrixSudokuStats')
   };
   console.log(JSON.stringify(gameData, null, 2));
   ```

3. **File Size Limits**
   - Browser storage limits (~5-10MB)
   - Clean old save files
   - Export/import in smaller chunks

### Theme and Visual Issues

#### Theme Not Loading

**Symptoms:**
- Theme appears broken or default
- Colors don't change when switching themes
- Matrix effects not working

**Solutions:**

1. **Clear Theme Cache**
   ```javascript
   localStorage.removeItem('matrixSudokuTheme');
   localStorage.removeItem('matrixSudokuThemeCache');
   location.reload();
   ```

2. **Reset to Default Theme**
   ```javascript
   localStorage.setItem('matrixSudokuTheme', 'matrix');
   location.reload();
   ```

3. **Check CSS Loading**
   - Open browser console
   - Look for 404 errors for CSS files
   - Verify network connectivity

#### Matrix Background Not Animating

**Solutions:**

1. **Check Canvas Support**
   ```javascript
   const canvas = document.createElement('canvas');
   const ctx = canvas.getContext('2d');
   console.log('Canvas supported:', !!ctx);
   ```

2. **Enable Hardware Acceleration**
   - Browser settings → Advanced → Use hardware acceleration
   - Restart browser after enabling

3. **Reduce Animation Complexity**
   ```javascript
   localStorage.setItem('matrixSudokuMatrixDensity', 'low');
   location.reload();
   ```

### Mobile-Specific Issues

#### Touch Input Problems

**Symptoms:**
- Cells don't respond to touch
- Accidental number entry
- Difficulty selecting small elements

**Solutions:**

1. **Adjust Touch Sensitivity**
   - Settings → Interface → Touch Sensitivity
   - Increase touch target size

2. **Use Portrait Mode**
   - Rotate device to portrait
   - Larger grid cells
   - Better number button layout

3. **Clear Touch Calibration**
   ```javascript
   localStorage.removeItem('matrixSudokuTouchCalibration');
   location.reload();
   ```

#### Performance on Mobile

**Solutions:**

1. **Optimize for Mobile**
   ```javascript
   localStorage.setItem('matrixSudokuMobileOptimizations', 'true');
   location.reload();
   ```

2. **Close Background Apps**
   - Free up device memory
   - Stop unnecessary processes
   - Restart device if needed

3. **Use Mobile-Optimized Theme**
   - Switch to "Classic" theme
   - Disable Matrix background effects
   - Reduce animation complexity

## 🔧 Advanced Troubleshooting

### Debug Mode

Enable debug mode for detailed logging:

```javascript
// Enable debug mode
localStorage.setItem('matrixSudokuDebug', 'true');
localStorage.setItem('matrixSudokuLogLevel', 'verbose');
location.reload();

// View debug logs
console.log('Debug logs:', localStorage.getItem('matrixSudokuDebugLogs'));
```

### Console Commands

Useful browser console commands:

```javascript
// Reset everything
localStorage.clear();
location.reload();

// View current game state
console.log(JSON.parse(localStorage.getItem('matrixSudokuCurrentGame') || '{}'));

// Force puzzle regeneration
localStorage.removeItem('matrixSudokuPuzzleCache');
// Then start new game

// Test performance
console.time('puzzle-generation');
// Generate puzzle
console.timeEnd('puzzle-generation');

// Memory usage
console.log('Memory usage:', performance.memory);
```

### Network Issues

For web version connectivity problems:

1. **Check Connection**
   ```bash
   ping github.io
   nslookup gizzmo.github.io
   ```

2. **Bypass Cache**
   - Ctrl+F5 (hard refresh)
   - Shift+Reload button
   - Incognito/private mode

3. **CDN Issues**
   - Check if fonts/assets load
   - Try different DNS servers
   - Use VPN if geo-restricted

### System-Specific Issues

#### Windows

**Common Problems:**
- Antivirus blocking application
- Windows Defender SmartScreen warnings
- Missing Visual C++ redistributables

**Solutions:**
```bash
# Run as administrator
Right-click → "Run as administrator"

# Check Windows version compatibility
winver

# Install Visual C++ redistributables
Download from Microsoft website
```

#### macOS

**Common Problems:**
- Gatekeeper security warnings
- App not signed by identified developer
- Permission issues

**Solutions:**
```bash
# Allow app in System Preferences
System Preferences → Security & Privacy → Allow anyway

# Remove quarantine attribute
xattr -d com.apple.quarantine "/path/to/Matrix Sudoku.app"

# Check permissions
ls -la "/Applications/Matrix Sudoku.app"
```

#### Linux

**Common Problems:**
- Missing shared libraries
- AppImage not executable
- Desktop integration issues

**Solutions:**
```bash
# Make AppImage executable
chmod +x Matrix-Sudoku.AppImage

# Check dependencies
ldd Matrix-Sudoku.AppImage

# Install missing libraries (Ubuntu/Debian)
sudo apt install libgtk-3-0 libxss1 libasound2
```

## 📞 Getting Help

### Before Reporting Issues

1. **Check this troubleshooting guide**
2. **Search existing GitHub issues**
3. **Try basic solutions** (restart, clear cache)
4. **Gather information** about your system

### Information to Include

When reporting issues, include:

- **Operating System** and version
- **Browser** and version (for web)
- **Application version** of Matrix Sudoku
- **Steps to reproduce** the issue
- **Error messages** (exact text)
- **Screenshots** if visual issue
- **Console log** if technical issue

### Where to Get Help

1. **GitHub Issues**: [Report bugs](https://github.com/GizzZmo/Matrix-Suduko/issues)
2. **GitHub Discussions**: [Ask questions](https://github.com/GizzZmo/Matrix-Suduko/discussions)
3. **Documentation**: [Read docs](../README.md)

### Creating Good Bug Reports

```markdown
**Environment:**
- OS: Windows 10 (version 21H2)
- Browser: Chrome 95.0.4638.69
- Matrix Sudoku version: 1.0.0

**Expected Behavior:**
Game should generate new puzzle when clicking "New Game"

**Actual Behavior:**
Button click does nothing, console shows error "Cannot read property..."

**Steps to Reproduce:**
1. Open Matrix Sudoku
2. Click "New Game" button
3. Select "Medium" difficulty
4. Error occurs

**Additional Information:**
- Issue started after clearing browser cache
- Works fine in incognito mode
- Screenshot attached
```

## ⚡ Quick Fixes

### Most Common Solutions

1. **Refresh the page** (Ctrl+F5)
2. **Clear browser cache** and cookies
3. **Disable browser extensions**
4. **Try incognito/private mode**
5. **Restart browser/application**
6. **Clear local storage**:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

### Emergency Reset

If nothing else works:

```javascript
// Nuclear option - reset everything
localStorage.clear();
sessionStorage.clear();
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
  });
}
location.reload();
```

---

*If your issue isn't covered here, please [create an issue](https://github.com/GizzZmo/Matrix-Suduko/issues/new) on GitHub with detailed information.*
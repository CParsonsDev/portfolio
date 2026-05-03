/**
 * main.js - Application Entry Point
 * Initializes the application and sets up all modules
 */

import { initializeEventListeners, updateSvgControlState, updateShapeIcon, updateGlobalShapeSelector } from './ui-handlers.js';

/**
 * Initialize the application
 */
function initializeApp() {
  // Initialize UI state
  updateSvgControlState();

  // Initialize shape icons
  ['cyan', 'magenta', 'yellow', 'black'].forEach(layer => updateShapeIcon(layer));

  // Initialize global shape selector based on channel shapes
  updateGlobalShapeSelector();

  // Set up all event listeners
  initializeEventListeners();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

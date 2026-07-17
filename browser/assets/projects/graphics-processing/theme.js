/**
 * theme.js - Dark/Light Mode Management
 * Handles theme switching with system preference detection
 */

import { themToggleBtn, darkModeToggle } from './dom.js';
import { setTheme, currentTheme } from './state.js';

const THEME_STORAGE_KEY = 'gp-theme';
const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';
const BODY_ELEMENT = document.body;

/**
 * Detect system preference for dark mode
 * @returns {boolean} True if system prefers dark mode
 */
export function getSystemTheme() {
  if (window.matchMedia) {
    return window.matchMedia(DARK_MEDIA_QUERY).matches;
  }
  return false;
}

/**
 * Get initial theme (from storage, system preference, or default)
 * @returns {string} 'light' or 'dark'
 */
export function getInitialTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored) return stored;
  return getSystemTheme() ? 'dark' : 'light';
}

/**
 * Apply theme to body element and state
 * @param {string} theme - 'light' or 'dark'
 */
export function applyTheme(theme) {
  const validTheme = theme === 'dark' ? 'dark' : 'light';
  BODY_ELEMENT.setAttribute('data-theme', validTheme);
  localStorage.setItem(THEME_STORAGE_KEY, validTheme);
  setTheme(validTheme);
  
  // Update toggle button appearance
  if (themToggleBtn) {
    themToggleBtn.textContent = validTheme === 'dark' ? '☀️' : '🌙';
    themToggleBtn.title = validTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
  
  // Sync checkbox
  if (darkModeToggle) {
    darkModeToggle.checked = validTheme === 'dark';
  }
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme() {
  const newTheme = BODY_ELEMENT.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

/**
 * Initialize theme and listen for system preference changes
 */
export function initializeTheme() {
  // Apply initial theme
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);
  
  // Listen for system preference changes
  if (window.matchMedia) {
    window.matchMedia(DARK_MEDIA_QUERY).addEventListener('change', (e) => {
      // Only apply system preference if user hasn't set explicit preference
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  // Listen for theme toggle button
  if (themToggleBtn) {
    themToggleBtn.addEventListener('click', toggleTheme);
  }
  
  // Listen for theme toggle checkbox in advanced settings
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
      applyTheme(darkModeToggle.checked ? 'dark' : 'light');
    });
  }
}

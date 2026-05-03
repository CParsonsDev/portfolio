/**
 * color-utils.js - Advanced Color Handling with Transparency
 * Provides cross-browser color picking with alpha channel support
 */

/**
 * Convert hex+alpha to RGBA object
 * @param {string} hex - Hex color code with alpha (e.g., "#FF0000FF")
 * @returns {object} {r, g, b, a, hex, rgb}
 */
export function parseHexAlpha(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = hex.length > 7 ? parseInt(hex.slice(7, 9), 16) : 255;
  
  return {
    r, g, b, a,
    hex: hex,
    rgb: { r, g, b, a },
    rgba: [r, g, b, a],
    css: `rgba(${r},${g},${b},${(a/255).toFixed(2)})`
  };
}

/**
 * Convert RGBA values to hex with alpha
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @param {number} a - Alpha (0-255)
 * @returns {string} Hex color with alpha
 */
export function rgbToHex(r, g, b, a = 255) {
  return '#' +
    Math.round(r).toString(16).padStart(2, '0') +
    Math.round(g).toString(16).padStart(2, '0') +
    Math.round(b).toString(16).padStart(2, '0') +
    Math.round(a).toString(16).padStart(2, '0');
}

/**
 * Create visual feedback for color with transparency
 * @param {string} hex - Hex color code with alpha
 * @returns {string} CSS background for color preview
 */
export function getColorPreview(hex) {
  const { r, g, b, a } = parseHexAlpha(hex);
  const alpha = (a / 255).toFixed(2);
  
  // Create checkerboard pattern for transparent colors
  if (a < 255) {
    return `linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc),
            linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc),
            linear-gradient(rgba(${r},${g},${b},${alpha}), rgba(${r},${g},${b},${alpha}))`;
  }
  
  return `rgb(${r},${g},${b})`;
}

/**
 * Format alpha as percentage for display
 * @param {number} alpha - Alpha value (0-255)
 * @returns {string} Formatted percentage
 */
export function formatAlpha(alpha) {
  return `${Math.round((alpha / 255) * 100)}%`;
}

/**
 * Get contrast color (black or white) for text on background
 * @param {string} hex - Hex color code
 * @returns {string} '#000000' or '#FFFFFF'
 */
export function getContrastColor(hex) {
  const { r, g, b } = parseHexAlpha(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Get channel color matching CMYK standards
 * @param {string} channel - 'cyan', 'magenta', 'yellow', 'black'
 * @returns {string} Channel hex color with full alpha
 */
export function getChannelColor(channel) {
  const colors = {
    cyan: '#00FFFFFF',
    magenta: '#FF00FFFF',
    yellow: '#FFFF00FF',
    black: '#000000FF'
  };
  return colors[channel] || '#000000FF';
}

/**
 * Interpolate between two colors at given alpha
 * @param {string} color - Hex color
 * @param {number} targetAlpha - Target alpha (0-255)
 * @returns {string} Color with new alpha
 */
export function setAlpha(color, targetAlpha) {
  const hex = color.slice(0, 7); // Remove existing alpha
  return hex + Math.round(targetAlpha).toString(16).padStart(2, '0');
}

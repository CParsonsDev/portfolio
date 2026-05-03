/**
 * utils.js - Utility Functions
 * Color conversion, blob URL management, and SVG utilities
 */

import { activeBlobURLs, clearBlobURLs } from './state.js';

/**
 * Convert hex color to RGBA array
 * @param {string} hex - Hex color code (e.g., "#FF00FFFF")
 * @returns {number[]} RGBA array [r, g, b, a]
 */
export function hexToRgba(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = hex.length > 7 ? parseInt(hex.slice(7, 9), 16) : 255;
  return [r, g, b, a];
}

/**
 * Convert RGBA array to hex color code
 * @param {number[]} rgba - RGBA array [r, g, b, a]
 * @returns {string} Hex color code
 */
export function rgbaToHex(rgba) {
  const [r, g, b, a] = rgba;
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${a.toString(16).padStart(2, '0')}`;
}

/**
 * Get background color as RGB string
 * @param {number[]} bgColor - RGBA array
 * @returns {string} CSS rgb() string
 */
export function getPaperRGB(bgColor) {
  return `rgb(${bgColor[0]},${bgColor[1]},${bgColor[2]})`;
}

/**
 * Revoke all active blob URLs to free memory
 */
export function revokeBlobURLs() {
  activeBlobURLs.forEach(URL.revokeObjectURL);
  clearBlobURLs();
}

/**
 * Create and track a blob URL
 * @param {Blob} blob - The blob object
 * @returns {string} Object URL
 */
export function createObjectURL(blob) {
  const url = URL.createObjectURL(blob);
  activeBlobURLs.push(url);
  return url;
}

/**
 * Create SVG data URL
 * @param {string} svg - SVG markup
 * @returns {string} Data URL
 */
export function createSvgDataURL(svg) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/**
 * Extract inner content from SVG markup
 * @param {string} svgText - Complete SVG markup
 * @returns {string} Content between <svg> tags
 */
export function extractSvgInnerContent(svgText) {
  const match = svgText.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  return match ? match[1].trim() : svgText.trim();
}

/**
 * Format alpha value as percentage string
 * @param {number} alpha - Alpha value (0-255)
 * @returns {string} Formatted percentage (e.g., "100%")
 */
export function formatAlpha(alpha) {
  const percent = Math.round((alpha / 255) * 100);
  return `${percent}%`;
}

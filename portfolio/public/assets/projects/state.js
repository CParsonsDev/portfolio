/**
 * state.js - Global State Management
 * Manages application state: colors, shapes, settings, and runtime variables
 */

export let currentPaper = 255;
export let loaded = false;
export let currentTheme = 'light'; // 'light' or 'dark'
export let splitPanelMode = false;

export const channelShapes = {
  cyan: 'circle',
  magenta: 'circle',
  yellow: 'circle',
  black: 'circle'
};

export const channelColors = {
  cyan: [0, 255, 255, 255],
  magenta: [255, 0, 255, 255],
  yellow: [255, 255, 0, 255],
  black: [0, 0, 0, 255]
};

export const channelAlpha = {
  cyan: 255,
  magenta: 255,
  yellow: 255,
  black: 255
};

export let bgColor = [255, 255, 255, 255];
export let bgAlpha = 255;

// SVG position offsets per channel (normalized, 0-2.0 relative to grid)
export const channelOffsetX = {
  cyan: 0,
  magenta: 0,
  yellow: 0,
  black: 0
};

export const channelOffsetY = {
  cyan: 0,
  magenta: 0,
  yellow: 0,
  black: 0
};

export const activeBlobURLs = [];

// Setters for reactive state
export function setLoaded(value) {
  loaded = value;
}

export function setCurrentPaper(value) {
  currentPaper = value;
}

export function setBgColor(value) {
  bgColor = value;
}

export function setBgAlpha(value) {
  bgAlpha = value;
}

export function setChannelColor(channel, value) {
  channelColors[channel] = value;
}

export function setChannelAlpha(channel, value) {
  channelAlpha[channel] = value;
}

export function setChannelShape(channel, value) {
  channelShapes[channel] = value;
}

export function setTheme(theme) {
  currentTheme = theme;
}

export function setSplitPanelMode(value) {
  splitPanelMode = value;
}

export function setChannelOffsetX(channel, value) {
  channelOffsetX[channel] = value;
}

export function setChannelOffsetY(channel, value) {
  channelOffsetY[channel] = value;
}

export function addBlobURL(url) {
  activeBlobURLs.push(url);
}

export function clearBlobURLs() {
  activeBlobURLs.length = 0;
}

// Export getter for loaded state
export function isLoaded() {
  return loaded;
}

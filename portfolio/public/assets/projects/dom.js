/**
 * dom.js - DOM Element References
 * Centralized collection of all DOM element queries and canvas context
 */

// Page elements
export const htmlElement = document.documentElement;
export const advancedSettingsBtn = document.getElementById('advancedSettingsBtn');
export const advancedSettingsPanel = document.getElementById('advancedSettingsPanel');
export const themToggleBtn = document.getElementById('themToggleBtn');
export const darkModeToggle = document.getElementById('darkModeToggle');
export const splitPanelToggle = document.getElementById('splitPanelToggle');

export const fileInput = document.getElementById('fileInput');
export const processBtn = document.getElementById('processBtn');
export const stats = document.getElementById('stats');
export const cSlider = document.getElementById('cSlider');
export const mSlider = document.getElementById('mSlider');
export const ySlider = document.getElementById('ySlider');
export const kSlider = document.getElementById('kSlider');
export const resetBtn = document.getElementById('resetBtn');
export const sourceCanvas = document.getElementById('sourceCanvas');
export const gridSlider = document.getElementById('gridSlider');
export const shapeSelect = document.getElementById('shapeSelect');
export const rotSlider = document.getElementById('rotSlider');
export const jitterSlider = document.getElementById('jitterSlider');
export const colorizeCheck = document.getElementById('colorizeCheck');
export const multiLayerCheck = document.getElementById('multiLayerCheck');
export const adaptiveCheck = document.getElementById('adaptiveCheck');
export const renderMode = document.getElementById('renderMode');
export const cVal = document.getElementById('cVal');
export const mVal = document.getElementById('mVal');
export const yVal = document.getElementById('yVal');
export const kVal = document.getElementById('kVal');
export const gridVal = document.getElementById('gridVal');
export const rotVal = document.getElementById('rotVal');
export const jitterVal = document.getElementById('jitterVal');
// Per-channel offset sliders
export const offsetXSliderCyan = document.getElementById('offsetXSliderCyan');
export const offsetYSliderCyan = document.getElementById('offsetYSliderCyan');
export const offsetXValCyan = document.getElementById('offsetXValCyan');
export const offsetYValCyan = document.getElementById('offsetYValCyan');
export const offsetXSliderMagenta = document.getElementById('offsetXSliderMagenta');
export const offsetYSliderMagenta = document.getElementById('offsetYSliderMagenta');
export const offsetXValMagenta = document.getElementById('offsetXValMagenta');
export const offsetYValMagenta = document.getElementById('offsetYValMagenta');
export const offsetXSliderYellow = document.getElementById('offsetXSliderYellow');
export const offsetYSliderYellow = document.getElementById('offsetYSliderYellow');
export const offsetXValYellow = document.getElementById('offsetXValYellow');
export const offsetYValYellow = document.getElementById('offsetYValYellow');
export const offsetXSliderBlack = document.getElementById('offsetXSliderBlack');
export const offsetYSliderBlack = document.getElementById('offsetYSliderBlack');
export const offsetXValBlack = document.getElementById('offsetXValBlack');
export const offsetYValBlack = document.getElementById('offsetYValBlack');
export const shapeSelectCyan = document.getElementById('shapeSelectCyan');
export const shapeSelectMagenta = document.getElementById('shapeSelectMagenta');
export const shapeSelectYellow = document.getElementById('shapeSelectYellow');
export const shapeSelectBlack = document.getElementById('shapeSelectBlack');
export const shapeIconCyan = document.getElementById('shapeIconCyan');
export const shapeIconMagenta = document.getElementById('shapeIconMagenta');
export const shapeIconYellow = document.getElementById('shapeIconYellow');
export const shapeIconBlack = document.getElementById('shapeIconBlack');
export const colorPickerCyan = document.getElementById('colorPickerCyan');
export const colorPickerMagenta = document.getElementById('colorPickerMagenta');
export const colorPickerYellow = document.getElementById('colorPickerYellow');
export const colorPickerBlack = document.getElementById('colorPickerBlack');
export const alphaSliderCyan = document.getElementById('alphaSliderCyan');
export const alphaSliderMagenta = document.getElementById('alphaSliderMagenta');
export const alphaSliderYellow = document.getElementById('alphaSliderYellow');
export const alphaSliderBlack = document.getElementById('alphaSliderBlack');
export const alphaCyanVal = document.getElementById('alphaCyanVal');
export const alphaMagentaVal = document.getElementById('alphaMagentaVal');
export const alphaYellowVal = document.getElementById('alphaYellowVal');
export const alphaBlackVal = document.getElementById('alphaBlackVal');
export const resetColorCyan = document.getElementById('resetColorCyan');
export const resetColorMagenta = document.getElementById('resetColorMagenta');
export const resetColorYellow = document.getElementById('resetColorYellow');
export const resetColorBlack = document.getElementById('resetColorBlack');
export const bgColorPicker = document.getElementById('bgColorPicker');
export const bgAlphaSlider = document.getElementById('bgAlphaSlider');
export const bgAlphaVal = document.getElementById('bgAlphaVal');
export const resetBgColor = document.getElementById('resetBgColor');
export const svgControlGroup = document.querySelector('.svg-controls');
export const svgControlInputs = svgControlGroup ? svgControlGroup.querySelectorAll('input, select') : [];
export const previewRow = document.getElementById('previewRow');

export const ctx = sourceCanvas.getContext('2d', { willReadFrequently: true });

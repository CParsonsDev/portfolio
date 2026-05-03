/**
 * ui-handlers.js - UI Event Handlers
 * All event listeners for user interactions
 */

import {
  fileInput, processBtn, cSlider, mSlider, ySlider, kSlider,
  resetBtn, sourceCanvas, gridSlider, shapeSelect,
  rotSlider, jitterSlider, colorizeCheck, multiLayerCheck,
  adaptiveCheck, renderMode, cVal, mVal, yVal, kVal, gridVal,
  rotVal, jitterVal, shapeSelectCyan, shapeSelectMagenta,
  shapeSelectYellow, shapeSelectBlack, colorPickerCyan,
  colorPickerMagenta, colorPickerYellow, colorPickerBlack,
  resetColorCyan, resetColorMagenta, resetColorYellow,
  resetColorBlack, bgColorPicker, resetBgColor, stats,
  svgControlGroup, svgControlInputs, alphaSliderCyan, alphaSliderMagenta,
  alphaSliderYellow, alphaSliderBlack, bgAlphaSlider, alphaCyanVal,
  alphaMagentaVal, alphaYellowVal, alphaBlackVal, bgAlphaVal,
  advancedSettingsBtn, advancedSettingsPanel, themToggleBtn, 
  darkModeToggle, splitPanelToggle,
  offsetXSliderCyan, offsetYSliderCyan, offsetXValCyan, offsetYValCyan,
  offsetXSliderMagenta, offsetYSliderMagenta, offsetXValMagenta, offsetYValMagenta,
  offsetXSliderYellow, offsetYSliderYellow, offsetXValYellow, offsetYValYellow,
  offsetXSliderBlack, offsetYSliderBlack, offsetXValBlack, offsetYValBlack
} from './dom.js';
import {
  setLoaded, setCurrentPaper, setBgColor, setChannelColor,
  setChannelShape, setChannelAlpha, setBgAlpha, setSplitPanelMode,
  setChannelOffsetX, setChannelOffsetY,
  channelColors, channelShapes, bgColor, isLoaded
} from './state.js';
import { hexToRgba, rgbaToHex, formatAlpha } from './utils.js';
import { processImage } from './image-processor.js';
import { isSVGMode } from './renderers.js';
import { toggleTheme, initializeTheme } from './theme.js';

const ctx = sourceCanvas.getContext('2d', { willReadFrequently: true });

/**
 * Update SVG control state based on render mode
 */
export function updateSvgControlState() {
  const enabled = isSVGMode();
  if (!svgControlGroup) return;
  svgControlGroup.classList.toggle('disabled', !enabled);
  svgControlInputs.forEach((el) => {
    el.disabled = !enabled;
  });
}

/**
 * Update shape icon display
 */
export function updateShapeIcon(layerName) {
  const shape = channelShapes[layerName];
  const iconEl = document.getElementById(`shapeIcon${layerName.charAt(0).toUpperCase() + layerName.slice(1)}`);
  if (shape === 'circle') iconEl.textContent = '○';
  else if (shape === 'square') iconEl.textContent = '□';
  else if (shape === 'triangle') iconEl.textContent = '△';
}

/**
 * Update global shape selector based on channel shapes
 * If all channels have the same shape, set selector to that shape
 * Otherwise, set selector to "assorted"
 */
export function updateGlobalShapeSelector() {
  const shapes = ['cyan', 'magenta', 'yellow', 'black'].map(ch => channelShapes[ch]);
  const allSame = shapes.every(shape => shape === shapes[0]);
  
  if (allSame) {
    shapeSelect.value = shapes[0];
  } else {
    shapeSelect.value = 'assorted';
  }
}

/**
 * Initialize all event listeners
 */
export function initializeEventListeners() {
  // File input
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const max = 600;
      let w = img.width;
      let h = img.height;
      if (w > max) {
        h = Math.round(h * (max / w));
        w = max;
      }
      sourceCanvas.width = w;
      sourceCanvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      setLoaded(true);
      processBtn.disabled = false;
      stats.textContent = `Loaded ${img.width}x${img.height} -> ${w}x${h}`;
    };
    img.src = URL.createObjectURL(file);
  });

  // Process button
  processBtn.addEventListener('click', processImage);

  // Grid slider
  gridSlider.addEventListener('input', () => {
    gridVal.textContent = gridSlider.value;
    isLoaded() && processImage();
  });

  // General mode changes (excluding shapeSelect which has custom logic)
  [colorizeCheck, multiLayerCheck, adaptiveCheck, renderMode].forEach((el) =>
    el.addEventListener('change', () => isLoaded() && processImage())
  );

  // Rotation and jitter sliders
  [rotSlider, jitterSlider].forEach((el) =>
    el.addEventListener('input', () => {
      rotVal.textContent = rotSlider.value;
      jitterVal.textContent = jitterSlider.value;
      isLoaded() && processImage();
    })
  );

  // Per-channel position offset sliders (SVG mode only)
  offsetXSliderCyan.addEventListener('input', () => {
    const offsetX = parseFloat(offsetXSliderCyan.value);
    setChannelOffsetX('cyan', offsetX);
    offsetXValCyan.textContent = offsetX.toFixed(1);
    isLoaded() && processImage();
  });

  offsetYSliderCyan.addEventListener('input', () => {
    const offsetY = parseFloat(offsetYSliderCyan.value);
    setChannelOffsetY('cyan', offsetY);
    offsetYValCyan.textContent = offsetY.toFixed(1);
    isLoaded() && processImage();
  });

  offsetXSliderMagenta.addEventListener('input', () => {
    const offsetX = parseFloat(offsetXSliderMagenta.value);
    setChannelOffsetX('magenta', offsetX);
    offsetXValMagenta.textContent = offsetX.toFixed(1);
    isLoaded() && processImage();
  });

  offsetYSliderMagenta.addEventListener('input', () => {
    const offsetY = parseFloat(offsetYSliderMagenta.value);
    setChannelOffsetY('magenta', offsetY);
    offsetYValMagenta.textContent = offsetY.toFixed(1);
    isLoaded() && processImage();
  });

  offsetXSliderYellow.addEventListener('input', () => {
    const offsetX = parseFloat(offsetXSliderYellow.value);
    setChannelOffsetX('yellow', offsetX);
    offsetXValYellow.textContent = offsetX.toFixed(1);
    isLoaded() && processImage();
  });

  offsetYSliderYellow.addEventListener('input', () => {
    const offsetY = parseFloat(offsetYSliderYellow.value);
    setChannelOffsetY('yellow', offsetY);
    offsetYValYellow.textContent = offsetY.toFixed(1);
    isLoaded() && processImage();
  });

  offsetXSliderBlack.addEventListener('input', () => {
    const offsetX = parseFloat(offsetXSliderBlack.value);
    setChannelOffsetX('black', offsetX);
    offsetXValBlack.textContent = offsetX.toFixed(1);
    isLoaded() && processImage();
  });

  offsetYSliderBlack.addEventListener('input', () => {
    const offsetY = parseFloat(offsetYSliderBlack.value);
    setChannelOffsetY('black', offsetY);
    offsetYValBlack.textContent = offsetY.toFixed(1);
    isLoaded() && processImage();
  });

  // Render mode change - update SVG controls
  renderMode.addEventListener('change', () => {
    updateSvgControlState();
  });

  // Global shape selector - apply to all channels if not "assorted"
  shapeSelect.addEventListener('change', () => {
    if (shapeSelect.value !== 'assorted') {
      // Apply selected shape to all channels
      ['cyan', 'magenta', 'yellow', 'black'].forEach(channel => {
        setChannelShape(channel, shapeSelect.value);
        document.getElementById(`shapeSelect${channel.charAt(0).toUpperCase() + channel.slice(1)}`).value = shapeSelect.value;
        updateShapeIcon(channel);
      });
      isLoaded() && processImage();
    }
  });

  // Channel shape selectors
  shapeSelectCyan.addEventListener('change', () => {
    setChannelShape('cyan', shapeSelectCyan.value);
    updateShapeIcon('cyan');
    updateGlobalShapeSelector();
    isLoaded() && processImage();
  });
  shapeSelectMagenta.addEventListener('change', () => {
    setChannelShape('magenta', shapeSelectMagenta.value);
    updateShapeIcon('magenta');
    updateGlobalShapeSelector();
    isLoaded() && processImage();
  });
  shapeSelectYellow.addEventListener('change', () => {
    setChannelShape('yellow', shapeSelectYellow.value);
    updateShapeIcon('yellow');
    updateGlobalShapeSelector();
    isLoaded() && processImage();
  });
  shapeSelectBlack.addEventListener('change', () => {
    setChannelShape('black', shapeSelectBlack.value);
    updateShapeIcon('black');
    updateGlobalShapeSelector();
    isLoaded() && processImage();
  });

  // Channel color pickers
  colorPickerCyan.addEventListener('input', () => {
    setChannelColor('cyan', hexToRgba(colorPickerCyan.value));
    isLoaded() && processImage();
  });
  colorPickerMagenta.addEventListener('input', () => {
    setChannelColor('magenta', hexToRgba(colorPickerMagenta.value));
    isLoaded() && processImage();
  });
  colorPickerYellow.addEventListener('input', () => {
    setChannelColor('yellow', hexToRgba(colorPickerYellow.value));
    isLoaded() && processImage();
  });
  colorPickerBlack.addEventListener('input', () => {
    setChannelColor('black', hexToRgba(colorPickerBlack.value));
    isLoaded() && processImage();
  });

  // Reset color buttons - now reset ALL channel settings
  resetColorCyan.addEventListener('click', () => {
    // Reset shape
    setChannelShape('cyan', 'circle');
    shapeSelectCyan.value = 'circle';
    updateShapeIcon('cyan');
    
    // Reset density
    cSlider.value = 1;
    cVal.textContent = '1.00';
    
    // Reset color
    const color = [0, 255, 255, 255];
    setChannelColor('cyan', color);
    colorPickerCyan.value = rgbaToHex(color);
    
    // Reset alpha
    setChannelAlpha('cyan', 255);
    alphaSliderCyan.value = 255;
    alphaCyanVal.textContent = formatAlpha(255);
    
    // Reset offsets
    setChannelOffsetX('cyan', 0);
    offsetXSliderCyan.value = 0;
    offsetXValCyan.textContent = '0.0';
    setChannelOffsetY('cyan', 0);
    offsetYSliderCyan.value = 0;
    offsetYValCyan.textContent = '0.0';
    
    isLoaded() && processImage();
  });
  
  resetColorMagenta.addEventListener('click', () => {
    // Reset shape
    setChannelShape('magenta', 'circle');
    shapeSelectMagenta.value = 'circle';
    updateShapeIcon('magenta');
    
    // Reset density
    mSlider.value = 1;
    mVal.textContent = '1.00';
    
    // Reset color
    const color = [255, 0, 255, 255];
    setChannelColor('magenta', color);
    colorPickerMagenta.value = rgbaToHex(color);
    
    // Reset alpha
    setChannelAlpha('magenta', 255);
    alphaSliderMagenta.value = 255;
    alphaMagentaVal.textContent = formatAlpha(255);
    
    // Reset offsets
    setChannelOffsetX('magenta', 0);
    offsetXSliderMagenta.value = 0;
    offsetXValMagenta.textContent = '0.0';
    setChannelOffsetY('magenta', 0);
    offsetYSliderMagenta.value = 0;
    offsetYValMagenta.textContent = '0.0';
    
    isLoaded() && processImage();
  });
  
  resetColorYellow.addEventListener('click', () => {
    // Reset shape
    setChannelShape('yellow', 'circle');
    shapeSelectYellow.value = 'circle';
    updateShapeIcon('yellow');
    
    // Reset density
    ySlider.value = 1;
    yVal.textContent = '1.00';
    
    // Reset color
    const color = [255, 255, 0, 255];
    setChannelColor('yellow', color);
    colorPickerYellow.value = rgbaToHex(color);
    
    // Reset alpha
    setChannelAlpha('yellow', 255);
    alphaSliderYellow.value = 255;
    alphaYellowVal.textContent = formatAlpha(255);
    
    // Reset offsets
    setChannelOffsetX('yellow', 0);
    offsetXSliderYellow.value = 0;
    offsetXValYellow.textContent = '0.0';
    setChannelOffsetY('yellow', 0);
    offsetYSliderYellow.value = 0;
    offsetYValYellow.textContent = '0.0';
    
    isLoaded() && processImage();
  });
  
  resetColorBlack.addEventListener('click', () => {
    // Reset shape
    setChannelShape('black', 'circle');
    shapeSelectBlack.value = 'circle';
    updateShapeIcon('black');
    
    // Reset density
    kSlider.value = 1;
    kVal.textContent = '1.00';
    
    // Reset color
    const color = [0, 0, 0, 255];
    setChannelColor('black', color);
    colorPickerBlack.value = rgbaToHex(color);
    
    // Reset alpha
    setChannelAlpha('black', 255);
    alphaSliderBlack.value = 255;
    alphaBlackVal.textContent = formatAlpha(255);
    
    // Reset offsets
    setChannelOffsetX('black', 0);
    offsetXSliderBlack.value = 0;
    offsetXValBlack.textContent = '0.0';
    setChannelOffsetY('black', 0);
    offsetYSliderBlack.value = 0;
    offsetYValBlack.textContent = '0.0';
    
    isLoaded() && processImage();
  });

  // Background color picker
  bgColorPicker.addEventListener('input', () => {
    setBgColor(hexToRgba(bgColorPicker.value));
    isLoaded() && processImage();
  });

  // Reset background color button
  resetBgColor.addEventListener('click', () => {
    const color = [255, 255, 255, 255];
    setBgColor(color);
    bgColorPicker.value = rgbaToHex(color);
    isLoaded() && processImage();
  });

  // Calibration sliders
  [cSlider, mSlider, ySlider, kSlider].forEach((el) =>
    el.addEventListener('input', () => {
      cVal.textContent = parseFloat(cSlider.value).toFixed(2);
      mVal.textContent = parseFloat(mSlider.value).toFixed(2);
      yVal.textContent = parseFloat(ySlider.value).toFixed(2);
      kVal.textContent = parseFloat(kSlider.value).toFixed(2);
      isLoaded() && processImage();
    })
  );

  // Reset button
  resetBtn.addEventListener('click', () => {
    cSlider.value = 1;
    mSlider.value = 1;
    ySlider.value = 1;
    kSlider.value = 1;
    cVal.textContent = '1.00';
    mVal.textContent = '1.00';
    yVal.textContent = '1.00';
    kVal.textContent = '1.00';
    isLoaded() && processImage();
  });

  // Alpha sliders for channels
  alphaSliderCyan.addEventListener('input', () => {
    const alpha = parseInt(alphaSliderCyan.value, 10);
    setChannelAlpha('cyan', alpha);
    alphaCyanVal.textContent = formatAlpha(alpha);
    isLoaded() && processImage();
  });

  alphaSliderMagenta.addEventListener('input', () => {
    const alpha = parseInt(alphaSliderMagenta.value, 10);
    setChannelAlpha('magenta', alpha);
    alphaMagentaVal.textContent = formatAlpha(alpha);
    isLoaded() && processImage();
  });

  alphaSliderYellow.addEventListener('input', () => {
    const alpha = parseInt(alphaSliderYellow.value, 10);
    setChannelAlpha('yellow', alpha);
    alphaYellowVal.textContent = formatAlpha(alpha);
    isLoaded() && processImage();
  });

  alphaSliderBlack.addEventListener('input', () => {
    const alpha = parseInt(alphaSliderBlack.value, 10);
    setChannelAlpha('black', alpha);
    alphaBlackVal.textContent = formatAlpha(alpha);
    isLoaded() && processImage();
  });

  // Background alpha slider
  bgAlphaSlider.addEventListener('input', () => {
    const alpha = parseInt(bgAlphaSlider.value, 10);
    setBgAlpha(alpha);
    bgAlphaVal.textContent = formatAlpha(alpha);
    isLoaded() && processImage();
  });

  // Advanced settings panel toggle
  if (advancedSettingsBtn) {
    advancedSettingsBtn.addEventListener('click', () => {
      if (advancedSettingsPanel) {
        advancedSettingsPanel.open = !advancedSettingsPanel.open;
      }
    });
  }

  // Theme toggle button
  if (themToggleBtn) {
    themToggleBtn.addEventListener('click', toggleTheme);
  }

  // Split panel toggle
  if (splitPanelToggle) {
    splitPanelToggle.addEventListener('change', () => {
      setSplitPanelMode(splitPanelToggle.checked);
      // TODO: Implement split panel layout changes
    });
  }

  // Preset paper buttons
  document.querySelectorAll('.preset').forEach((btn) =>
    btn.addEventListener('click', () => {
      setCurrentPaper(parseInt(btn.dataset.paper, 10));
      isLoaded() && processImage();
    })
  );

  // Initialize theme on page load
  initializeTheme();
}

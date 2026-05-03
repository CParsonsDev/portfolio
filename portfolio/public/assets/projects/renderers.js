/**
 * renderers.js - Canvas and SVG Rendering
 * Handles rendering of individual layers and composites
 */

import {
  renderMode, stats, colorizeCheck, gridSlider, jitterSlider, 
  rotSlider, adaptiveCheck, sourceCanvas, cSlider, mSlider, ySlider, kSlider
} from './dom.js';
import { bgColor, channelColors, channelShapes, channelAlpha, channelOffsetX, channelOffsetY } from './state.js';
import { createSvgDataURL, createObjectURL } from './utils.js';
import { validateNumber, validateRGBA, validateShape, validateLayerName, validateFilename, validateSVG } from './security.js';

/**
 * Check if SVG rendering mode is active
 * @returns {boolean}
 */
export function isSVGMode() {
  return renderMode.value === 'svg';
}

/**
 * Render a single layer (canvas or SVG based on mode)
 */
export function renderLayer(canvasId, linkId, pixels, w, h, layerName) {
  if (isSVGMode()) {
    renderLayerSVG(canvasId, linkId, pixels, w, h, layerName);
  } else {
    renderLayerCanvas(canvasId, linkId, pixels, w, h, layerName);
  }
}

/**
 * Render layer to canvas
 * SECURITY: All slider values and colors are validated before use
 */
export function renderLayerCanvas(canvasId, linkId, pixels, w, h, layerName) {
  const c = document.getElementById(canvasId);
  c.width = w;
  c.height = h;
  const x = c.getContext('2d');
  const imgData = new ImageData(w, h);

  // Get calibration strength based on layer
  const sliderMap = {
    'cyan': cSlider,
    'magenta': mSlider,
    'yellow': ySlider,
    'black': kSlider
  };
  // SECURITY: Validate slider value to prevent NaN propagation
  const strength = validateNumber(parseFloat(sliderMap[layerName].value), 0.5, 1.5);
  
  // Get channel transparency from separate alpha slider
  const channelTransparency = validateNumber(channelAlpha[layerName] / 255, 0, 1);

  for (let i = 0; i < pixels.length; i += 4) {
    const v = pixels[i];
    const ink = v / 255;
    const calibrated = 255 * (1 - Math.pow(1 - ink, strength));
    const a = Math.round(calibrated);
    // SECURITY: Validate channel color values
    const [r, g, b, _] = validateRGBA(channelColors[layerName]);
    // Apply transparency slider to the pixel alpha
    const alpha = a * channelTransparency;

    imgData.data[i] = r;
    imgData.data[i + 1] = g;
    imgData.data[i + 2] = b;
    imgData.data[i + 3] = Math.round(alpha);
  }

  x.clearRect(0, 0, w, h);
  // SECURITY: Validate color values before canvas operations
  const [r, g, b, a] = validateRGBA(bgColor);
  const alpha = validateNumber(a / 255, 0, 1);
  x.fillStyle = `rgba(${r},${g},${b},${alpha})`;
  x.fillRect(0, 0, w, h);
  x.putImageData(imgData, 0, 0);
  document.getElementById(linkId).href = c.toDataURL('image/png');
  // SECURITY: Sanitize filename
  document.getElementById(linkId).download = validateFilename(`${layerName}.png`);
}

/**
 * Render layer to SVG
 * SECURITY: SVG content is validated and filename is sanitized
 */
export function renderLayerSVG(canvasId, linkId, pixels, w, h, layerName) {
  const svg = buildLayerSVG(pixels, w, h, layerName);
  const c = document.getElementById(canvasId);
  c.width = w;
  c.height = h;
  drawSvgToCanvas(c, svg);
  document.getElementById(linkId).href = createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  // SECURITY: Sanitize filename
  document.getElementById(linkId).download = validateFilename(`${layerName}.svg`);
}

/**
 * Build SVG markup for a layer with proper grouping and explicit colors
 * SECURITY: All color and dimension values are validated before injection
 */
export function buildLayerSVG(pixels, w, h, layerName) {
  // Get fill color - ensure explicit color even if not colorized
  const fillColor = colorizeCheck.checked ? getLayerFillColor(layerName) : getLayerFillColor(layerName);
  const content = buildSvgContentFromLayer(pixels, w, h, fillColor, layerName);
  
  // SECURITY: Validate dimensions and colors before SVG injection
  const validW = validateNumber(w, 1, 10000);
  const validH = validateNumber(h, 1, 10000);
  const [r, g, b, a] = validateRGBA(bgColor);
  const alpha = validateNumber(a / 255, 0, 1);
  
  // Create SVG with background group and layer group
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${validW}" height="${validH}" viewBox="0 0 ${validW} ${validH}"><g id="BG"><rect width="100%" height="100%" fill="rgba(${r},${g},${b},${alpha})" /></g><g id="${layerName.charAt(0).toUpperCase()}">${content}</g></svg>`;
  
  // SECURITY: Validate SVG before returning
  if (!validateSVG(svg)) {
    console.error('[SECURITY] SVG validation failed');
    return '<svg></svg>';
  }
  
  return svg;
}

/**
 * Build SVG content from layer pixels
 * SECURITY: All numeric values and shapes are validated before SVG injection
 */
export function buildSvgContentFromLayer(pixels, w, h, fillColor, layerName) {
  // SECURITY: Validate all slider inputs to prevent injection
  const grid = validateNumber(parseInt(gridSlider.value, 10), 1, 100);
  const jitter = validateNumber(parseFloat(jitterSlider.value), 0, 100);
  const rotation = validateNumber(parseFloat(rotSlider.value), 0, 360);
  const shape = validateShape(channelShapes[layerName]);
  
  const sliderMap = {
    cyan: cSlider,
    magenta: mSlider,
    yellow: ySlider,
    black: kSlider
  };
  const strength = validateNumber(parseFloat(sliderMap[layerName].value), 0, 2);

  // Get position offsets for this specific channel (normalized to grid, convert to pixels)
  const offsetX = validateNumber(channelOffsetX[layerName] * grid, -2 * grid, 2 * grid);
  const offsetY = validateNumber(channelOffsetY[layerName] * grid, -2 * grid, 2 * grid);
  
  let content = '';

  for (let y = 0; y < h; y += grid) {
    for (let x = 0; x < w; x += grid) {
      const localGrid = adaptiveCheck.checked ? Math.max(8, Math.round(grid * (0.75 + Math.random() * 0.5))) : grid;
      let sum = 0;
      let count = 0;

      for (let yy = 0; yy < localGrid && y + yy < h; yy++) {
        for (let xx = 0; xx < localGrid && x + xx < w; xx++) {
          const i = ((y + yy) * w + (x + xx)) * 4;
          sum += pixels[i];
          count++;
        }
      }

      const v = sum / count / 255;
      const expressed = 1 - Math.pow(1 - v, strength);
      const radius = validateNumber(localGrid * 0.45 * expressed, 0, 10000);

      if (radius > 0.5) {
        // SECURITY: Validate all computed coordinates to prevent NaN/Infinity in SVG
        const cx = validateNumber(x + localGrid / 2 + (Math.random() * 2 - 1) * jitter + offsetX, -10000, 10000);
        const cy = validateNumber(y + localGrid / 2 + (Math.random() * 2 - 1) * jitter + offsetY, -10000, 10000);
        const width = validateNumber(radius * 2, 0, 10000);
        
        if (shape === 'circle') {
          content += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fillColor}" />`;
        } else if (shape === 'square') {
          const x1 = validateNumber(cx - radius, -10000, 10000);
          const y1 = validateNumber(cy - radius, -10000, 10000);
          content += `<rect x="${x1}" y="${y1}" width="${width}" height="${width}" fill="${fillColor}" transform="rotate(${rotation} ${cx} ${cy})" />`;
        } else if (shape === 'triangle') {
          const x1 = validateNumber(cx, -10000, 10000);
          const y1 = validateNumber(cy - radius, -10000, 10000);
          const x2 = validateNumber(cx - radius, -10000, 10000);
          const y2 = validateNumber(cy + radius, -10000, 10000);
          const x3 = validateNumber(cx + radius, -10000, 10000);
          const y3 = validateNumber(cy + radius, -10000, 10000);
          const pts = `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
          content += `<polygon points="${pts}" fill="${fillColor}" transform="rotate(${rotation} ${cx} ${cy})" />`;
        }
      }
    }
  }

  return content;
}

/**
 * Get layer fill color for SVG
 * SECURITY: All color values are validated before SVG injection
 */
export function getLayerFillColor(layerName) {
  const [r, g, b, a] = validateRGBA(channelColors[layerName]);
  // Use independent alpha slider value if available, otherwise use color alpha
  const layerAlpha = channelAlpha[layerName] !== undefined ? channelAlpha[layerName] : a;
  const alpha = validateNumber(layerAlpha / 255, 0, 1);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Draw SVG to canvas
 * SECURITY: SVG content is validated before rendering
 */
export function drawSvgToCanvas(canvas, svg, callback) {
  // SECURITY: Validate SVG before processing
  if (!validateSVG(svg)) {
    console.error('[SECURITY] Invalid SVG detected, aborting render');
    if (typeof callback === 'function') callback();
    return;
  }
  
  const ctx = canvas.getContext('2d');
  const image = new Image();
  image.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    if (typeof callback === 'function') callback();
  };
  image.onerror = () => {
    console.error('[SECURITY] Failed to load SVG image');
  };
  image.src = createSvgDataURL(svg);
}

/**
 * Render composite from canvas layers
 * SECURITY: All color values are validated before use
 */
export function renderCompositeCanvas(w, h, layers) {
  const c = document.getElementById('compositeCanvas');
  c.width = w;
  c.height = h;
  const x = c.getContext('2d');
  x.clearRect(0, 0, w, h);
  // SECURITY: Validate color values
  const [r, g, b, a] = validateRGBA(bgColor);
  const alpha = validateNumber(a / 255, 0, 1);
  x.fillStyle = `rgba(${r},${g},${b},${alpha})`;
  x.fillRect(0, 0, w, h);
  
  // Get grid size for offset calculation (consistent with SVG mode)
  const grid = validateNumber(parseInt(gridSlider.value, 10), 1, 100);
  
  const order = getCanvasChannelOrder(layers);
  order.forEach((name) => {
    const id = `${name}Canvas`;
    const channelCanvas = document.getElementById(id);
    
    // SECURITY: Validate and apply per-channel offsets
    const offsetX = validateNumber(channelOffsetX[name] * grid, -2 * grid, 2 * grid);
    const offsetY = validateNumber(channelOffsetY[name] * grid, -2 * grid, 2 * grid);
    
    x.drawImage(channelCanvas, offsetX, offsetY);
  });
  document.getElementById('compositeDL').href = c.toDataURL('image/png');
  // SECURITY: Sanitize filename
  document.getElementById('compositeDL').download = validateFilename('composite.png');
}

/**
 * Get channel rendering order by strength
 */
export function getCanvasChannelOrder(layers) {
  const colorChannels = ['cyan', 'magenta', 'yellow'];
  const entries = colorChannels.map((name) => ({
    name,
    strength: getChannelStrength(layers[name]),
  }));
  entries.sort((a, b) => b.strength - a.strength);
  return entries.map((entry) => entry.name).concat('black');
}

/**
 * Get channel strength (average pixel value)
 */
export function getChannelStrength(pixels) {
  let sum = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    sum += pixels[i];
  }
  return sum / (pixels.length / 4) / 255;
}

/**
 * Get all channels ordered by strength
 */
export function getChannelOrder(layers) {
  const entries = Object.entries(layers).map(([name, pixels]) => ({
    name,
    strength: getChannelStrength(pixels),
  }));
  entries.sort((a, b) => b.strength - a.strength);
  return entries.map((entry) => entry.name);
}

/**
/**
 * Build composite SVG with channel grouping
 * SECURITY: All dimensions and colors are validated before injection
 * Creates named groups: C, M, Y, K for channels, and BG for background
 */
export function buildCompositeSVG(layers, w, h) {
  const order = getChannelOrder(layers);
  
  // Build content with named groups for each channel
  let groupedContent = `<g id="BG"><rect width="100%" height="100%" fill="rgba(${validateRGBA(bgColor)[0]},${validateRGBA(bgColor)[1]},${validateRGBA(bgColor)[2]},${validateNumber(validateRGBA(bgColor)[3] / 255, 0, 1)})" /></g>`;
  
  // Map channel names to group IDs
  const groupMap = {
    cyan: 'C',
    magenta: 'M',
    yellow: 'Y',
    black: 'K'
  };
  
  // Add grouped channel content
  order.forEach((name) => {
    const groupId = groupMap[name] || name.substring(0, 1).toUpperCase();
    const content = buildSvgContentFromLayer(layers[name], w, h, getLayerFillColor(name), name);
    groupedContent += `<g id="${groupId}">${content}</g>`;
  });
  
  // SECURITY: Validate dimensions and colors before SVG injection
  const validW = validateNumber(w, 1, 10000);
  const validH = validateNumber(h, 1, 10000);
  const [r, g, b, a] = validateRGBA(bgColor);
  const alpha = validateNumber(a / 255, 0, 1);
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${validW}" height="${validH}" viewBox="0 0 ${validW} ${validH}">${groupedContent}</svg>`;
  
  // SECURITY: Validate SVG before returning
  if (!validateSVG(svg)) {
    console.error('[SECURITY] SVG validation failed');
    return '<svg></svg>';
  }
  
  return svg;
}

/**
 * Render composite SVG
 * SECURITY: SVG content is validated and filename is sanitized
 */
export function renderCompositeSVG(w, h, layers, callback) {
  const svg = buildCompositeSVG(layers, w, h);
  // SECURITY: Double-check SVG validity before rendering
  if (!validateSVG(svg)) {
    console.error('[SECURITY] Composite SVG validation failed');
    if (typeof callback === 'function') callback();
    return;
  }
  const c = document.getElementById('compositeCanvas');
  c.width = w;
  c.height = h;
  drawSvgToCanvas(c, svg, callback);
  document.getElementById('compositeDL').href = createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  // SECURITY: Sanitize filename
  document.getElementById('compositeDL').download = validateFilename('composite.svg');
}

/**
 * Test similarity between original and composite
 */
export function testSimilarity(original, w, h) {
  const composite = document.getElementById('compositeCanvas').getContext('2d').getImageData(0, 0, w, h).data;
  let diff = 0;
  for (let i = 0; i < original.length; i += 4) {
    diff += Math.abs(original[i] - composite[i]);
    diff += Math.abs(original[i + 1] - composite[i + 1]);
    diff += Math.abs(original[i + 2] - composite[i + 2]);
  }
  const max = w * h * 255 * 3;
  const score = Math.max(0, Math.round((1 - diff / max) * 100));
  stats.textContent = `Source values retained: 100% | Render similarity: ${score}%`;
}

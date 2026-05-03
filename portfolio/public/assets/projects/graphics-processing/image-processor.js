/**
 * image-processor.js - Core Image Processing
 * CMYK decomposition and image analysis
 * SECURITY: All image processing is isolated to prevent data manipulation
 */

import { ctx, sourceCanvas, stats } from './dom.js';
import { revokeBlobURLs } from './utils.js';
import { renderLayer } from './renderers.js';
import { testSimilarity, renderCompositeCanvas, renderCompositeSVG, isSVGMode } from './renderers.js';
import { validateNumber } from './security.js';

/**
 * Write grayscale value to image data array
 * @param {Uint8ClampedArray} arr - Image data array
 * @param {number} p - Pixel index
 * @param {number} v - Value (0-255)
 */
export function writeGray(arr, p, v) {
  const i = p * 4;
  const val = Math.max(0, Math.min(255, Math.round(v)));
  arr[i] = val;
  arr[i + 1] = val;
  arr[i + 2] = val;
  arr[i + 3] = 255;
}

/**
 * Process image: decompose into CMYK layers
 */
export function processImage() {
  const { width, height } = sourceCanvas;
  const img = ctx.getImageData(0, 0, width, height);
  const data = img.data;
  const total = width * height;
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  const layers = {
    cyan: new Uint8ClampedArray(total * 4),
    magenta: new Uint8ClampedArray(total * 4),
    yellow: new Uint8ClampedArray(total * 4),
    black: new Uint8ClampedArray(total * 4),
  };

  // RGB to CMYK decomposition
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const R = data[i];
    const G = data[i + 1];
    const B = data[i + 2];
    sumR += R;
    sumG += G;
    sumB += B;
    const r = R / 255;
    const g = G / 255;
    const b = B / 255;
    const k = 1 - Math.max(r, g, b);
    let c = 0;
    let m = 0;
    let y = 0;
    if (k < 1) {
      c = (1 - r - k) / (1 - k);
      m = (1 - g - k) / (1 - k);
      y = (1 - b - k) / (1 - k);
    }
    writeGray(layers.cyan, p, c * 255);
    writeGray(layers.magenta, p, m * 255);
    writeGray(layers.yellow, p, y * 255);
    writeGray(layers.black, p, k * 255);
  }

  const avgR = Math.round(sumR / total);
  const avgG = Math.round(sumG / total);
  const avgB = Math.round(sumB / total);
  stats.textContent = `Average RGB: (${avgR}, ${avgG}, ${avgB})`;

  revokeBlobURLs();
  renderLayer('cyanCanvas', 'cyanDL', layers.cyan, width, height, 'cyan');
  renderLayer('magentaCanvas', 'magentaDL', layers.magenta, width, height, 'magenta');
  renderLayer('yellowCanvas', 'yellowDL', layers.yellow, width, height, 'yellow');
  renderLayer('blackCanvas', 'blackDL', layers.black, width, height, 'black');
  window.lastLayers = layers;
  
  if (isSVGMode()) {
    renderCompositeSVG(width, height, layers, () => testSimilarity(data, width, height));
  } else {
    renderCompositeCanvas(width, height, layers);
    testSimilarity(data, width, height);
  }
}

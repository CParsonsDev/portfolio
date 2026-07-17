const fileInput = document.getElementById('fileInput');
const processBtn = document.getElementById('processBtn');
const stats = document.getElementById('stats');
const cSlider = document.getElementById('cSlider');
const mSlider = document.getElementById('mSlider');
const ySlider = document.getElementById('ySlider');
const kSlider = document.getElementById('kSlider');
const resetBtn = document.getElementById('resetBtn');
const sourceCanvas = document.getElementById('sourceCanvas');
const gridSlider = document.getElementById('gridSlider');
const shapeSelect = document.getElementById('shapeSelect');
const rotSlider = document.getElementById('rotSlider');
const jitterSlider = document.getElementById('jitterSlider');
const colorizeCheck = document.getElementById('colorizeCheck');
const multiLayerCheck = document.getElementById('multiLayerCheck');
const adaptiveCheck = document.getElementById('adaptiveCheck');
const renderMode = document.getElementById('renderMode');
const cVal = document.getElementById('cVal');
const mVal = document.getElementById('mVal');
const yVal = document.getElementById('yVal');
const kVal = document.getElementById('kVal');
const gridVal = document.getElementById('gridVal');
const rotVal = document.getElementById('rotVal');
const jitterVal = document.getElementById('jitterVal');
const shapeSelectCyan = document.getElementById('shapeSelectCyan');
const shapeSelectMagenta = document.getElementById('shapeSelectMagenta');
const shapeSelectYellow = document.getElementById('shapeSelectYellow');
const shapeSelectBlack = document.getElementById('shapeSelectBlack');
const shapeIconCyan = document.getElementById('shapeIconCyan');
const shapeIconMagenta = document.getElementById('shapeIconMagenta');
const shapeIconYellow = document.getElementById('shapeIconYellow');
const shapeIconBlack = document.getElementById('shapeIconBlack');
const colorPickerCyan = document.getElementById('colorPickerCyan');
const colorPickerMagenta = document.getElementById('colorPickerMagenta');
const colorPickerYellow = document.getElementById('colorPickerYellow');
const colorPickerBlack = document.getElementById('colorPickerBlack');
const resetColorCyan = document.getElementById('resetColorCyan');
const resetColorMagenta = document.getElementById('resetColorMagenta');
const resetColorYellow = document.getElementById('resetColorYellow');
const resetColorBlack = document.getElementById('resetColorBlack');
const bgColorPicker = document.getElementById('bgColorPicker');
const resetBgColor = document.getElementById('resetBgColor');
const ctx = sourceCanvas.getContext('2d', { willReadFrequently: true });
let currentPaper = 255;
let loaded = false;
let channelShapes = {
  cyan: 'circle',
  magenta: 'circle',
  yellow: 'circle',
  black: 'circle'
};
let channelColors = {
  cyan: [0, 255, 255, 255],
  magenta: [255, 0, 255, 255],
  yellow: [255, 255, 0, 255],
  black: [0, 0, 0, 255]
};
let bgColor = [255, 255, 255, 255];
const activeBlobURLs = [];
const svgControlGroup = document.querySelector('.svg-controls');
const svgControlInputs = svgControlGroup ? svgControlGroup.querySelectorAll('input, select') : [];

function getPaperRGB() {
  return `rgb(${bgColor[0]},${bgColor[1]},${bgColor[2]})`;
}

function hexToRgba(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = hex.length > 7 ? parseInt(hex.slice(7, 9), 16) : 255;
  return [r, g, b, a];
}

function rgbaToHex(rgba) {
  const [r, g, b, a] = rgba;
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${a.toString(16).padStart(2, '0')}`;
}

function updateSvgControlState() {
  const enabled = isSVGMode();
  if (!svgControlGroup) return;
  svgControlGroup.classList.toggle('disabled', !enabled);
  svgControlInputs.forEach((el) => {
    el.disabled = !enabled;
  });
}

function isSVGMode() {
  return renderMode.value === 'svg';
}

function revokeBlobURLs() {
  activeBlobURLs.forEach(URL.revokeObjectURL);
  activeBlobURLs.length = 0;
}

function createObjectURL(blob) {
  const url = URL.createObjectURL(blob);
  activeBlobURLs.push(url);
  return url;
}

function createSvgDataURL(svg) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}


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
    loaded = true;
    processBtn.disabled = false;
    stats.textContent = `Loaded ${img.width}x${img.height} -> ${w}x${h}`;
  };
  img.src = URL.createObjectURL(file);
});

processBtn.addEventListener('click', processImage);
gridSlider.addEventListener('input', () => {
  gridVal.textContent = gridSlider.value;
  loaded && processImage();
});
[shapeSelect, colorizeCheck, multiLayerCheck, adaptiveCheck, renderMode].forEach((el) =>
  el.addEventListener('change', () => loaded && processImage())
);

[rotSlider, jitterSlider].forEach((el) =>
  el.addEventListener('input', () => {
    rotVal.textContent = rotSlider.value;
    jitterVal.textContent = jitterSlider.value;
    loaded && processImage();
  })
);

renderMode.addEventListener('change', () => {
  updateSvgControlState();
});

function updateShapeIcon(layerName) {
  const shape = channelShapes[layerName];
  const iconEl = document.getElementById(`shapeIcon${layerName.charAt(0).toUpperCase() + layerName.slice(1)}`);
  if (shape === 'circle') iconEl.textContent = '○';
  else if (shape === 'square') iconEl.textContent = '□';
  else if (shape === 'triangle') iconEl.textContent = '△';
}

shapeSelectCyan.addEventListener('change', () => {
  channelShapes.cyan = shapeSelectCyan.value;
  updateShapeIcon('cyan');
  loaded && processImage();
});
shapeSelectMagenta.addEventListener('change', () => {
  channelShapes.magenta = shapeSelectMagenta.value;
  updateShapeIcon('magenta');
  loaded && processImage();
});
shapeSelectYellow.addEventListener('change', () => {
  channelShapes.yellow = shapeSelectYellow.value;
  updateShapeIcon('yellow');
  loaded && processImage();
});
shapeSelectBlack.addEventListener('change', () => {
  channelShapes.black = shapeSelectBlack.value;
  updateShapeIcon('black');
  loaded && processImage();
});

colorPickerCyan.addEventListener('input', () => {
  channelColors.cyan = hexToRgba(colorPickerCyan.value);
  loaded && processImage();
});
colorPickerMagenta.addEventListener('input', () => {
  channelColors.magenta = hexToRgba(colorPickerMagenta.value);
  loaded && processImage();
});
colorPickerYellow.addEventListener('input', () => {
  channelColors.yellow = hexToRgba(colorPickerYellow.value);
  loaded && processImage();
});
colorPickerBlack.addEventListener('input', () => {
  channelColors.black = hexToRgba(colorPickerBlack.value);
  loaded && processImage();
});

resetColorCyan.addEventListener('click', () => {
  channelColors.cyan = [0, 255, 255, 255];
  colorPickerCyan.value = rgbaToHex(channelColors.cyan);
  loaded && processImage();
});
resetColorMagenta.addEventListener('click', () => {
  channelColors.magenta = [255, 0, 255, 255];
  colorPickerMagenta.value = rgbaToHex(channelColors.magenta);
  loaded && processImage();
});
resetColorYellow.addEventListener('click', () => {
  channelColors.yellow = [255, 255, 0, 255];
  colorPickerYellow.value = rgbaToHex(channelColors.yellow);
  loaded && processImage();
});
resetColorBlack.addEventListener('click', () => {
  channelColors.black = [0, 0, 0, 255];
  colorPickerBlack.value = rgbaToHex(channelColors.black);
  loaded && processImage();
});

bgColorPicker.addEventListener('input', () => {
  bgColor = hexToRgba(bgColorPicker.value);
  loaded && processImage();
});

resetBgColor.addEventListener('click', () => {
  bgColor = [255, 255, 255, 255];
  bgColorPicker.value = rgbaToHex(bgColor);
  loaded && processImage();
});

bgColorPicker.addEventListener('input', () => {
  bgColor = hexToRgba(bgColorPicker.value);
  loaded && processImage();
});

resetBgColor.addEventListener('click', () => {
  bgColor = [255, 255, 255, 255];
  bgColorPicker.value = rgbaToHex(bgColor);
  loaded && processImage();
});

[cSlider, mSlider, ySlider, kSlider].forEach((el) =>
  el.addEventListener('input', () => {
    cVal.textContent = parseFloat(cSlider.value).toFixed(2);
    mVal.textContent = parseFloat(mSlider.value).toFixed(2);
    yVal.textContent = parseFloat(ySlider.value).toFixed(2);
    kVal.textContent = parseFloat(kSlider.value).toFixed(2);
    loaded && processImage();
  })
);

resetBtn.addEventListener('click', () => {
  cSlider.value = 1;
  mSlider.value = 1;
  ySlider.value = 1;
  kSlider.value = 1;
  cVal.textContent = '1.00';
  mVal.textContent = '1.00';
  yVal.textContent = '1.00';
  kVal.textContent = '1.00';
  loaded && processImage();
});

document.querySelectorAll('.preset').forEach((btn) =>
  btn.addEventListener('click', () => {
    currentPaper = parseInt(btn.dataset.paper, 10);
    loaded && processImage();
  })
);

updateSvgControlState();

['cyan', 'magenta', 'yellow', 'black'].forEach(layer => updateShapeIcon(layer));

function processImage() {
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

function writeGray(arr, p, v) {
  const i = p * 4;
  const val = Math.max(0, Math.min(255, Math.round(v)));
  arr[i] = val;
  arr[i + 1] = val;
  arr[i + 2] = val;
  arr[i + 3] = 255;
}

function renderLayer(canvasId, linkId, pixels, w, h, layerName) {
  if (isSVGMode()) {
    renderLayerSVG(canvasId, linkId, pixels, w, h, layerName);
  } else {
    renderLayerCanvas(canvasId, linkId, pixels, w, h, layerName);
  }
}

function renderLayerCanvas(canvasId, linkId, pixels, w, h, layerName) {
  const c = document.getElementById(canvasId);
  c.width = w;
  c.height = h;
  const x = c.getContext('2d');
  const imgData = new ImageData(w, h);
  const id = canvasId.toLowerCase();

  for (let i = 0; i < pixels.length; i += 4) {
    const v = pixels[i];
    const ink = v / 255;
    let strength = 1;
    if (id.includes('cyan')) strength = parseFloat(cSlider.value);
    else if (id.includes('magenta')) strength = parseFloat(mSlider.value);
    else if (id.includes('yellow')) strength = parseFloat(ySlider.value);
    else if (id.includes('black')) strength = parseFloat(kSlider.value);
    const calibrated = 255 * (1 - Math.pow(1 - ink, strength));
    const a = Math.round(calibrated);
    let [r, g, b] = channelColors[layerName];
    const alpha = a * (channelColors[layerName][3] / 255);

    imgData.data[i] = r;
    imgData.data[i + 1] = g;
    imgData.data[i + 2] = b;
    imgData.data[i + 3] = Math.round(alpha);
  }

  x.clearRect(0, 0, w, h);
  x.fillStyle = `rgba(${bgColor[0]},${bgColor[1]},${bgColor[2]},${bgColor[3]/255})`;
  x.fillRect(0, 0, w, h);
  x.putImageData(imgData, 0, 0);
  document.getElementById(linkId).href = c.toDataURL('image/png');
  document.getElementById(linkId).download = `${layerName}.png`;
}

function renderLayerSVG(canvasId, linkId, pixels, w, h, layerName) {
  const svg = buildLayerSVG(pixels, w, h, layerName);
  const c = document.getElementById(canvasId);
  c.width = w;
  c.height = h;
  drawSvgToCanvas(c, svg);
  document.getElementById(linkId).href = createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  document.getElementById(linkId).download = `${layerName}.svg`;
}

function buildLayerSVG(pixels, w, h, layerName) {
  const fillColor = colorizeCheck.checked ? getLayerFillColor(layerName) : 'black';
  const content = buildSvgContentFromLayer(pixels, w, h, fillColor, layerName);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="rgba(${bgColor[0]},${bgColor[1]},${bgColor[2]},${bgColor[3]/255})"/>${content}</svg>`;
}

function buildSvgContentFromLayer(pixels, w, h, fillColor, layerName) {
  const grid = parseInt(gridSlider.value, 10);
  const jitter = parseFloat(jitterSlider.value);
  const shape = channelShapes[layerName];
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
      const r = localGrid * 0.45 * v;

      if (r > 0.5) {
        const cx = x + localGrid / 2 + (Math.random() * 2 - 1) * jitter;
        const cy = y + localGrid / 2 + (Math.random() * 2 - 1) * jitter;
        if (shape === 'circle') {
          content += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fillColor}" />`;
        } else if (shape === 'square') {
          content += `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" fill="${fillColor}" transform="rotate(${rotSlider.value} ${cx} ${cy})" />`;
        } else if (shape === 'triangle') {
          const pts = `${cx},${cy - r} ${cx - r},${cy + r} ${cx + r},${cy + r}`;
          content += `<polygon points="${pts}" fill="${fillColor}" transform="rotate(${rotSlider.value} ${cx} ${cy})" />`;
        } else if (shape === 'triangle') {
          const pts = `${cx},${cy - r} ${cx - r},${cy + r} ${cx + r},${cy + r}`;
          content += `<polygon points="${pts}" fill="${fillColor}" transform="rotate(${rotSlider.value} ${cx} ${cy})" />`;
        }
      }
    }
  }

  return content;
}

function getLayerFillColor(layerName) {
  const [r, g, b, a] = channelColors[layerName];
  return `rgba(${r},${g},${b},${a/255})`;
}

function extractSvgInnerContent(svgText) {
  const match = svgText.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  return match ? match[1].trim() : svgText.trim();
}


function drawSvgToCanvas(canvas, svg, callback) {
  const ctx = canvas.getContext('2d');
  const image = new Image();
  image.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    if (typeof callback === 'function') callback();
  };
  image.src = createSvgDataURL(svg);
}

function renderCompositeCanvas(w, h, layers) {
  const c = document.getElementById('compositeCanvas');
  c.width = w;
  c.height = h;
  const x = c.getContext('2d');
  x.clearRect(0, 0, w, h);
  x.fillStyle = `rgba(${bgColor[0]},${bgColor[1]},${bgColor[2]},${bgColor[3]/255})`;
  x.fillRect(0, 0, w, h);
  const order = getCanvasChannelOrder(layers);
  order.forEach((name) => {
    const id = `${name}Canvas`;
    x.drawImage(document.getElementById(id), 0, 0);
  });
  document.getElementById('compositeDL').href = c.toDataURL('image/png');
  document.getElementById('compositeDL').download = 'composite.png';
}

function getCanvasChannelOrder(layers) {
  const colorChannels = ['cyan', 'magenta', 'yellow'];
  const entries = colorChannels.map((name) => ({
    name,
    strength: getChannelStrength(layers[name]),
  }));
  entries.sort((a, b) => b.strength - a.strength);
  return entries.map((entry) => entry.name).concat('black');
}

function getChannelStrength(pixels) {
  let sum = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    sum += pixels[i];
  }
  return sum / (pixels.length / 4) / 255;
}

function getChannelOrder(layers) {
  const entries = Object.entries(layers).map(([name, pixels]) => ({
    name,
    strength: getChannelStrength(pixels),
  }));
  entries.sort((a, b) => b.strength - a.strength);
  return entries.map((entry) => entry.name);
}

function buildCompositeSVG(layers, w, h) {
  const order = getChannelOrder(layers);
  const content = order.map((name) => buildSvgContentFromLayer(layers[name], w, h, getLayerFillColor(name), name)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="rgba(${bgColor[0]},${bgColor[1]},${bgColor[2]},${bgColor[3]/255})"/>${content}</svg>`;
}

function renderCompositeSVG(w, h, layers, callback) {
  const svg = buildCompositeSVG(layers, w, h);
  const c = document.getElementById('compositeCanvas');
  c.width = w;
  c.height = h;
  drawSvgToCanvas(c, svg, callback);
  document.getElementById('compositeDL').href = createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  document.getElementById('compositeDL').download = 'composite.svg';
}

function testSimilarity(original, w, h) {
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

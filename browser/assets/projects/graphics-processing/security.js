/**
 * security.js - Input Validation and Sanitization
 * CRITICAL: All user inputs must be validated before use in SVG or DOM
 */

/**
 * SECURITY: Validate and sanitize numeric input
 * Prevents NaN, Infinity, and out-of-range values from being injected into SVG
 * @param {number} value - Input value
 * @param {number} min - Minimum allowed value (default: -Infinity)
 * @param {number} max - Maximum allowed value (default: Infinity)
 * @returns {number} Sanitized numeric value
 */
export function validateNumber(value, min = -Infinity, max = Infinity) {
  const num = parseFloat(value);
  // Reject non-finite values (NaN, Infinity, -Infinity)
  if (!Number.isFinite(num)) {
    console.warn(`[SECURITY] Invalid numeric input: ${value}, using fallback 0`);
    return 0;
  }
  const clamped = Math.max(min, Math.min(max, num));
  return clamped;
}

/**
 * SECURITY: Validate and sanitize RGB/A color values
 * Ensures array contains valid integers 0-255 with no injection vectors
 * @param {number[]} rgba - RGBA array [r, g, b, a]
 * @returns {number[]} Sanitized RGBA array with validated integers
 */
export function validateRGBA(rgba) {
  // Reject non-array or incomplete inputs
  if (!Array.isArray(rgba) || rgba.length < 3) {
    console.warn('[SECURITY] Invalid RGBA input, using default black');
    return [0, 0, 0, 255];
  }
  
  return [
    Math.round(validateNumber(rgba[0], 0, 255)),
    Math.round(validateNumber(rgba[1], 0, 255)),
    Math.round(validateNumber(rgba[2], 0, 255)),
    Math.round(validateNumber(rgba[3] !== undefined ? rgba[3] : 255, 0, 255))
  ];
}

/**
 * SECURITY: Validate SVG shape name against whitelist
 * Prevents injection of unexpected shape types that could create XSS vectors
 * @param {string} shape - Shape name to validate
 * @returns {string} Validated shape name or 'circle' as fallback
 */
export function validateShape(shape) {
  const validShapes = ['circle', 'square', 'triangle'];
  if (validShapes.includes(shape)) {
    return shape;
  }
  console.warn(`[SECURITY] Invalid shape: ${shape}, using fallback 'circle'`);
  return 'circle';
}

/**
 * SECURITY: Validate layer name against whitelist
 * Prevents injection of unexpected layer names
 * @param {string} layerName - Layer name to validate
 * @returns {string} Validated layer name
 */
export function validateLayerName(layerName) {
  const validLayers = ['cyan', 'magenta', 'yellow', 'black'];
  if (validLayers.includes(layerName)) {
    return layerName;
  }
  console.warn(`[SECURITY] Invalid layer: ${layerName}, using fallback 'cyan'`);
  return 'cyan';
}

/**
 * SECURITY: Validate file download filename
 * Prevents directory traversal and other path-based injection attacks
 * @param {string} filename - Filename to validate
 * @returns {string} Safe filename
 */
export function validateFilename(filename) {
  // Remove any path separators and dangerous characters
  return filename
    .replace(/\.\./g, '') // Prevent directory traversal
    .replace(/[\/\\]/g, '') // Remove path separators
    .replace(/[<>:"|?*]/g, '') // Remove Windows invalid chars
    .replace(/[\x00-\x1f]/g, '') // Remove control characters
    .substring(0, 255); // Limit length
}

/**
 * SECURITY: Validate SVG content before injection
 * Performs basic checks for common XSS patterns in SVG
 * @param {string} svg - SVG markup to validate
 * @returns {boolean} True if SVG passes validation
 */
export function validateSVG(svg) {
  // Reject if not a string
  if (typeof svg !== 'string') {
    console.error('[SECURITY] SVG is not a string');
    return false;
  }
  
  // Check for dangerous event handlers that could create XSS
  const dangerousPatterns = [
    /on\w+\s*=/i, // Event handlers like onclick=
    /<script/i, // Script tags
    /javascript:/i, // JavaScript protocol
    /data:text\/html/i, // Data URLs with HTML
    /eval\(/i, // eval() calls
    /expression\(/i, // CSS expressions
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(svg)) {
      console.error(`[SECURITY] Detected XSS pattern in SVG: ${pattern}`);
      return false;
    }
  }
  
  return true;
}

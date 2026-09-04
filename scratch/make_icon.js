import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal PNG generator in Pure Node.js using zlib
function createPng(width, height, r, g, b) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT (Raw image pixels with filter byte per scanline)
  const lineSize = 1 + width * 3;
  const rawData = Buffer.alloc(height * lineSize);
  
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.38;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * lineSize;
    rawData[rowOffset] = 0; // None filter
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      // Draw a nice tennis ball or green background
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        // Tennis ball yellow-green (#ccff00 = 204, 255, 0)
        // Draw white seam line
        const seam1 = Math.abs(dx * 0.7 + dy * 0.7 - radius * 0.3);
        const seam2 = Math.abs(dx * 0.7 - dy * 0.7 + radius * 0.3);
        if (Math.abs(dist - radius * 0.6) < width * 0.03) {
          rawData[pxOffset] = 255;   // R
          rawData[pxOffset + 1] = 255; // G
          rawData[pxOffset + 2] = 255; // B
        } else {
          rawData[pxOffset] = 204;   // R
          rawData[pxOffset + 1] = 240; // G
          rawData[pxOffset + 2] = 30;  // B
        }
      } else {
        // Deep court green background (#146c5a = 20, 108, 90)
        rawData[pxOffset] = r;
        rawData[pxOffset + 1] = g;
        rawData[pxOffset + 2] = b;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crcVal = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crcVal, 8 + len);
  return buf;
}

// CRC32 implementation for PNG chunks
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    crc ^= byte;
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (-(crc & 1) & 0xedb88320);
    }
  }
  return (crc ^ -1) >>> 0;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write 192x192 and 512x512 PNGs
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createPng(192, 192, 20, 108, 90));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createPng(512, 512, 20, 108, 90));
console.log('Icons generated successfully in public/');

import * as THREE from 'three';

export interface SubtreeHeader {
  magic: string;
  version: number;
  jsonByteLength: number;
  binaryByteLength: number;
}

export class SubtreeParser {
  private buffer!: ArrayBuffer;
  private header!: SubtreeHeader;
  public json: any;
  private binaryChunk!: DataView;

  // Availability Bitstreams
  private tileAvailability: Bitstream | null = null;
  private contentAvailability: Bitstream | null = null;
  private childSubtreeAvailability: Bitstream | null = null;

  constructor() {}

  public async parse(buffer: ArrayBuffer): Promise<void> {
    this.buffer = buffer;
    this.header = this.parseHeader(buffer);

    if (this.header.magic !== 'subt') {
      console.error(
        'Invalid Subtree Magic:',
        this.header.magic,
        'Ascii codes:',
        this.header.magic.split('').map((c) => c.charCodeAt(0)),
        'Buffer length:',
        buffer.byteLength
      );
      // Try to peek if it looks like JSON
      const text = new TextDecoder().decode(new Uint8Array(buffer).slice(0, 20));
      console.error('Buffer Preview (Text):', text);

      throw new Error('Invalid Subtree Magic');
    }

    // Read JSON
    const jsonStart = 24; // Header size
    const jsonEnd = jsonStart + this.header.jsonByteLength;
    const jsonBytes = new Uint8Array(buffer, jsonStart, this.header.jsonByteLength);
    const jsonText = new TextDecoder().decode(jsonBytes);
    this.json = JSON.parse(jsonText);

    // Binary Chunk
    const binaryStart = jsonEnd;
    // Align? Implicit Tiling spec says binary starts immediately after JSON, but often aligned to 8 bytes.
    // The header lengths are strict.
    this.binaryChunk = new DataView(buffer, binaryStart, this.header.binaryByteLength);

    // Initialize Availability
    this.tileAvailability = this.createBitstream(this.json.tileAvailability);

    // Content Availability is an array (per spec), typically one element per tile content.
    const contentInfo = Array.isArray(this.json.contentAvailability)
      ? this.json.contentAvailability[0]
      : this.json.contentAvailability;
    this.contentAvailability = this.createBitstream(contentInfo);

    this.childSubtreeAvailability = this.createBitstream(this.json.childSubtreeAvailability);
  }

  private parseHeader(buffer: ArrayBuffer): SubtreeHeader {
    const view = new DataView(buffer);
    const magic = String.fromCharCode(
      view.getUint8(0),
      view.getUint8(1),
      view.getUint8(2),
      view.getUint8(3)
    );
    const version = view.getUint32(4, true);
    const jsonByteLength = Number(view.getBigUint64(8, true));
    const binaryByteLength = Number(view.getBigUint64(16, true));

    return { magic, version, jsonByteLength, binaryByteLength };
  }

  private createBitstream(info: any): Bitstream | null {
    if (!info) return null;

    // Constant handling
    if (typeof info.constant === 'number') {
      // 0 = Unavailable, 1 = Available
      return new ConstantBitstream(info.constant === 1);
    }

    if (typeof info.bitstream === 'number') {
      const bufferView = this.json.bufferViews[info.bitstream];
      const offset = bufferView.byteOffset || 0;
      const length = bufferView.byteLength;

      // Create a view into the binary chunk
      // Note: bufferView.byteOffset is relative to the start of the buffer it references (buffer 0 = binary chunk)
      // Actually in Implicit Tiling, 'buffer': 0 usually refers to the internal binary chunk.
      // So we use this.binaryChunk.

      const streamData = new Uint8Array(this.buffer, this.binaryChunk.byteOffset + offset, length);
      return new BinaryBitstream(streamData);
    }

    return null;
  }

  public getTileAvailable(index: number): boolean {
    return this.tileAvailability ? this.tileAvailability.get(index) : false;
  }

  public getContentAvailable(index: number): boolean {
    return this.contentAvailability ? this.contentAvailability.get(index) : false;
  }

  public getChildSubtreeAvailable(index: number): boolean {
    return this.childSubtreeAvailability ? this.childSubtreeAvailability.get(index) : false;
  }
}

interface Bitstream {
  get(index: number): boolean;
}

class ConstantBitstream implements Bitstream {
  constructor(private value: boolean) {}
  get(index: number): boolean {
    return this.value;
  }
}

class BinaryBitstream implements Bitstream {
  constructor(private data: Uint8Array) {}
  get(index: number): boolean {
    const byteIndex = Math.floor(index / 8);
    const bitIndex = index % 8;
    if (byteIndex >= this.data.length) return false;

    const byte = this.data[byteIndex];
    // Spec: "The first bit is the least significant bit of the first byte"
    return ((byte >> bitIndex) & 1) === 1;
  }
}

// Global Implicit Tiling Utils
export class ImplicitTiling {
  // Calculate Morton index for a tile relative to a subtree root
  // Assuming Quadtree
  public static getMortonIndex(level: number, x: number, y: number): number {
    // For level 0: index 0
    // For level 1: 1 + Morton(x, y)
    // This depends on "levelOffset" logic.

    // Calculate offset for the level
    let offset = 0;
    for (let i = 0; i < level; i++) {
      offset += Math.pow(4, i);
    }

    // Calculate Morton code for x, y
    const morton = ImplicitTiling.morton2D(x, y);
    return offset + morton;
  }

  public static morton2D(x: number, y: number): number {
    x = (x | (x << 8)) & 0x00ff00ff;
    x = (x | (x << 4)) & 0x0f0f0f0f;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = (y | (y << 8)) & 0x00ff00ff;
    y = (y | (y << 4)) & 0x0f0f0f0f;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
  }
}

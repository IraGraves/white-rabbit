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

    // Initialize Property Tables
    if (this.json.tileMetadata !== undefined) {
      // Legacy or specific reference
    }

    // 3D Tiles 1.1: Property Tables
    // We assume the schema "tileMetadata" matches our specific fields
    if (this.json.propertyTables) {
      for (const table of this.json.propertyTables) {
        if (table.class === 'tileMetadata') {
          this.tileMetadataTable = new PropertyTable(
            this.buffer,
            this.binaryChunk,
            this.json.bufferViews,
            table
          );
        }
      }
    }
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

      const streamData = new Uint8Array(this.buffer, this.binaryChunk.byteOffset + offset, length);
      return new BinaryBitstream(streamData);
    }

    return null;
  }

  // Property Table
  private tileMetadataTable: PropertyTable | null = null;

  public getTileMetadata(index: number) {
    if (!this.tileMetadataTable) return null;
    return this.tileMetadataTable.getProperties(index);
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
  get(_index: number): boolean {
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

class PropertyTable {
  private properties: Record<string, any> = {};
  private count: number;

  constructor(buffer: ArrayBuffer, binaryChunk: DataView, bufferViews: any[], tableJson: any) {
    this.count = tableJson.count;

    for (const [name, prop] of Object.entries(tableJson.properties)) {
      const propertyDef = prop as any;
      // Handle bufferView
      // propertyDef has "values" (index to bufferView) or "values" (bitstream? No, property table uses "values")
      // Wait, standard property table structure:
      // "properties": { "propName": { "values": 1 } }
      // where 1 is bufferView index.

      if (typeof propertyDef.values === 'number') {
        const bufferView = bufferViews[propertyDef.values];
        const offset = bufferView.byteOffset || 0;
        const length = bufferView.byteLength;

        // Absolute offset in buffer
        // Note: bufferView.byteOffset is relative to buffer 0 (which is binary chunk)
        const absOffset = binaryChunk.byteOffset + offset;
        const view = new DataView(buffer, absOffset, length);

        // Check component type?
        // For now, hardcode based on known schema "tileMetadata"
        // minHeight: FLOAT32 (SCALAR)
        // maxHeight: FLOAT32 (SCALAR)
        // occPoint: FLOAT32 (VEC3)

        if (name === 'minHeight' || name === 'maxHeight') {
          this.properties[name] = { type: 'SCALAR', view: view };
        } else if (name === 'occPoint') {
          this.properties[name] = { type: 'VEC3', view: view };
        }
      }
    }
  }

  public getProperties(index: number) {
    if (index >= this.count) return null;

    const result: any = {};

    // Size of float32 = 4
    // SCALAR stride = 4
    // VEC3 stride = 12

    if (this.properties['minHeight']) {
      result.minHeight = this.properties['minHeight'].view.getFloat32(index * 4, true);
    }
    if (this.properties['maxHeight']) {
      result.maxHeight = this.properties['maxHeight'].view.getFloat32(index * 4, true);
    }
    if (this.properties['occPoint']) {
      const v = this.properties['occPoint'].view;
      const offset = index * 12;
      // Data is stored as Z-up (ECEF) in the JSON produced by mesh.py
      // Three.js uses Y-up. We must apply the same transform as the GLTF root node:
      // (x, y, z) -> (x, z, -y)
      const rawX = v.getFloat32(offset, true);
      const rawY = v.getFloat32(offset + 4, true);
      const rawZ = v.getFloat32(offset + 8, true);

      result.occPoint = new THREE.Vector3(rawX, rawZ, -rawY);
    }

    return result;
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

// Type declarations for three.js example modules
// These modules are part of three.js but TypeScript doesn't resolve the paths correctly

declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import {
    Loader,
    LoadingManager,
    Group,
    Camera,
    AnimationClip,
    Scene,
    Mesh,
    Object3D,
  } from 'three';

  export interface GLTF {
    scene: Group;
    scenes: Group[];
    cameras: Camera[];
    animations: AnimationClip[];
    asset: object;
    parser: any;
    userData: any;
  }

  export class GLTFLoader extends Loader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent | Error) => void
    ): void;
    loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<GLTF>;
    setDRACOLoader(dracoLoader: any): GLTFLoader;
    setKTX2Loader(ktx2Loader: any): GLTFLoader;
    setMeshoptDecoder(decoder: any): GLTFLoader;
  }
}

declare module 'three/examples/jsm/loaders/DRACOLoader' {
  import { Loader, LoadingManager, BufferGeometry } from 'three';

  export class DRACOLoader extends Loader {
    constructor(manager?: LoadingManager);
    setDecoderPath(path: string): DRACOLoader;
    setDecoderConfig(config: object): DRACOLoader;
    setWorkerLimit(limit: number): DRACOLoader;
    load(
      url: string,
      onLoad: (geometry: BufferGeometry) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<BufferGeometry>;
    preload(): DRACOLoader;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, Vector3, MOUSE, TOUCH } from 'three';

  export class OrbitControls {
    constructor(object: Camera, domElement?: HTMLElement);

    object: Camera;
    domElement: HTMLElement | undefined;

    enabled: boolean;
    target: Vector3;

    minDistance: number;
    maxDistance: number;

    minZoom: number;
    maxZoom: number;

    minPolarAngle: number;
    maxPolarAngle: number;

    minAzimuthAngle: number;
    maxAzimuthAngle: number;

    enableDamping: boolean;
    dampingFactor: number;

    enableZoom: boolean;
    zoomSpeed: number;

    enableRotate: boolean;
    rotateSpeed: number;

    enablePan: boolean;
    panSpeed: number;
    screenSpacePanning: boolean;
    keyPanSpeed: number;

    autoRotate: boolean;
    autoRotateSpeed: number;

    keys: { LEFT: string; UP: string; RIGHT: string; BOTTOM: string };
    mouseButtons: { LEFT: MOUSE; MIDDLE: MOUSE; RIGHT: MOUSE };
    touches: { ONE: TOUCH; TWO: TOUCH };

    update(): boolean;
    listenToKeyEvents(domElement: HTMLElement): void;
    saveState(): void;
    reset(): void;
    dispose(): void;

    getPolarAngle(): number;
    getAzimuthalAngle(): number;
    getDistance(): number;

    addEventListener(type: string, listener: (event: any) => void): void;
    hasEventListener(type: string, listener: (event: any) => void): boolean;
    removeEventListener(type: string, listener: (event: any) => void): void;
    dispatchEvent(event: { type: string; target?: any }): void;
  }
}

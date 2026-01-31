import { defineConfig } from 'vite';
import textureManifestPlugin from './vite.plugin.texture-manifest';

export default defineConfig({
  base: '/',
  plugins: [textureManifestPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        'custom-viewer': './scripts/texture-pipeline/s2-viewer/index.html',
      },
    },
  },
});

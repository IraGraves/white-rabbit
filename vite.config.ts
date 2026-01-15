import { defineConfig } from 'vite';
import textureManifestPlugin from './vite.plugin.texture-manifest';

export default defineConfig({
  base: '/',
  plugins: [textureManifestPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        'custom-viewer': './src/apps/custom-viewer/custom-viewer.html',
      },
    },
  },
});

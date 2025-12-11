import { defineConfig } from 'vite';
import textureManifestPlugin from './vite.plugin.texture-manifest';

export default defineConfig({
  base: '/',
  plugins: [textureManifestPlugin()],
});

import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function deferCssPlugin(): Plugin {
  return {
    name: 'defer-css',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g,
        '<link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), deferCssPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react')) return 'vendor';
        },
      },
    },
  },
});

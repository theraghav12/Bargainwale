import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.bargainwale.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

import { defineConfig } from "vite";

export default defineConfig({
  /* Root deploy (Netlify, etc.); default "/" keeps /assets and /images URLs reliable */
  server: {
    open: true,
  },
});

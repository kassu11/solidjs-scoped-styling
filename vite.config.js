import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import scopedStyling from "./solidjs-scoped-styling.js";

export default defineConfig({
  plugins: [scopedStyling(), solid()],
  css: {
    devSourcemap: true
  }
})

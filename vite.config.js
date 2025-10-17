import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import styles from "./local-style.js";

export default defineConfig({
  plugins: [styles(), solid()],
  css: {
    devSourcemap: true
  }
})

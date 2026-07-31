import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/
// so the base path must match your repository name exactly.
// Change REPO_NAME below (and the "homepage" field in package.json) before deploying.
const REPO_NAME = 'rohi-crusher'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? `/${REPO_NAME}/` : '/',
}))

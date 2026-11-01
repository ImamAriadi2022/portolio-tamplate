import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Plugin untuk menyinkronkan file dari folder `/assets` di root proyek ke `/public/assets`
 * agar aset yang ditaruh di `/assets` tetap ter-bundle saat `vite build` di production (Vercel).
 */
function syncRootAssetsPlugin() {
  const copyRecursive = (srcDir, destDir) => {
    if (!fs.existsSync(srcDir)) return
    fs.mkdirSync(destDir, { recursive: true })
    for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
      const srcPath = path.join(srcDir, entry.name)
      const destPath = path.join(destDir, entry.name)
      if (entry.isDirectory()) {
        copyRecursive(srcPath, destPath)
      } else {
        const shouldCopy =
          !fs.existsSync(destPath) ||
          fs.statSync(srcPath).mtimeMs > fs.statSync(destPath).mtimeMs
        if (shouldCopy) {
          fs.copyFileSync(srcPath, destPath)
        }
      }
    }
  }

  return {
    name: 'sync-root-assets',
    buildStart() {
      copyRecursive(
        path.resolve(__dirname, 'assets'),
        path.resolve(__dirname, 'public/assets')
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [syncRootAssetsPlugin(), react(), tailwindcss()],
})

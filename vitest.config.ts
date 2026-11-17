import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      // Тот же алиас, что и в tsconfig.json: `@/*` указывает на корень репозитория.
      '@': path.resolve(fileURLToPath(new URL('.', import.meta.url))),
    },
  },
});

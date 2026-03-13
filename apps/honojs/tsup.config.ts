import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  // App binary — don't bundle dependencies; they're resolved at runtime
  skipNodeModulesBundle: true,
});

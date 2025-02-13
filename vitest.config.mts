import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'vitest/config'
import { puyaTsTransformer } from '@algorandfoundation/algorand-typescript-testing/vitest-transformer'

export default defineConfig({
  esbuild: {},
  test: {
    exclude: ['node_modules', '**/*.test.ts'],
    setupFiles: 'vitest.setup.ts',
  },
  plugins: [
    typescript({      
      transformers: {
        before: [puyaTsTransformer],
      },
    }),
  ],
})

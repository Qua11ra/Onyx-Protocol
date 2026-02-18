import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    
    'hooks/index': 'src/hooks/index.ts',
    'contracts/index': 'src/contracts/index.ts', 
    'actions/index': 'src/actions/index.ts',
    'types/index': 'src/types/index.ts',
  },
  
  format: ['esm', 'cjs'],
  
  dts: true,
  
  sourcemap: true,
  clean: true,
  
  splitting: true,
    treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
  minify: true,
  terserOptions: {
    compress: {
      drop_console: true,
    },
  },
  
  external: [
    'viem',
    'wagmi',
    '@tanstack/react-query',
  ],
  
  platform: 'neutral',
  target: 'es2020',
  
  outDir: 'dist',
});
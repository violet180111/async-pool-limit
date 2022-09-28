import typescript from '@rollup/plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import pkg from './package.json';

const footer = `
if(typeof window !== 'undefined') {
  window._Dry_VERSION_ = '${pkg.version}'
}`;

/** @type {import('rollup').RollupOptions} */
export default {
  input: './src/lib/index.ts',
  output: [
    {
      file: pkg.commonjs,
      format: 'cjs',
      exports: 'default',
      footer,
    },
    {
      file: pkg.module,
      format: 'esm',
      exports: 'default',
      footer,
    },
    {
      file: pkg.browser,
      format: 'umd',
      exports: 'default',
      name: 'Dry',
      footer,
    },
  ],
  plugins: [typescript(), commonjs(), resolve(), cleanup(), terser()],
};

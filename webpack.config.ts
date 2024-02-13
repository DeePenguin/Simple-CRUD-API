/* eslint-disable  */
import ESLintPlugin from 'eslint-webpack-plugin'
import { resolve } from 'path'

export default {
  mode: 'production',
  target: 'node',
  entry: resolve(__dirname, 'src', 'index.ts'),
  output: { clean: true, filename: 'index.js' },
  module: { rules: [{ test: /\.ts$/i, use: 'ts-loader' }] },
  resolve: { extensions: ['.ts', '.js'] },
  plugins: [new ESLintPlugin({ extensions: ['ts'], fix: false })],
}

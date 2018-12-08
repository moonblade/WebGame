const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /test/] 
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  mode: "development",
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  }
};
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/main.jsx', 
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'true',
      scriptLoading: 'defer',
      hash: true,
      chunks: ['main']
    })
  ],
  stats: {
    errorDetails: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: "automatic" }]
            ]
          }
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  resolve: {
    alias: {
      '@src': path.resolve('src'),
      '@services': path.resolve('src/Lib/Services'),
      '@hooks': path.resolve('src/Lib/Hooks'),
      '@components': path.resolve('src/UI/components'),
      '@utils': path.resolve('src/Utils'),
      '@routes': path.resolve('src/routes'),
      '@assets': path.resolve('src/assets'),
      '@styles': path.resolve('src/UI/screens/styles'),
      '@layouts': path.resolve('src/Lib/Layouts'),
      '@constants': path.resolve('src/Utils/constants'),
      '@componentsUseable': path.resolve('src/UI/useable-components'),

      '@screens': path.resolve('src/UI/screens'),
      '@ui': path.resolve('src/UI'),
    },
    extensions: ['.js', '.jsx']
  },
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true
  }
}

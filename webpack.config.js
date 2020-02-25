const webpack = require('webpack')

const path = require('path')
const process = require('process')
const readline = require('readline')
const chalk = require('chalk')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')
const Dotenv = require('dotenv-webpack')

const handler = (percentage, message, moduleProgress, activeModule) => {
  if (percentage !== 1) {
    process.stdout.clearScreenDown()
    readline.cursorTo(process.stdout, 0)
    process.stdout.write(
      `${chalk.bgGreenBright(
        ' '.repeat(Math.round(percentage * 50))
      )}${chalk.bgWhite(
        ' '.repeat(50 - Math.round(percentage * 50))
      )} ${chalk.bold.green(message)} (${chalk.greenBright(
        `${Math.round(percentage * 100)}%`
      )}) ${chalk.dim.grey(moduleProgress || '')} ${chalk.dim.grey(
        activeModule || ''
      )}`
    )
  } else {
    process.stdout.clearLine()
    readline.cursorTo(process.stdout, 0)
    process.stdout.write(`${chalk.bold.green('✔ Compile successfully')}\n\n`)
  }
}

const devMode = process.env.NODE_ENV === 'development'

const performanceLoaders = [
  {
    loader: 'thread-loader',
    options: { workers: require('os').cpus.length, workerParallelJobs: 2 }
  },
  !devMode && 'cache-loader'
]

module.exports = env => ({
  mode: env.NODE_ENV,
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/[id][hash].bundle.js',
    chunkFilename: 'static/chunk/js/[id][hash].bundle.js',
    publicPath: '/'
  },
  cache: true,
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: 'single',
    ...(!devMode && {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          }
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser
          }
        })
      ]
    }),
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          },
          ...performanceLoaders
        ]
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          ...performanceLoaders
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'static/assets/images',
              name: '[hash].[ext]'
            }
          },
          ...performanceLoaders
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'static/assets/fonts',
              name: '[hash].[ext]'
            }
          },
          ...performanceLoaders
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader // creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'sass-loader' // compiles Sass to CSS
          },
          ...performanceLoaders
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader // creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'less-loader' // compiles Less to CSS
          },
          ...performanceLoaders
        ]
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './dist',
    host: 'localhost',
    port: process.env.PORT,
    hot: true,
    hotOnly: true,
    // open: true,
    clientLogLevel: 'silent',
    noInfo: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[id][hash].css',
      chunkFilename: 'static/chunk/css/[id][hash].css',
      ignoreOrder: false
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Caching',
      template: path.resolve(__dirname, './public/index.html'),
      inject: true
    }),
    new Dotenv({
      path: './.env',
      safe: true,
      systemvars: true
    }),
    new ManifestPlugin(),
    new webpack.ProgressPlugin(handler),
    ...(devMode ? new BundleAnalyzerPlugin() : [])
  ]
})

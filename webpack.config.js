const webpack = require('webpack')

const path = require('path')
const process = require('process')
// const readline = require('readline')
// const chalk = require('chalk')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')
const Dotenv = require('dotenv-webpack')
const WorkboxPlugin = require('workbox-webpack-plugin')

// const handler = (percentage, message, moduleProgress, activeModule) => {
//   if (percentage !== 1) {
//     process.stdout.clearScreenDown()
//     readline.cursorTo(process.stdout, 0)
//     process.stdout.write(
//       `${chalk.bgGreenBright(
//         ' '.repeat(Math.round(percentage * 50))
//       )}${chalk.bgWhite(
//         ' '.repeat(50 - Math.round(percentage * 50))
//       )} ${chalk.bold.green(message)} (${chalk.greenBright(
//         `${Math.round(percentage * 100)}%`
//       )}) ${chalk.dim.grey(moduleProgress || '')} ${chalk.dim.grey(
//         activeModule || ''
//       )}`
//     )
//   } else {
//     process.stdout.clearLine()
//     readline.cursorTo(process.stdout, 0)
//     process.stdout.write(`${chalk.bold.green('✔ Compile successfully')}\n\n`)
//   }
// }

module.exports = (env) => {
  const devMode = env.NODE_ENV === 'development'
  const performanceLoaders = [
    {
      loader: 'thread-loader',
      options: { workers: require('os').cpus.length, workerParallelJobs: 2 },
    },
    ...(!devMode ? ['cache-loader'] : []),
  ]

  return {
    mode: env.NODE_ENV,
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'static/js/[id]_[hash].bundle.js',
      chunkFilename: 'static/js/chunk/[chunkhash].bundle.js',
      publicPath: '/',
    },
    watch: devMode,
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
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            },
          }),
          new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
              parser: safePostCssParser,
            },
          }),
        ],
      }),
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.js(x?)$/,
          exclude: /(node_modules)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: ['@babel/preset-env', '@babel/preset-react'],
              },
            },
            ...performanceLoaders,
          ],
        },
        {
          test: /\.css$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            ...performanceLoaders,
          ],
        },
        {
          test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
          use: ['raw-loader'],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'static/assets/images',
                name: '[hash].[ext]',
              },
            },
            ...performanceLoaders,
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'static/assets/fonts',
                name: '[hash].[ext]',
              },
            },
            ...performanceLoaders,
          ],
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            {
              loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader, // creates style nodes from JS strings
            },
            {
              loader: 'css-loader', // translates CSS into CommonJS
            },
            {
              loader: 'sass-loader', // compiles Sass to CSS
            },
            ...performanceLoaders,
          ],
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader, // creates style nodes from JS strings
            },
            {
              loader: 'css-loader', // translates CSS into CommonJS
            },
            {
              loader: 'less-loader', // compiles Less to CSS
              options: {
                modifyVars: {
                  'layout-footer-padding': '0px',
                  'layout-header-padding': '0 0 0 24px',
                  'layout-header-background': 'transparent',
                  'layout-body-background': 'transparent',
                  // '@primary-color': '#1890ff', // primary color for all components
                  // '@link-color': '#1890ff', // link color
                  // '@success-color': '#52c41a', // success state color
                  // '@warning-color': '#faad14', // warning state color
                  // '@error-color': '#f5222d', // error state color
                  // '@font-size-base': '14px', // major text font size
                  // '@heading-color': 'rgba(0, 0, 0, 0.85)', // heading text color
                  // '@text-color': 'rgba(0, 0, 0, 0.65)', // major text color
                  // '@text-color-secondary': 'rgba(0, 0, 0, 0.45)', // secondary text color
                  // '@disabled-color': 'rgba(0, 0, 0, 0.25)', // disable state color
                  // '@border-radius-base': '4px', // major border radius
                  // '@border-color-base': '#d9d9d9', // major border color
                  // '@box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // major shadow for layers
                },
                javascriptEnabled: true,
              },
            },
            ...performanceLoaders,
          ],
        },
      ],
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      contentBase: './dist',
      host: '0.0.0.0',
      port: process.env.PORT || 8000,
      hot: true,
      hotOnly: true,
      compress: true,
      clientLogLevel: 'silent',
      noInfo: true,
      disableHostCheck: true,
      useLocalIp: true,
      open: true,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'static/css/[id]_[hash].css',
        chunkFilename: 'static/css/chunk/[chunkhash].css',
        ignoreOrder: true,
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './public/index.html'),
      }),
      new Dotenv({
        path: devMode ? './.env' : './.env.production',
        safe: true,
        systemvars: true,
        silent: true,
      }),
      new WebpackPwaManifest({
        filename: 'manifest.json',
        crossorigin: 'use-credentials',
        short_name: 'Family',
        name: 'Family Network',
        description: 'Social network for family',
        icons: [
          {
            src: path.resolve(__dirname, './src/assets/images/logo.png'),
            sizes: [72, 96, 128, 192, 256, 384, 512],
            destination: path.join('static/assets/images', 'icons'),
            ios: true,
          },
        ],
        start_url: '.',
        background_color: '#fff',
        display: 'standalone',
        theme_color: '#fff',
      }),
      ...(devMode
        ? []
        : [
            new WorkboxPlugin.InjectManifest({
              swSrc: path.resolve(__dirname, './src/sw.js'),
              swDest: 'sw.js',
              maximumFileSizeToCacheInBytes: 50000000,
            }),
          ]),
      // new webpack.ProgressPlugin(handler),
      ...(devMode
        ? [
            new BundleAnalyzerPlugin({
              openAnalyzer: false,
              logLevel: 'silent',
            }),
          ]
        : []),
    ],
    performance: {
      hints: false,
    },
  }
}

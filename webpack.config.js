const path = require('path');

const { ProgressPlugin, NoEmitOnErrorsPlugin, HotModuleReplacementPlugin } = require('webpack');

const WebpackBar = require('webpackbar');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

require('dotenv').config();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const devtool = isProduction
    ? 'cheap-source-map'
    : argv.liveReload
      ? 'cheap-module-eval-source-map'
      : 'cheap-module-source-map';
  const { env: { ASSET_PATH, SELECT_URL } } = process;

  const config = {
    entry: {
      app: ['url-polyfill', '@babel/polyfill', './src/app/index.tsx', './src/css/main.css'],
      articleContentStyle: './src/css/articleContentStyle.css',
    },
    output: {
      filename: '[name].[hash].js',
      path: path.join(__dirname, 'dist'),
      publicPath: ASSET_PATH || '/',
    },
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  ctx: { ...argv },
                },
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                prettier: false,
              },
            },
          ],
          exclude: path.resolve(__dirname, './src/images/public/'),
        },
        {
          include: /(fonts|images)\//,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: isProduction ? '[contenthash].[ext]' : '[name].[ext]',
                outputPath: 'assets',
              },
            },
          ],
        },
        {
          test: /\.modernizrrc$/,
          loader: 'modernizr-loader!json-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        modernizr$: path.resolve(__dirname, '.modernizrrc'),
      },
    },
    plugins: [
      new WebpackBar(),
      new ProgressPlugin(),
      new NoEmitOnErrorsPlugin(),
      new HotModuleReplacementPlugin(),
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        templateParameters: {
          host: SELECT_URL,
          isStaging: false,
        },
        minify: {
          collapseWhitespace: true,
          processConditionalComments: true,
          minifyJS: isProduction,
        },
      }),
      new HtmlWebpackPlugin({
        filename: 'staging.html',
        template: 'src/index.html',
        templateParameters: {
          host: SELECT_URL,
          isStaging: true,
        },
      }),
      new HtmlWebpackPlugin({
        template: 'src/open-search-description.xml',
        filename: 'open-search-description.xml',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
      new DotenvPlugin({
        systemvars: true,
        silent: true,
      }),
    ],
    devServer: {
      compress: true,
      disableHostCheck: true,
      historyApiFallback: true,
      host: '0.0.0.0',
      hot: true,
      open: false,
      port: 9000,
      stats: {
        all: false,
        assets: true,
        assetsSort: isProduction ? '!size' : 'id',
        errors: true,
        errorDetails: true,
        excludeAssets: [/\.map$/],
        hash: true,
        moduleTrace: true,
        performance: isProduction,
        version: true,
        warnings: true,
        warningsFilter: 'size limit',
      },
      public: SELECT_URL,
      contentBase: path.resolve(__dirname, 'dist'),
      sockPort: 443,
      allowedHosts: [SELECT_URL],
    },
    devtool,
    optimization: {
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
        }),
      ],
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };

  return config;
};

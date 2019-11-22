const path = require('path');

const {
  ProgressPlugin,
  NoEmitOnErrorsPlugin,
  HotModuleReplacementPlugin,
} = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

require('dotenv').config();

module.exports = (env, argv) => ({
  entry: {
    app: [
      '@babel/polyfill',
      './src/app/index.tsx',
      './src/css/main.css',
    ],
    articleContentStyle: './src/css/articleContentStyle.css'
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, 'dist'),
    publicPath: process.env.ASSET_PATH || '/',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'tslint-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          argv.mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
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
        include: /(fonts|images)\//,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: argv.mode !== 'production' ? '[name].[ext]' : '[contenthash].[ext]',
              outputPath: 'assets',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
  },
  plugins: [
    new ProgressPlugin(),
    new NoEmitOnErrorsPlugin(),
    new HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      templateParameters: {
        host: process.env.SELECT_URL,
        isStaging: false,
      },
      minify: {
        collapseWhitespace: true,
        processConditionalComments: true,
        minifyJS: argv.mode === 'production',
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'staging.html',
      template: 'src/index.html',
      templateParameters: {
        host: process.env.SELECT_URL,
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
  devtool: argv.mode !== 'production' ?  'cheap-module-eval-source-map' : 'cheap-source-map',
  devServer: {
    compress: true,
    disableHostCheck: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    open: false,
    port: 9000,
    public: process.env.SELECT_URL,
  },
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
});

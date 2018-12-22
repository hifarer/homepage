
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'

let entry = {}
let htmlPlugins = []

let pages = {
  homepage: 'hifarer\'s homepage',
  calendar: '日历',
  weather: '天气',
  dadishu: '打地鼠',
  lianliankan: '连连看'
}

Object.keys(pages).forEach(item => {
  entry[item] = `./src/pages/${item}.jsx`
  htmlPlugins.push(
    new HtmlWebpackPlugin({
      name: item,
      title: pages[item],
      chunks: [item],
      filename: `${item === 'homepage' ? 'index' : item}.html`,
      app: ['weather', 'calendar'].includes(item),
      game: ['dadishu', 'lianliankan'].includes(item),
      template: `./src/template/${item === 'homepage' ? 'pc' : 'mobile'}.html`,
      minify: {
        removeComments: true, // 是否去掉注释
        collapseWhitespace: true // 是否去掉空格
      }
    })
  )
})

module.exports = {
  watch: !isProd,
  mode: process.env.NODE_ENV,
  devtool: isProd ? false : 'eval-source-map',
  stats: {
    children: false
  },
  entry: entry,
  output: {
    filename: 'js/[name].min.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          'babel-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(css|less)$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            context: 'src'
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(mp3|pdf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '/assets/[name].[ext]'
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: isProd ? [
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css'
    }),
    new CopyWebpackPlugin([
      { from: 'src/libs', to: 'js' }
    ]),
    ...htmlPlugins
  ] : [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      { from: 'src/libs', to: 'js' }
    ]),
    ...htmlPlugins
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true, // 单页应用可以刷新路由
    disableHostCheck: true,
    open: true, // 是否自动打开浏览器
    hot: true, // 热更新
    port: 8899
  }
}

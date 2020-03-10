const path = require('path'),
  Webpack = require('webpack'),
  WebpackBar = require('webpackbar'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const htmlArr = [
  { name: 'index', chunks: ['index'], url: './src/js/app.js' },
  { name: 'demo', chunks: ['demo'], url: './src/js/demo.js' },
];
const entryObj = {};
for (let i of htmlArr) {
  entryObj[i.name] = i.url;
}
const HtmlPluginArr = htmlArr.map(item => {
  return new HtmlWebpackPlugin({
    inject: true,
    hash: false,
    template: `src/${item.name}.html`,
    filename: `${item.name}.html`,
    chunks: item.chunks,  // 按需引入对应名字的js文件
    minify: {
      collapseWhitespace: false, // 压缩空格
      removeAttributeQuotes: false, // 移除引号
      removeComments: true // 移除注释
    }
  })
});

const options = {
  entry: entryObj,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.(le|sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(png|jpg|gif|jpeg|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: "[name].[hash:5].[ext]",
              outputPath: "images",
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.(htm|html)$/,
        use: {
          loader: 'html-withimg-loader',
          options: {
            name: "[name].[hash:5].[ext]",
            outputPath: "images"
          }
        }
      },
      {
        test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
        use: ['file-loader?name=/assets/fonts/[name].[ext]&']
      },
      {
        //暴露$和jQuery到全局
        test: require.resolve('jquery'), // require.resolve 用来获取模块的绝对路径
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        }, {
          loader: 'expose-loader',
          options: '$'
        }]
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.less', '.css']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Webpack.HotModuleReplacementPlugin(),
    new WebpackBar(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash].css',
      disable: false,
      allChunks: true
    }),
    ...HtmlPluginArr
  ],
  devServer: {
    contentBase: path.join(__dirname, 'src/pages/'),
    port: 9000,
    compress: true,
    hot: true,
    open: true,
    inline: true,
    overlay: true,
    // It's a required option.
    // publicPath: "/assets",
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  stats: 'errors-only'
};

module.exports = function(env, argv) {
  return require('./.webpack/webpack.' + (argv.mode === 'production' ? 'prod' : 'dev') + '.conf.js')(options)
};

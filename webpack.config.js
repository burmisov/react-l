module.exports = {
  context: __dirname,
  entry: './index',
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        loader: 'babel-loader',
      }
    ]
  },
  devtool: '#inline-source-map',
};

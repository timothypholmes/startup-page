// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(glsl|frag|vert)$/,
        use: 'raw-loader',
      },
    ],
  },
};
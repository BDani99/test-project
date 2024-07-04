
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://www.mbhbank.hu',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
};

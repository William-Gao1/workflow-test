const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://portalapi2.uwaterloo.ca/v2',
      "pathRewrite": {
        "^/api" : ""
      },
      changeOrigin: true,
    })
  );
};
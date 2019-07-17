module.exports = {
  "/api": {
    // "target": "http://192.168.2.118:8080",
    "target": "http://graph.policegap.cn:18080",
    "changeOrigin": true,
    "ws": false,
    "pathRewrite": {
      "^/api": "/api"
    }
  }
}
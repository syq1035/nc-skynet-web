module.exports = {
  "/api": {
    // "target": "http://192.168.1.167:8080",
    "target": "http://graph.policegap.cn:18080",
    "changeOrigin": true,
    "ws": false,
    "pathRewrite": {
      "^/api": "/api"
    }
  }
}
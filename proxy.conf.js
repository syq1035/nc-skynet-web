module.exports = {
  "/api": {
    // "target": "http://192.168.1.167:8080",
    
    "changeOrigin": true,
    "ws": false,
    "pathRewrite": {
      "^/api": "/api"
    }
  }
}
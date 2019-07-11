const proxyObject = require('./proxy.conf')

module.exports = { 
  webpack: (config, env) => {
    config.module.rules = config.module.rules.map(rule => {
      if (rule.oneOf instanceof Array) {
        return {
          ...rule,
          oneOf: [
            {
              test: /\.styl$/, 
              loader: 'style-loader!css-loader!stylus-loader' 
            },
            {
              test: /\.less$/,
              use: [{
                loader: 'style-loader',
              }, {
                loader: 'css-loader', // translates CSS into CommonJS
              }, {
                loader: 'less-loader', // compiles Less to CSS
                options: {
                  modifyVars: {
                    // 'primary-color': '#1DA57A',
                    // 'link-color': '#1DA57A',
                    // 'border-radius-base': '2px',
                    // 'text-color': '#000',
                  },
                  javascriptEnabled: true,
                }
              }]
            },
            ...rule.oneOf
          ]
        };
      }
      return rule;
    });

    return config;
  },
  devServer: function (configFunction, env) {
    if (env === 'development') {
      return (proxy, allowedHost) => {
        const config = configFunction(
          {
            ...proxy, 
            ...proxyObject
          },
          allowedHost);
        return config;
      };
    }
  }
}
const { override, addWebpackAlias, addWebpackModuleRule } = require("customize-cra");
const path = require("path");

 
module.exports = override(
    //增加路径别名的处理
    addWebpackAlias({
        '@': path.resolve('./src')
    }),
    addWebpackModuleRule({
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      }),
    //   addWebpackPlugin(new Mocking({
    //     path: './mock',
    //   }))
);
module.exports = {
  devServer: {
    // 自动打开浏览器
    open: true,
    // 端口号
    port: 8081,
    host: '127.0.0.1',
    disableHostCheck: true
  },
  // 关闭 eslint 规范
  lintOnSave: true,
  // 配置静态资源基本路径
  publicPath: 'http://a.91nlp.cn/'
  // publicPath: '/'
}
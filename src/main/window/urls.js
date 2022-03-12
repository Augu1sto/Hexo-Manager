export const ENTRY_URL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080` // 开发模式的话走webpack-dev-server的url
  : `file://${__dirname}/index.html`

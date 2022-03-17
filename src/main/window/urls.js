export const ENTRY_URL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080` // 开发模式的话走webpack-dev-server的url
  : `file://${__dirname}/index.html`

export const EDITOR_URL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080#editor-page` // 开发模式的话走webpack-dev-server的url
  : `file://${__dirname}/index.html#editor-page`

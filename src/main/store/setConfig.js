const Store = require('electron-store')
const store = new Store()

function getRoot () {
  let hexoRoot = store.get('hexo_root')
  return hexoRoot
}

function setRoot (root) {
  store.set('hexo_root', root)
}

function getOpenMethod () {
  let method = store.get('open_method')
  return method
}

function setOpenMethod (method) {
  store.set('open_method', method)
}

export {getRoot, setRoot, getOpenMethod, setOpenMethod}

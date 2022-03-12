const Store = require('electron-store')
const store = new Store()

function getRoot () {
  let hexoRoot = store.get('hexo_root')
  return hexoRoot
}

function setRoot (root) {
  store.set('hexo_root', root)
}

export {getRoot, setRoot}

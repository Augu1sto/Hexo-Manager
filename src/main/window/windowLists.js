import { ENTRY_URL, EDITOR_URL } from './urls'

const windowList = new Map()

const ENTRY_WINDOW = {
  height: 500,
  useContentSize: true,
  width: 720,
  title: 'Hexo-Manager',
  center: true,
  frame: false,
  titleBarStyle: 'hidden',
  resizable: false,
  backgroundColor: '#F2F2F2',
  show: false,
  webPreferences: {
    // 开启node
    nodeIntegration: true,
    contextIsolation: false,
    // 开启remote
    enableRemoteModule: true
  }
}

windowList.set(ENTRY_WINDOW, ENTRY_URL)

const EDITOR_WINDOW = {
  height: 1080,
  width: 1920,
  title: 'Hexo-Manager-editor',
  center: true,
  frame: true,
  // titleBarStyle: 'hidden',
  resizable: true,
  backgroundColor: '#F2F2F2',
  show: false,
  webPreferences: {
    // 开启node
    nodeIntegration: true,
    contextIsolation: false,
    // 开启remote
    enableRemoteModule: true
  }
}

windowList.set(EDITOR_WINDOW, EDITOR_URL)

export {windowList, ENTRY_WINDOW, EDITOR_WINDOW}

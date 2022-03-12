import { ENTRY_URL } from './urls'

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

export {windowList, ENTRY_WINDOW}

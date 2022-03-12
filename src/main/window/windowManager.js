import { windowList } from './windowLists'
import { BrowserWindow } from 'electron'

export function createWindow (window) {
  // 创建窗口
  /**
     * Initial window options
     */
  let winURL = windowList.get(window)

  return () => {
    let myWindow = new BrowserWindow(window)
    myWindow.loadURL(winURL) // 加载窗口的URL -> 来自renderer进程的页面

    myWindow.once('ready-to-show', () => {
    // 防止视觉闪烁
      myWindow.show()
    })

    myWindow.on('closed', () => {
      myWindow = null
    })
  }
}

import { windowList } from './windowLists'
import { BrowserWindow } from 'electron'

export function createWindow (window, ...args) {
  // 创建窗口
  /**
     * Initial window options
     */
  let winURL = windowList.get(window)

  return () => {
    let myWindow = new BrowserWindow(window)
    myWindow.loadURL(winURL) // 加载窗口的URL -> 来自renderer进程的页面

    myWindow.once('ready-to-show', () => {
      myWindow.webContents.send('data', ...args)
      // 防止视觉闪烁
      myWindow.show()
    })
    // 监听主窗口最大化， 给你的BrowserWindow() 对象添加监听事件
    myWindow.on('maximize', () => {
      myWindow.webContents.send('winMax', true)
    })
    myWindow.on('unmaximize', () => {
      myWindow.webContents.send('winMax', false)
    })

    myWindow.on('closed', () => {
      myWindow = null
    })
    // return myWindow 可行吗？
  }
}

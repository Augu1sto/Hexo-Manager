import { ipcMain, BrowserWindow } from 'electron'
import { openFile, newAndOpenFile, deployAll } from '../core/apis'
import { setRoot } from '../store/setConfig'
import { createWindow } from '../window/windowManager'
import { EDITOR_WINDOW } from '../window/windowLists'

export default {
  listen () {
    // 最小化窗口
    ipcMain.on('minimize_w', () => {
      const window = BrowserWindow.getFocusedWindow()
      window.minimize()
    })

    // 关闭窗口
    ipcMain.on('close_w', () => {
      const window = BrowserWindow.getFocusedWindow()
      if (process.platform === 'linux') {
        window.hide()
      } else {
        window.close()
        // app.quit()
      }
    })

    // 设置
    ipcMain.on('setConfig', (event, value) => {
      console.log(value)
      setRoot(value)
      event.returnValue = 'setSuccess'
    })

    // 新建文件
    ipcMain.on('newFile', (event, value, fname) => {
      console.log(value + fname)
      newAndOpenFile(value, fname)
      event.returnValue = 'success'
    })

    // 打开文件
    ipcMain.on('open_file', () => {
      openFile()
    })

    // 一键部署
    ipcMain.on('deploy_all', (event) => {
      deployAll(event)
    })

    // 打开编辑器
    ipcMain.on('open_editor', createWindow(EDITOR_WINDOW))
  }
}

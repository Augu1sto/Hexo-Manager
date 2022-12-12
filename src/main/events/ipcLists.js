import { ipcMain, BrowserWindow, app, shell } from 'electron'
import { openFile, newAndOpenFile, deployAll, getRecentFiles, openRencentFile } from '../core/apis'
import { setRoot, setOpenMethod } from '../store/setConfig'

export default {
  listen () {
    // 最小化窗口
    ipcMain.on('minimize_w', () => {
      const window = BrowserWindow.getFocusedWindow()
      window.minimize()
    })

    // 最大化窗口
    ipcMain.on('maximize_w', () => {
      const window = BrowserWindow.getFocusedWindow()
      if (window.isMaximized()) {
        window.unmaximize()
      } else {
        window.maximize()
      }
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

    // 打开外部网页
    ipcMain.on('openExUrl', (_, url) => {
      console.log(url)
      shell.openExternal(url)
    })

    // 打开数据目录
    ipcMain.on('openDataDir', () => {
      const userDataPath = app.getPath('userData')
      shell.openPath(userDataPath)
    })
    // 设置
    ipcMain.on('setConfig', (event, value1, value2) => {
      console.log(value1 + value2)
      setRoot(value1)
      setOpenMethod(value2)
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

    // // 打开编辑器
    // ipcMain.on('open_editor', createWindow(EDITOR_WINDOW))
    // 获得最近3个文件
    ipcMain.on('get_recent', (event) => {
      event.returnValue = getRecentFiles()
    })

    // 打开最近文件
    ipcMain.on('open_recent', (_, item) => {
      openRencentFile(item)
    })
  }

}

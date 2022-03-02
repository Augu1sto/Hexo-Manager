'use strict'

import { app, BrowserWindow, Menu, ipcMain, shell } from 'electron' // 从electron引入app和BrowserWindow
import '../renderer/store'
import { exec } from 'child_process'
// import { iconv } from 'iconv-lite'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080` // 开发模式的话走webpack-dev-server的url
    : `file://${__dirname}/index.html`

function createWindow () {
  // 创建窗口
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 500,
    useContentSize: true,
    width: 720,
    title: 'Hexo-Manager',
    center: true,
    frame: true,
    titleBarStyle: 'hidden',
    resizable: true,
    backgroundColor: '#F2F2F2',
    // alwaysOnTop: true,

    webPreferences: {
      // 开启node
      nodeIntegration: true,
      contextIsolation: false,
      // 开启remote
      enableRemoteModule: true
    }
  })

  mainWindow.loadURL(winURL) // 加载窗口的URL -> 来自renderer进程的页面

  mainWindow.once('ready-to-show', () => {
    // 防止视觉闪烁
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createMenu () {
  // 创建目录
  /**
   * Initial Menu Options
   */
  if (process.env.NODE_ENV !== 'development') {
    const template = [
      {
        label: 'Edit',
        submenu: [
          { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
          {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            selector: 'redo:'
          },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            selector: 'selectAll:'
          },
          {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click () {
              app.quit()
            }
          }
        ]
      }
    ]
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }
}

function bootConfig () {
  createWindow()
  createMenu()
}

app.on('ready', bootConfig) // 调用createWindow创建窗口

app.on('window-all-closed', () => {
  // 所有窗口都关闭
  if (process.platform !== 'darwin') {
    // 当操作系统不是darwin（macOS）的话
    app.quit() // 退出应用
  }
})

app.on('activate', () => {
  // 仅macOS
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('minimize_w', () => {
  const window = BrowserWindow.getFocusedWindow()
  window.minimize()
})

ipcMain.on('close_w', () => {
  const window = BrowserWindow.getFocusedWindow()
  if (process.platform === 'linux') {
    window.hide()
  } else {
    window.close()
    app.quit()
  }
})

let hexoRoot = 'E:\\MyBlog'

ipcMain.on('newFile', (event, value, fname) => {
  console.log(value + fname)
  newAndOpenFile(value, fname)
  event.returnValue = 'success'
})

function newAndOpenFile (value, fname) {
  const cmdPath = hexoRoot
  const cmdStr = 'hexo new "' + value + '"' // hexo new [article_name]
  // const cmdStr0 = iconv.decode(cmdStr, 'cp936')
  const workerProcess = exec(cmdStr, {
    cwd: cmdPath,
    encoding: 'gbk'
  })
  workerProcess.stdout.on('data', (data) => {
    console.log('stdout: ' + data.toString())
  })

  // 打印错误的后台可执行程序输出
  workerProcess.stderr.on('data', (data) => {
    console.log('stderr: ' + data.toString())
  })

  // 退出之后的输出
  workerProcess.on('close', (code) => {
    console.log('out code：' + code)

    try {
      shell.openPath(hexoRoot + '\\source\\_posts\\' + fname + '.md')
    } catch (error) {
      console.error(error)
    }
  })
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

'use strict'

import { app, BrowserWindow, Menu } from 'electron' // 从electron引入app和BrowserWindow
import '../renderer/store'

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

function createWindow() {
  // 创建窗口
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 900,
    useContentSize: true,
    width: 1000,
    title: 'Hexo-Manager',
    center: true,
    frame: true,
    resizable: true,
    backgroundColor: '#fff',
    alwaysOnTop: true
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

function createMenu() {
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
            click() {
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

function bootConfig() {
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

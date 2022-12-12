'use strict'

import { app } from 'electron'
import '../renderer/store'
import { createWindow } from './window/windowManager'
import { ENTRY_WINDOW } from './window/windowLists'
import ipcLists from './events/ipcLists'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

if (process.platform === 'win32') {
  app.setAppUserModelId('hexo-manager')
}

// function createMenu () {
//   // 创建目录
//   /**
//    * Initial Menu Options
//    */
//   if (process.env.NODE_ENV !== 'development') {
//     const template = [
//       {
//         label: 'Edit',
//         submenu: [
//           { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
//           {
//             label: 'Redo',
//             accelerator: 'Shift+CmdOrCtrl+Z',
//             selector: 'redo:'
//           },
//           { type: 'separator' },
//           { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
//           { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
//           { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
//           {
//             label: 'Select All',
//             accelerator: 'CmdOrCtrl+A',
//             selector: 'selectAll:'
//           },
//           {
//             label: 'Quit',
//             accelerator: 'CmdOrCtrl+Q',
//             click () {
//               app.quit()
//             }
//           }
//         ]
//       }
//     ]
//     const menu = Menu.buildFromTemplate(template)
//     Menu.setApplicationMenu(menu)
//   }
// }

app.on('ready', createWindow(ENTRY_WINDOW)) // 调用createWindow创建窗口

app.on('window-all-closed', () => {
  // 所有窗口都关闭
  if (process.platform !== 'darwin') {
    // 当操作系统不是darwin（macOS）的话
    app.quit() // 退出应用
  }
})

ipcLists.listen()
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

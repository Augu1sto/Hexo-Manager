// 与hexo交互的主要api
import { shell, dialog } from 'electron'
import { exec } from 'child_process'
import { createWindow } from '../window/windowManager'
import { EDITOR_WINDOW } from '../window/windowLists'

const Store = require('electron-store')
const log = require('electron-log')
console.log = log.log
console.error = log.error
// const store = new Store()
// const hexoRoot = require('../store/setConfig').getRoot()
// const openMethod = require('../store/setConfig').getOpenMethod()

function openFile () {
  let store = new Store()
  let hexoRoot = store.get('hexo_root')
  let openMethod = store.get('open_method')
  dialog.showOpenDialog({
    title: '打开文件',
    defaultPath: hexoRoot + '\\source\\_posts\\',
    properties: ['openFile'],
    filters: [{ name: 'Markdown文件', extensions: ['md', 'markdown'] }]
  })
    .then((result) => {
      openFileWithPath(result.filePaths[0], openMethod)
      // console.log('openfile:' + result.filePaths) // 获得打开的文件路径
      // console.log('open by method ' + openMethod)
      // if (openMethod === '2') {
      //   openFileBySys(result.filePaths[0])
      // } else {
      //   // todo
      //   openFileByDefault(result.filePaths[0])
      // }
    })
    .catch((err) => {
      console.error(err)
    })
}

function openFileWithPath (path, method = 1) {
  console.log('openfile:' + path) // 获得打开的文件路径
  console.log('open by method ' + method)
  if (method === '2') {
    openFileBySys(path)
  } else {
    openFileByDefault(path)
  }
}

function openFileBySys (path) {
  return shell.openPath(path)
}

function openFileByDefault (path) {
  if (path !== undefined) {
    console.log(path)
    let store = new Store()
    let hexoRoot = store.get('hexo_root')
    const fs = require('fs')
    let categories = fs.readdirSync(hexoRoot + '\\public\\categories\\')
    categories = categories.filter((item) => { return item !== 'index.html' })
    let tags = fs.readdirSync(hexoRoot + '\\public\\tags\\')
    tags = tags.filter((item) => { return item !== 'index.html' })
    return setTimeout(createWindow(EDITOR_WINDOW, path, categories, tags), 0)
  }
}

function newAndOpenFile (fname) {
  let store = new Store()
  let hexoRoot = store.get('hexo_root')
  let openMethod = store.get('open_method')
  const cmdPath = hexoRoot
  const cmdStr = 'hexo new "' + fname + '"' // hexo new "[article_name]"
  // const cmdStr0 = iconv.decode(cmdStr, 'cp936')
  console.log('[create file]' + cmdStr)
  const workerProcess = exec(cmdStr, {
    cwd: cmdPath,
    encoding: 'gbk'
  })
  workerProcess.stdout.on('data', (data) => {
    console.log('stdout: ' + data.toString())
  })

  // 打印错误的后台可执行程序输出
  workerProcess.stderr.on('data', (data) => {
    console.error('stderr: ' + data.toString())
  })

  // 退出之后的输出
  workerProcess.on('close', (code) => {
    console.log('out code：' + code)
    try {
      openFileWithPath(hexoRoot + '\\source\\_posts\\' + fname + '.md', openMethod)
      // if (openMethod === '2') {
      //   openFileBySys(hexoRoot + '\\source\\_posts\\' + fname + '.md')
      //   // shell.openPath(hexoRoot + '\\source\\_posts\\' + fname + '.md')
      // } else {
      //   // todo
      //   openFileByDefault(hexoRoot + '\\source\\_posts\\' + fname + '.md')
      //   // setTimeout(createWindow(EDITOR_WINDOW), 0)
      // }
    } catch (error) {
      console.error(error)
    }
  })
}

function deployAll (event) {
  let store = new Store()
  let hexoRoot = store.get('hexo_root')
  const cmdPath = hexoRoot
  const cmdStr = 'hexo cl&&hexo g -d'
  // const cmdStr0 = iconv.decode(cmdStr, 'cp936')
  console.log('[DEPLOY]')
  const workerProcess = exec(cmdStr, {
    cwd: cmdPath,
    encoding: 'gbk'
  })
  workerProcess.stdout.on('data', (data) => {
    console.log('stdout: ' + data.toString())
  })

  // 打印错误的后台可执行程序输出
  workerProcess.stderr.on('data', (data) => {
    console.error('stderr: ' + data.toString())
  })

  // 退出之后的输出
  workerProcess.on('close', (code) => {
    console.log('out code：' + code)
    event.returnValue = 'deploySuccess'
  })
}

// 获得最近的文件
function getRecentFiles (n = 3) {
  let store = new Store()
  let hexoRoot = store.get('hexo_root')
  const fs = require('fs')
  const path = require('path')
  let dirPath = hexoRoot + '\\source\\_posts\\'
  let fileList = fs.readdirSync(dirPath)
  fileList = fileList.filter((file) => { return path.extname(file) === '.md' })
  console.log(fileList)
  fileList = fileList.sort((a, b) => {
    return fs.statSync(dirPath + b).mtimeMs - fs.statSync(dirPath + a).mtimeMs
  })
  console.log(fileList)
  return fileList.splice(0, n)
}

function openRencentFile (fname) {
  let store = new Store()
  let hexoRoot = store.get('hexo_root')
  let dirPath = hexoRoot + '\\source\\_posts\\'
  let openMethod = store.get('open_method')
  openFileWithPath(dirPath + fname, openMethod)
}

export {openFile, newAndOpenFile, deployAll, getRecentFiles, openRencentFile}

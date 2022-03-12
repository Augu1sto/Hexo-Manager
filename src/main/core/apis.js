// 与hexo交互的主要api
import { shell, dialog } from 'electron'
import { exec } from 'child_process'

const hexoRoot = require('../store/setConfig').getRoot()

function openFile () {
  dialog.showOpenDialog({
    title: '打开文件',
    defaultPath: hexoRoot + '\\source\\_posts\\',
    properties: ['openFile'],
    filters: [{ name: 'Markdown文件', extensions: ['md', 'markdown'] }]
  })
    .then((result) => {
      console.log(result.filePaths) // 获得打开的文件路径
      shell.openPath(result.filePaths[0])
    })
    .catch((err) => {
      console.log(err)
    })
}

function newAndOpenFile (value, fname) {
  const cmdPath = hexoRoot
  const cmdStr = 'hexo new "' + value + '"' // hexo new "[article_name]"
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

function deployAll (event) {
  const cmdPath = hexoRoot
  const cmdStr = 'hexo cl&&hexo g -d'
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
    event.returnValue = 'deploySuccess'
  })
}

export {openFile, newAndOpenFile, deployAll}

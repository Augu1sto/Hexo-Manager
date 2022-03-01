/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
require('electron-debug')({ showDevTools: true })

const{BrowserWindow}=require("electron")
// Install `vue-devtools`
require('electron').app.on('ready', () => {
  try {
    // await installExtension(VUEJS_DEVTOOLS);
    // 新增的：安装vue-devtools
    const { session } = require("electron");
    const path = require("path");
    session.defaultSession.loadExtension(
      path.resolve(__dirname, "../../../devtools-5.1.1/shells/chrome/")  //这个是刚刚build好的插件目录
    ); 
// 这个版本里没有addDevToolsExtension方法了
// BrowserWindow.addDevToolsExtension(path.resolve(__dirname, "../../devTools/chrome")  );
  } catch (e) {
    console.error("Vue Devtools failed to install:", e.toString());
  }

})

// Require `main` process to boot app
require('./index')
<template>
  <div id="entry-page">
    <div class="fake-title-bar">
      Hexo-Manager
      <div class="handle-bar">
        <!-- 如果是windows系统 就加上模拟的操作按钮-->
        <i class="el-icon-minus" @click="minimizeWindow"></i>
        <i class="el-icon-close" @click="closeWindow"></i>
        <!-- <i class="el-icon-minus"></i>
        <i class="el-icon-close"></i> -->
      </div>
    </div>
    <el-container>
      <el-header height="280px" style="padding-top: 50px">
        <img src="static/banner.png" />
      </el-header>
      <el-container>
        <el-aside width="50%">
          <el-row>
            <el-col :push="6" :span="16">
              <div>
                <el-divider content-position="right">最近文件</el-divider>
                <div class="flist">
                  <ul>
                    <li><el-link :underline="false">无下划线</el-link></li>
                    <li><el-link :underline="false">无下划线</el-link></li>
                  </ul>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <el-row :gutter="25">
            <el-col :span="10">
              <el-button style="width: 100%" @click="openFile">打开</el-button>
            </el-col>
            <el-col :span="10">
              <el-button style="width: 100%" @click="openNew">新建</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-button type="primary" style="width: 100%">一键部署</el-button>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  methods: {
    minimizeWindow () {
      const { ipcRenderer } = require('electron')
      ipcRenderer.send('minimize_w')
    },

    closeWindow () {
      const { ipcRenderer } = require('electron')
      ipcRenderer.send('close_w')
    },
    openFile () {
      this.$electron.remote.dialog
        .showOpenDialog({
          title: '打开文件',
          defaultPath: 'E:\\MyBlog\\source\\_posts',
          properties: ['openFile'],
          filters: [{ name: 'Markdown文件', extensions: ['md', 'markdown'] }]
        })
        .then((result) => {
          console.log(result.filePaths) // 获得打开的文件路径
          this.$electron.remote.shell.openPath(result.filePaths[0])
        })
        .catch((err) => {
          console.log(err)
        })
    },

    openNew () {
      this.$prompt('请输入文章名', '新建文章', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern:
        //   /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      })
        .then(({ value }) => {
          const fname = value.replace(/[<>:"/\\|?* ]+/g, '-') // 转化文件名，去除特殊字符(包含空格)
          // this.$message({
          //   type: 'success',
          //   message: '新建文章: ' + fname + '.md'
          // })
          const { ipcRenderer } = require('electron')
          const replyMessage = ipcRenderer.sendSync('newFile', value, fname)
          if (replyMessage === 'success') {
            this.$message({
              type: 'success',
              message: '新建文章: ' + fname + '.md'
            })
            console.log(replyMessage)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    }
  }
}
</script>

<style>
.el-header {
  text-align: center;
  padding: 0 5px;
}
.el-aside {
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #f2f2f2;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.el-button {
  min-width: 90px;
}

.fake-title-bar {
  -webkit-app-region: drag;
  height: 22px;
  width: 100%;
  text-align: center;
  color: #a3a3a3;
  font-size: 12px;
  line-height: 22px;
  position: fixed;
  z-index: 100;
}

.handle-bar {
  position: absolute;
  top: 2px;
  right: 20px;
  z-index: 10000;
  -webkit-app-region: no-drag;
}
.handle-bar i {
  cursor: pointer;
  font-size: 16px;
  margin-left: 5px;
}
.handle-bar .el-icon-minus:hover {
  color: #71b6ff;
}
.handle-bar .el-icon-close:hover {
  color: #bdbeff;
}

.el-row {
  margin-bottom: 20px;
  line-height: 40px;
}
.el-divider {
  height: 2px;
}
.el-divider__text.is-right {
  color: #a3a3a3;
  background: #f2f2f2;
  font-size: 12px;
  line-height: 15px;
}

.flist {
  color: #7e7e7e;
  background: #dfdfdf88;
  margin-top: -15px;
  height: 90px;
  padding-top: 1px;
  /* align: left; */
  /* font-size: 12px; */
}

.flist .el-link {
  font-size: 12px;
}

ul {
  list-style-type: '>>';
  font-size: 12px;
}

li {
  line-height: 14px;
  margin: 0px 8px 2px -15px;
  text-align: left;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.bg-purple-dark {
  background: #99a9bf00;
}
.bg-purple {
  background: #d3dce600;
}
.bg-purple-light {
  background: #e5e9f200;
}

.grid-content {
  border-radius: 4px;
  min-height: 160px;
}
</style>

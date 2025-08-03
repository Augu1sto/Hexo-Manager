<template>
    <div class="fake-title-bar">
        {{ require("path").basename(file_path) }}
        <span v-if="!isSaved" style="color: orangered"> *</span>
        <div class="handle-bar">
            <i class="el-icon-minus" @click="minimizeWindow"></i>
            <i v-if="!isMaximize" class="el-icon-max" @click="maximizeWindow">&#8414;</i>
            <i v-else class="el-icon-copy-document" @click="maximizeWindow"></i>
            <i class="el-icon-close" @click="preCloseWindow"></i>
        </div>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron')
export default {
    name: 'FakeTitleBar',
    props: ['file_path', 'isSaved', 'isMaximize'],
    methods: {
        minimizeWindow() {
            ipcRenderer.send('minimize_w')
        },
        maximizeWindow() {
            ipcRenderer.send('maximize_w')
        },
        closeWindow() {
            ipcRenderer.send('close_w')
        },
        // 先保存后退出
        async preCloseWindow() {
            if (!this.isSaved) {
                await this.askToSave()
            }
            this.closeWindow()
        },
        askToSave: function () {
            return new Promise((resolve, reject) => {
                this.$confirm('文件尚未保存, 是否保存文件?', '提示', {
                    confirmButtonText: '保存',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.saveText()
                        resolve()
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消保存'
                        })
                        resolve()
                    })
            })
        }
    }
};
</script>

<style scoped>
/* customize icon */
.handle-bar .el-icon-max {
    width: 16px;
}

.handle-bar .el-icon-max:hover {
    color: #ffffff;
}

.handle-bar .el-icon-copy-document {
    transform: rotate(180deg);
}

.el-icon-copy-document:hover {
    color: #ffffff;
}
</style>
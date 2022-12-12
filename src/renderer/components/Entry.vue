<template>
	<div id="entry-page">
		<div class="fake-title-bar">
			Hexo-Manager
			<div class="handle-bar">
				<el-dropdown trigger="click" @command="handleCommand">
					<span class="el-dropdown-link">
						<i
							class="el-icon-arrow-down"
						></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="developer"
							>开发者主页</el-dropdown-item
						>
						<el-dropdown-item command="github"
							>项目github</el-dropdown-item
						>
						<el-dropdown-item command="dir"
							>用户数据目录</el-dropdown-item
						>
					</el-dropdown-menu>
				</el-dropdown>
				<i
					class="el-icon-setting"
					@click="dialogFormVisible = true"
				></i>
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
								<el-divider content-position="right"
									>最近文件</el-divider
								>
								<div class="flist">
									<ul>
										<li v-for="(item, index) in fileList" :key="index">
											<el-link :underline="false" @click="openRencentFile(item)"
												>{{item}}</el-link
											>
										</li>
									</ul>
								</div>
							</div>
						</el-col>
					</el-row>
				</el-aside>
				<el-main>
					<el-row :gutter="25">
						<el-col :span="10">
							<el-button style="width: 100%" @click="openFile"
								>打开</el-button
							>
						</el-col>
						<el-col :span="10">
							<el-button style="width: 100%" @click="openNew"
								>新建</el-button
							>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="20">
							<el-button
								type="primary"
								style="width: 100%"
								@click="deployAll"
								>一键部署</el-button
							>
						</el-col>
					</el-row>
				</el-main>
			</el-container>
			<el-dialog
				title="设置"
				:visible.sync="dialogFormVisible"
				width="70%"
			>
				<el-form :model="form" label-position="top" size="small">
					<el-form-item label="hexo根目录">
						<el-input
							v-model="form.route"
							autocomplete="off"
						></el-input>
					</el-form-item>
					<el-form-item label="文件打开方式">
						<el-radio v-model="form.openMethod" label="1"
							>内置编辑器</el-radio
						>
						<el-radio v-model="form.openMethod" label="2"
							>系统默认编辑器</el-radio
						>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="setConfig"
						>确 定</el-button
					>
				</div>
			</el-dialog>
		</el-container>
	</div>
</template>
<script>
const hexoRoot = require("../../main/store/setConfig").getRoot();
const openMethod = require("../../main/store/setConfig").getOpenMethod();

export default {
	name: "entry-page",
	data() {
		return {
			dialogFormVisible: false,
			form: {
				route: hexoRoot || "",
				openMethod: openMethod || "1",
			},
			fileList: []
		};
	},
	created() {
		const { ipcRenderer } = require("electron");
		this.fileList = ipcRenderer.sendSync('get_recent');
	},
	methods: {
		handleCommand(command) {
			const { ipcRenderer } = require("electron");
			switch(command) {
				case 'developer':
					ipcRenderer.send('openExUrl', 'https://augu1sto.gitee.io/');
					break;
				case 'github':
					ipcRenderer.send('openExUrl', 'https://github.com/Augu1sto/Hexo-Manager/');
					break;
				case 'dir':
					ipcRenderer.send('openDataDir');
					break;
				default:
					break;
			}
		},
		setConfig() {
			const { ipcRenderer } = require("electron");
			const replyMessage = ipcRenderer.sendSync(
				"setConfig",
				this.form.route,
				this.form.openMethod
			);
			if (replyMessage === "setSuccess") {
				this.$message({
					type: "success",
					message: "设置成功",
				});
				console.log(replyMessage);
			}
			this.dialogFormVisible = false;
		},

		cancel() {
			this.$message({
				type: "info",
				message: "取消设置",
			});
			this.dialogFormVisible = false;
		},

		minimizeWindow() {
			const { ipcRenderer } = require("electron");
			ipcRenderer.send("minimize_w");
		},

		closeWindow() {
			const { ipcRenderer } = require("electron");
			ipcRenderer.send("close_w");
		},
		openRencentFile(item) {
			const { ipcRenderer } = require("electron");
			ipcRenderer.send("open_recent", item);
		},
		openFile() {
			const { ipcRenderer } = require("electron");
			ipcRenderer.send("open_file"); // 用自研编辑器打开
		},

		openNew() {
			this.$prompt("请输入文章名", "新建文章", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
			})
				.then(({ value }) => {
					//   const fname = value.replace(/[<>:"/\\|?* ]+/g, '-') // 转化文件名，去除特殊字符(包含空格)
					const { slugize } = require("hexo-util");
					const fname = slugize(value);
					console.log(fname);

					const { ipcRenderer } = require("electron");
					const replyMessage = ipcRenderer.sendSync("newFile", fname);
					if (replyMessage === "success") {
						this.$message({
							type: "success",
							message: "新建文章: " + fname + ".md",
						});
						console.log(replyMessage);
					}
				})
				.catch(() => {
					this.$message({
						type: "info",
						message: fname,
					});
				});
		},

		deployAll() {
			const { ipcRenderer } = require("electron");
			this.$notify({
				title: "开始部署",
				duration: 0,
			});
			const replyMessage = ipcRenderer.sendSync("deploy_all");
			if (replyMessage === "deploySuccess") {
				this.$notify({
					title: "部署成功",
					duration: 0,
				});
				console.log(replyMessage);
			}
		},
	},
};
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

.handle-bar .el-icon-arrow-down:hover {
	color: #ffffff;
}

.handle-bar .el-icon-setting:hover {
	color: #ffffff;
}
.handle-bar .el-icon-minus:hover {
	color: #ffffff;
}
.handle-bar .el-icon-close:hover {
	color: #f50e0e;
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
	list-style-type: ">>";
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

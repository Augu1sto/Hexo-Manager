<template>
	<el-container id="editor-page">
		<div class="fake-title-bar">
			{{ require("path").basename(file_path)
			}}<span v-if="!isSaved" style="color: orangered"> *</span>
			<div class="handle-bar">
				<!-- 如果是windows系统 就加上模拟的操作按钮-->
				<i class="el-icon-minus" @click="minimizeWindow"></i>
				<i
					v-if="!isMaximize"
					class="el-icon-max"
					@click="maximizeWindow"
					>&#8414;</i
				>
				<i
					v-else
					class="el-icon-copy-document"
					@click="maximizeWindow"
				></i>
				<i class="el-icon-close" @click="preCloseWindow"></i>
				<!-- <i class="el-icon-minus"></i>
				<i class="el-icon-close"></i> -->
			</div>
		</div>
		<el-header>
			<div class="title">
				<div class="title-show" v-if="!titleEditable">
					<div class="title-text">
						{{ title }}
					</div>
					<div
						class="icon el-icon-edit"
						@click="titleEditable = !titleEditable"
					></div>
				</div>
				<div class="title-edit" v-else>
					<el-input v-model="title"></el-input>
					<div
						class="icon el-icon-check"
						@click="
							titleEditable = !titleEditable;
							isSaved = false;
						"
					></div>
				</div>
			</div>
			<div class="btn-area">
				<el-tooltip
					class="item"
					effect="dark"
					content="保存"
					placement="bottom"
				>
					<el-button
						icon="el-icon-finished"
						@click="saveText"
					></el-button>
				</el-tooltip>
				<el-tooltip
					class="item"
					effect="dark"
					content="打开"
					placement="bottom"
				>
					<el-button
						icon="el-icon-folder-opened"
						@click="openFile"
					></el-button>
				</el-tooltip>
				<el-tooltip
					class="item"
					effect="dark"
					content="新建"
					placement="bottom"
				>
					<el-button
						icon="el-icon-document-add"
						@click="openNew"
					></el-button>
				</el-tooltip>
				<!-- <el-tooltip
					class="item"
					effect="dark"
					content="删除"
					placement="bottom"
				>
					<el-button icon="el-icon-edit-outline"></el-button>
				</el-tooltip> -->
			</div>
		</el-header>
		<el-container>
			<el-aside width="200px" class="file_list">Aside</el-aside>
			<el-container>
				<el-main class="editor">
					<textarea
						class="text-area"
						:value="input"
						@input="update"
					></textarea>
					<div class="html-area" v-html="compiledMarkdown"></div>
				</el-main>
				<el-footer>
					<div class="categories">
						<span>分类：</span>
						<el-autocomplete
							class="inline-input"
							v-model="categories"
							placement="top"
							:fetch-suggestions="queryCategories"
							placeholder="文章分类"
							@select="handleSelect1"
							@change="isSaved = false"
						></el-autocomplete>
					</div>
					<div class="tags">
						<el-autocomplete
							class="inline-input"
							v-model="tag"
							placement="top-start"
							prefix-icon="el-icon-price-tag"
							:fetch-suggestions="queryTags"
							placeholder="添加标签"
							:select-when-unmatched="true"
							@select="handleSelect2"
							:style="`--input-width:` + tag.length + `em`"
						></el-autocomplete>
						<span
							class="tag"
							v-for="(tag, index) in tags"
							:key="index"
							@click="removeTag(index)"
							>{{ tag }}
							<span class="remove-tag el-icon-close"></span>
						</span>
					</div>
				</el-footer>
			</el-container>
		</el-container>
	</el-container>
</template>

<script>
import { marked } from "marked";
import * as DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { ipcRenderer } from "electron";
import { electron } from "process";

let _ = require("lodash");
marked.setOptions({
	renderer: new marked.Renderer(),
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: false,
	smartLists: true,
	smartypants: false,
	highlight: function (code) {
		return hljs.highlightAuto(code).value;
	},
});

export default {
	name: "editor-page",
	data() {
		return {
			file_path: "",
			input: "",
			title: "",
			date: "",
			categories: "",
			tags: [],
			tag: "",
			// controls
			titleEditable: false,
			isMaximize: false,
			// 分类和标签推荐列表
			categorie_rec: [],
			tag_rec: [],
			// 修改后是否保存
			isSaved: true,
		};
	},
	created() {
		// 主进程传入参数文件路径
		ipcRenderer.once("data", (e, path, categorie_rec, tag_rec) => {
			// todo，通过path读取文件
			console.log(path);
			this.file_path = path;
			function convertList(li) {
				let res = [];
				li.forEach((element) => {
					res.push({ value: element });
				});
				return res;
			}
			this.categorie_rec = convertList(categorie_rec);
			console.log(categorie_rec);
			this.tag_rec = convertList(tag_rec);
			this.readText(path);
			// this.input = this.readText(path)
		});
	},
	mounted() {
		ipcRenderer.on("winMax", (_, status) => {
			this.isMaximize = status;
		});
		document.onkeydown = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "s") {
				//  执行save方法
				this.saveText();
				// 阻止默认事件
				e.preventDefault();
			}
		};
	},
	computed: {
		compiledMarkdown: function () {
			let clean = DOMPurify.sanitize(this.input);
			return marked(clean);
		},
	},
	methods: {
		minimizeWindow() {
			const { ipcRenderer } = require("electron");
			ipcRenderer.send("minimize_w");
		},
		maximizeWindow() {
			const { ipcRenderer } = require("electron");
			ipcRenderer.send("maximize_w");
		},
		closeWindow() {
			const { ipcRenderer } = require("electron");
			ipcRenderer.send("close_w");
		},
		update: _.debounce(function (e) {
			this.input = e.target.value;
			this.isSaved = false;
		}, 300),

		readText: function (file) {
			const fs = require("fs");
			let raw = fs.readFileSync(file, "utf8");
			this.extractInfo(raw);
			// return fs.readFileSync(file, 'utf8')
		},
		extractInfo: function (raw) {
			console.log(raw);
			let tmp = raw.split("---");
			let yml = tmp[1];
			let text = tmp.splice(2).join("---");
			this.input = text;
			// yaml2json
			const yaml = require("js-yaml");
			let brief_info = yaml.load(yml);
			this.title = brief_info.title;
			this.date = brief_info.date;
			this.tags = brief_info.tags;
			console.log(brief_info.categories);
			if (
				brief_info.categories &&
				typeof brief_info.categories !== "string"
			) {
				this.categories = brief_info.categories[0];
			} else {
				this.categories = brief_info.categories;
			}
		},
		// 保存文本内容到文件
		saveText: function () {
			// 拼接文件
			let brief_info = {
				title: this.title,
				date: this.date,
				tags: this.tags,
				categories: this.categories,
			};
			const yaml = require("js-yaml");
			let text = "---\n" + yaml.dump(brief_info) + "---\n" + this.input;
			const fs = require("fs");
			fs.writeFile(this.file_path, text, (err) => {
				if (err) {
					// 保存失败
					this.$notify({
						title: "保存提示",
						message: "保存失败，请重试",
					});
				} else {
					// 保存成功
					this.$notify({
						title: "保存提示",
						message: "保存成功",
					});
					this.isSaved = true;
				}
			});
		},
		openFile: function () {
			const { ipcRenderer } = require("electron");
			ipcRenderer.send("open_file"); // 用自研编辑器打开
		},

		openNew: function () {
			this.$prompt("请输入文章名", "新建文章", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
			})
				.then(({ value }) => {
					const slugize = require("hexo-util");
					const fname = slugize(value);
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
						message: "取消输入",
					});
				});
		},
		// 输入建议
		queryCategories: function (queryString, cb) {
			var categorie_rec = this.categorie_rec;
			var results = queryString
				? categorie_rec.filter(this.createFilter(queryString))
				: categorie_rec;
			// 调用 callback 返回建议列表的数据
			cb(results);
		},
		queryTags: function (queryString, cb) {
			var tag_rec = this.tag_rec;
			var results = queryString
				? tag_rec.filter(this.createFilter(queryString))
				: tag_rec;
			// 调用 callback 返回建议列表的数据
			cb(results);
		},
		createFilter: function (queryString) {
			return (item) => {
				return item.value
					.toUpperCase()
					.match(queryString.toUpperCase());
			};
		},
		handleSelect1: function (item) {
			console.log(item);
			this.isSaved = false;
		},
		handleSelect2: function (item) {
			console.log(item);
			console.log(this.tags);
			if (this.tags === null) {
				this.tags = [];
			}
			console.log(this.tags);
			this.tags.unshift(item.value);
			this.tag = "";
			this.isSaved = false;
		},
		// 去除标签
		removeTag: function (index) {
			this.tags.splice(index, 1);
			this.isSaved = false;
		},
		// 先保存后退出
		async preCloseWindow() {
			if (!this.isSaved) {
				await this.askToSave();
			}
			this.closeWindow();
		},
		askToSave: function () {
			return new Promise((resolve, reject) => {
				this.$confirm("文件尚未保存, 是否保存文件?", "提示", {
					confirmButtonText: "保存",
					cancelButtonText: "取消",
					type: "warning",
				})
					.then(() => {
						this.saveText();
						resolve();
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消保存",
						});
						resolve();
					});
			});
		},
	},
};
</script>

<style>
/* customize icon */
.handle-bar .el-icon-max {
	width: 16px;
}

.handle-bar .el-icon-max:hover {
	color: #ffffff;
}

#editor-page .handle-bar .el-icon-copy-document {
	transform: rotate(180deg);
}
.el-icon-copy-document:hover {
	color: #ffffff;
}

/* header */
#editor-page .el-header {
	display: flex;
	flex-wrap: nowrap;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-top: 30px;
}

#editor-page .title {
	flex: auto;
	width: calc(100% - 300px);
}

#editor-page .title-show,
#editor-page .title-edit {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
}

#editor-page .title-text {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

#editor-page .btn-area {
	/* flex-basis: 2;
  flex-shrink: 1; */
	width: 250px;
	flex: none;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: flex-end;
	align-content: center;
}

#editor-page .title .icon {
	font-size: 1.2em;
	color: rgba(255, 255, 255, 0.7);
	cursor: pointer;
	width: 30px;
}

#editor-page .title .icon:hover {
	color: rgba(255, 255, 255);
}

#editor-page .title-show {
	color: white;
	font-size: 1.5em;
	font-weight: bold;
}

#editor-page .title-edit .el-input {
	max-width: 100%;
	width: auto;
	font-size: 1.4em;
}

#editor-page .btn-area .el-button {
	min-width: auto;
	font-size: 1.1em;
	padding: 12px;
}

.file_list {
	margin-left: -200px;
}

.editor.el-main {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	box-sizing: border-box;
	gap: 20px;
	width: 100%;
	height: calc(100vh - 180px);
	justify-content: space-between;
	align-content: flex-start;
	background-color: #4661ef;
}

.text-area {
	border: 1px solid rgb(216, 216, 216);
	border-radius: 20px;
	resize: none;
	outline: none;
	background-color: #ffffff;
	font-size: 16px;
	color: rgb(12, 107, 98);
	font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
		"Microsoft YaHei", "微软雅黑", Arial, sans-serif;
	padding: 20px;
	height: 90%;
	flex: 1;
	min-width: 200px;
}

.html-area {
	background-color: #f6f6f6;
	flex: 1;
	min-width: 200px;
	height: 90%;
	text-align: left;
	padding: 20px;
	line-height: 1em;
	overflow-y: scroll;
	overflow-x: hidden;
	border-radius: 20px;
}

.html-area h1 {
	font-size: 2em;
}

.html-area * {
	/* word-wrap: break-word; */
	white-space: pre-wrap;
	/* word-break: keep-all; */
}

/* 滚动条样式 */
::-webkit-scrollbar {
	width: 20px;
}

::-webkit-scrollbar-thumb {
	border-radius: 12px;
	border: 6px solid rgba(0, 0, 0, 0);
	box-shadow: 8px 0 0 rgba(255, 255, 255, 0.2) inset;
}
/* https://www.cnblogs.com/that-is-ok/p/10757282.html */

::-webkit-scrollbar-thumb:hover {
	box-shadow: 8px 0 0 rgba(255, 255, 255, 0.5) inset;
}

.editor.el-main *::-webkit-scrollbar {
	width: 22px;
}
.editor.el-main *::-webkit-scrollbar-thumb {
	border-radius: 16px;
	border: 8px solid rgba(0, 0, 0, 0);
	box-shadow: 6px 0 0 rgba(70, 98, 239, 0.1) inset;
}

.editor.el-main *::-webkit-scrollbar-thumb:hover {
	box-shadow: 6px 0 0 rgba(70, 98, 239, 0.2) inset;
}

/* footer */
#editor-page .el-footer {
	font-size: 0.8em;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	gap: 10px;
}

#editor-page .el-footer .categories {
	flex: none;
}
#editor-page .el-footer .categories > span {
	color: rgb(203, 203, 203);
	font-weight: bold;
}

#editor-page .el-footer .categories .el-input__inner {
	font-size: 1em;
	line-height: 2em;
	height: 2em;
	max-width: 10em;
	text-overflow: ellipsis;
	background-color: transparent;
	color: rgb(216, 216, 216);
	border-color: transparent;
}

#editor-page .el-footer .categories .el-input__inner:hover {
	background-color: rgba(255, 255, 255, 0.2);
}

#editor-page .el-footer .categories .el-input__inner:focus {
	background-color: #fff;
	color: #606266;
}

#editor-page .el-footer .tags {
	flex: auto;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 5px;
	justify-content: flex-end;
	align-items: center;
	height: 100%;
}

#editor-page .el-footer .tags .el-input__inner {
	font-size: 1em;
	line-height: 1.5em;
	height: 1.5em;
	/* fit-content无效 */
	/* 因为文本存在全半角的差异，所以这种计算方法只能近似一下 */
	width: calc(var(--input-width) / 2 + 3em);
	padding-right: 0;
	min-width: 7.5em;
	background-color: rgba(0, 0, 0, 0.3);
	color: rgb(216, 216, 216);
	border-color: transparent;
}

#editor-page .el-footer .tags .el-input__inner:hover {
	background-color: rgba(196, 196, 196, 0.3);
}

#editor-page .el-footer .tags .el-input__icon {
	line-height: 1em;
}

#editor-page .el-footer .tags .tag {
	background: rgb(255, 255, 255);
	padding: 1px 2px 1px 12px;
	color: #4661ef;
	border-radius: 10px;
	cursor: pointer;
	white-space: nowrap;
}

#editor-page .el-footer .tags .tag:hover {
	background: rgba(255, 255, 255, 0.5);
}

#editor-page .el-footer .tags .tag:hover > .remove-tag {
	color: orangered;
}
</style>

# Hexo-Manager

![banner](https://user-images.githubusercontent.com/38211047/156713434-b510eced-19e8-432d-8105-04e2f0455aaa.png)

> Hexo-Manager是一个Windows平台的针对Hexo博客进行可视化管理的软件

## 运行环境
Windows

## 下载、安装和配置
到[release](https://github.com/Augu1sto/Hexo-Manager/releases)页面里下载setup文件，双击安装
点击右上角的设置按钮，对于你的Hexo根目录进行配置，例如 `C:\\hexoBlog`
选择是用内置编辑器编辑或者系统默认编辑器编辑文件

## 1.0.0-beta

### 开发环境
- Electron-Vue框架
- NodeJS: v16.8.0

### 主要功能
- [x] 点击“打开”，选择文件
- [x] 点击“新建”，输入文章名称，新建hexo文章，并打开
- [x] 点击“一键部署”，执行 `hexo cl&&hexo g -d`。生成站点文件并推送至远程库。
- [x] 左侧显示3个最近编辑的文件
- [x] 日志记录，记录一些主要操作和抛出的错误
- [x] 点击右上角的下拉菜单可以打开用户数据目录，从中找到日志文件和设置文件
- [x] 配置内置编辑器，用`marked.js`进行简单的实时渲染。编辑器内可对文章标题、分类和标签元数据进行可视化修改。编辑器支持`ctrl+s`快捷键保存

## 待开发功能
- [ ] git拉取与上传
- [ ] 更复杂的配置
  - [ ] git配置
  - [x] 编辑器
    - [ ] 根据分类构建文件树
    - [x] 添加标签
  - [ ] hexo各项的基础配置的可视化
- [ ] hexo插件管理
- [ ] ...

## 开发文档
https://augu1sto.gitee.io/categories/Electron-vue%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/

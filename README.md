该分支的编辑器是用textarea+marked自己实现的
采用vue的input实现实时渲染
可能日后会继续开发


---

# Hexo-Manager

![banner](https://user-images.githubusercontent.com/38211047/156713434-b510eced-19e8-432d-8105-04e2f0455aaa.png)

> Hexo-Manager是一个Windows平台的针对Hexo博客进行可视化管理的软件

## 运行环境
Windows

## 下载、安装和配置
到[release](https://github.com/Augu1sto/Hexo-Manager/releases)页面里下载setup文件，双击安装
点击右上角的设置按钮，对于你的Hexo根目录进行配置，例如 `C:\\hexoBlog`
![image](https://user-images.githubusercontent.com/38211047/156712420-b50ca04f-00bb-4265-847d-577109c24391.png)

## 0.0.1-alpha
### 开发环境
- Electron-Vue框架
- NodeJS: v16.8.0

### 主要功能
- [x] 点击“打开”，选择文件，用系统默认的编辑器打开
- [x] 点击“新建”，输入文章名称，新建hexo文章，并用系统默认的编辑器打开
- [x] 点击“一键部署”，执行 hexo clean && hexo deploy。生成站点文件并推送至远程库。

### 可能存在的问题
- [ ] 未进行错误处理和异常处理以及日志输出
会在接下来的版本里继续研发，请试用的朋友一定 **先配置根目录** ，也欢迎为本项目添砖加瓦

## 待开发功能
- [ ] 代码重构
- [ ] 错误处理和日志记录
- [ ] git拉取与上传
- [ ] 更复杂的配置
  - [ ] git配置
  - [ ] 编辑器
    - [x] 实时渲染
    - [ ] 根据分类构建文件树
    - [ ] 添加标签
  - [ ] hexo各项的基础配置的可视化
- [ ] 优化新建功能
  - [ ] 可以选择标签、分类
- [ ] 入口界面添加“最近文件”功能
- [ ] hexo插件管理
- [ ] ...

## 开发文档
https://augu1sto.gitee.io/categories/Electron-vue%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/


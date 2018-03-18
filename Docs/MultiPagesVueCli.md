# Vue-cli多页面应用的配置修改
因为Vue-cli默认是构建单页面应用，因此需要做一些修改。  
webpack的配置修改直接看`webpack.config.js`中的注释

## Multi-entries
* [文档](https://webpack.js.org/concepts/entry-points/#multi-page-application)
* `./src/pages`内部的每个文件夹都会被认为是一个页面组件，内部应该都有一个`main.js`作
为入口文件。

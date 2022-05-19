# webpack5总结
1. 在使用5的时候遇到了什么难题，都是怎么解决的
> loader 和 plugin 不兼容5的问题，一般是通过google、issue查找有无解决方案，再其次去找替代品，最后找不到就根据需求自己手写。

2. 为什么自己搭建，而不是使用creact-react-app
> 为了后期更好的扩展和更细粒化的配置，不用考虑太多的包袱，（例如esbuild0依赖），使用其他脚手架就避免不了一些你没用到的冗余的配置

3. webpack优化
> **运行时优化**
> - 基础库分离 SplitChunksPlugin 
> - 动态导入 import ... .then()  //@babel/plugin-syntax-dynamic-import
> - 小资源内联，防止页面闪动
> - postcss 做css兼容
> - tree sharking scope hoisting（减少函数声明代码和内存开销） production模式下自己自动开启
> - 多页面打包，做SEO优化
> - SSR seo 优化
> 
**打包时优化**
> - thread-loader多进程打包
> - [TerserPlugin](https://webpack.docschina.org/plugins/terser-webpack-plugin) production默认开启
> - DLL，先将基础库提前打包加快bulid速度
> - externals，比 dll 更有效的提速方案
> - babel-loader缓存
> - 减少构建目标
> - image-webpack-loader 图片压缩
> - purgecss-webpack-plugin  tree shaking css
> - 动态polyfill babel-plugin-transform-runtime，缺点：无法使用原型方法 | polyfill server 识别 User Agent，下发不同的 Polyfill
> - 文件指纹


4. webpack5 比 4 的优点 
- 通过持久化硬盘缓存能力来提升构建性能
- 通过更好的算法来改进长期缓存（降低产物资源的缓存失效率。原来是ID标识，现在用hash）
- 通过更好的 Tree Shaking 能力和代码的生成逻辑来优化产物的大小  （支持深层嵌套的 export 的 Tree Shaking）
- 模块联邦
   - 按需，可以把一个包拆开来加载其中一部分,
   - 运行时，跑在浏览器而非 node 编译时；
   - js应用之间可以进行一些资源的共享，很适合做微前端 例如EMP
- 内置静态资源构建能力-Asset Modules
- 拓展了WebAssembly 的异步加载能力
- 内置 Web Worker，但是功能 不如webwork-loader 有点坑...
- 移除nodejs polyfill 例如path process 需要自己polyfill
- 支持 Top Level Await。即允许开发者在 async 函数外部使用 await 字段，需要装@babel/plugin-syntax-top-level-await 让babel去支持

**代码质量**

- 测试
   - 冒烟测试
   - 单元测试
   - 测试覆盖率
- eslint
- ci
- changelog 文档 [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)
- husky
   - lint-staged -> prettier
   - commitlint

更多详情见本系列文章

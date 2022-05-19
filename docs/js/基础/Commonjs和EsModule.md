# Commonjs 和 EsModule
## 先上结论

## Commonjs

1. 运行时编译
1. 可以修改导入的值，导入实际上是复制值，并没有引用关系
1. 可以动态导入，通过缓存的形式解决了循环引用、重复加载问题
1. CommonJs 是单个值导出，本质上导出的就是 exports 属性。
1. 执行顺序为父->子->父
1. `exports` 和 `module.exports`都是同一个引用后者优先级最高，exports={/.../}的形式会重写 commonjs 的包装函数，导出无效

## ES Moudule

1. 静态编译，ES2020 支持了动态导入
1. 不可以修改导入的值，因为导入传递的是引用
1. ES6 Module 可以导出多个属性和方法，可以单个导入导出，混合导入导出
1. 可以按需导入，全部导出、重命名导出、重定向导出、只运行模块
1. 借助静态导入导出，实现了`tree shaking`,使用`import()`懒加载方式实现代码分割,
1. 循环引用问题
1. 执行顺序为子->父

# Commonjs

目前 commonjs 广泛应用于以下几个场景：

- Node 是 CommonJS 在服务器端一个具有代表性的实现；
- Browserify 是 CommonJS 在浏览器中的一种实现；
- webpack 打包工具对 CommonJS 的支持和转换；也就是前端应用也可以在编译之前，尽情使用 CommonJS 进行开发。

## commonjs 实现原理

```javascript
function wrapper(script) {
  return (
    '(function (exports, require, module, __filename, __dirname) {' +
    script +
    '\n})'
  )
}
```

## commonjs 查找机制

- 在当前目录下的 node_modules 目录查找。
- 如果没有，在父级目录的 node_modules 查找，如果没有在父级目录的父级目录的 node_modules 中查找。
- 沿着路径向上递归，直到根目录下的 node_modules 目录。
- 在查找过程中，会找 package.json 下 main 属性指向的文件，如果没有 package.json ，在 node 环境下会以此查找 index.js ，index.json ，index.node。

## commonjs 引入与处理

CommonJS 模块同步加载并执行模块文件，CommonJS 模块在执行阶段分析模块依赖，采用**深度优先遍历**（depth-first traversal），执行顺序是父 -> 子 -> 父；

## require 加载原理

```javascript
 // id 为路径标识符
function require(id) {
   /* 查找  Module 上有没有已经加载的 js  对象*/
   const  cachedModule = Module._cache[id]

   /* 如果已经加载了那么直接取走缓存的 exports 对象  */
  if(cachedModule){
    return cachedModule.exports
  }

  /* 创建当前模块的 module  */
  const module = { exports: {} ,loaded: false , ...}

  /* 将 module 缓存到  Module 的缓存属性中，路径标识符作为 id */
  Module._cache[id] = module
  /* 加载文件 */
  runInThisContext(wrapper('module.exports = "123"'))(module.exports, require, module, __filename, __dirname)
  /* 加载完成 *//
  module.loaded = true
  /* 返回值 */
  return module.exports
}
```

从上面我们总结出一次 require 大致流程是这样的；

- require 会接收一个参数——文件标识符，然后分析定位文件，分析过程我们上述已经讲到了，加下来会从 Module 上查找有没有缓存，如果有缓存，那么直接返回缓存的内容。
- 如果没有缓存，会创建一个 module 对象，缓存到 Module 上，然后执行文件，加载完文件，将 loaded 属性设置为 true ，然后返回 module.exports 对象。借此完成模块加载流程。
- 模块导出就是 return 这个变量的其实跟 a = b 赋值一样， 基本类型导出的是值， 引用类型导出的是引用地址。
- exports 和 module.exports 持有相同引用，因为最后导出的是 module.exports， 所以对 exports 进行赋值会导致 exports 操作的不再是 module.exports 的引用。

因为缓存机制解决了**重复加载和循环引用**的问题

## require 加载机制

1. 计算模块绝对路径；
1. 如果缓存中有该模块，则从缓存中取出该模块；
1. 按优先级依次寻找并编译执行模块，将模块推入缓存（require.cache）中；
1. 输出模块的 exports 属性；

## exports 和 module.exports

通常使用`exports.a='xxx'` `module.exports={}`的形式导出<br />`exports={}`不能作为导出的方式，因为 `commonjs`外部有个`wrapper`包装函数，`exports={}`相当于重写了形参的 exports，就与外界断绝了关系

**既然有了 exports，为何又出了 module.exports ?**

> exports 和 module.exports 持有相同引用，因为最后导出的是 module.exports ，所以在一个文件中最好只使用一种，如果同时存在，会存在覆盖的问题。

`exports`用来导出对象，使用`module.exports`可以导出除对象外的其他类型元素

但是因此出现了一个问题

module.exports 当导出一些函数等非对象属性的时候，也有一些风险，就比如循环引用的情况下。对象会保留相同的内存地址，就算一些属性是后绑定的，也能间接通过异步形式访问到。但是如果 module.exports 为一个非对象其他属性类型，在循环引用的时候，就容易造成属性丢失的情况发生了。

# ES Module

## Es Module 引入与处理

与 Common.js 不同的是 ，CommonJS 模块同步加载并执行模块文件，ES6 模块提前加载并执行模块文件，ES6 模块在预处理阶段分析模块依赖，在执行阶段执行模块，两个阶段都采用深度优先遍历，执行顺序是子 -> 父。

# 参考

[深入浅出 Commonjs 和 Es Module](https://juejin.cn/post/6994224541312483336)

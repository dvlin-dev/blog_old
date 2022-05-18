## 回调函数时代

相信很多 nodejs 的初学者都或多或少踩过这样的坑，node 中很多原生的 api 就是诸如这样的:

```javascript
fs.readFile('xxx', (err, data) => {})
```

典型的高阶函数，将回调函数作为函数参数传给了 readFile。但久而久之，就会发现，这种传入回调的方式也存在大坑, 比如下面这样:

```javascript
fs.readFile('1.json', (err, data) => {
  fs.readFile('2.json', (err, data) => {
    fs.readFile('3.json', (err, data) => {
      fs.readFile('4.json', (err, data) => {})
    })
  })
})
```

回调当中嵌套回调，也称`回调地狱`。这种代码的可读性和可维护性都是非常差的，因为嵌套的层级太多。而且还有一个严重的问题，就是每次任务可能会失败，需要在回调里面对每个任务的失败情况进行处理，增加了代码的混乱程度。

## Promise 时代

ES6 中新增的 Promise 就很好了解决了`回调地狱`的问题，同时了合并了错误处理。写出来的代码类似于下面这样:

```javascript
readFilePromise('1.json')
  .then((data) => {
    return readFilePromise('2.json')
  })
  .then((data) => {
    return readFilePromise('3.json')
  })
  .then((data) => {
    return readFilePromise('4.json')
  })
```

以链式调用的方式避免了大量的嵌套，也符合人的线性思维方式，大大方便了异步编程。

## co + Generator 方式

利用协程完成 Generator 函数，用 co 库让代码依次执行完，同时以同步的方式书写，也让异步操作按顺序执行。

```javascript
co(function* () {
  const r1 = yield readFilePromise('1.json')
  const r2 = yield readFilePromise('2.json')
  const r3 = yield readFilePromise('3.json')
  const r4 = yield readFilePromise('4.json')
}).then((res, rej) => {})
```

## async + await 方式

这是 ES7 中新增的关键字，凡是加上 async 的函数都默认返回一个 Promise 对象，而更重要的是 async + await 也能让异步代码以同步的方式来书写，而不需要借助第三方库的支持。

```javascript
const readFileAsync = async function () {
  const f1 = await readFilePromise('1.json')
  const f2 = await readFilePromise('2.json')
  const f3 = await readFilePromise('3.json')
  const f4 = await readFilePromise('4.json')
}
```

这四种经典的异步编程方式就简单回顾完了，由于是鸟瞰大局，我觉得`知道是什么`比`了解细节`要重要, 因此也没有展开。不过没关系，接下来，让我们针对这些具体的解决方案，一步步深入异步编程，理解其中的本质。

# 参考文章

[三元博客](https://sanyuan0704.top/)

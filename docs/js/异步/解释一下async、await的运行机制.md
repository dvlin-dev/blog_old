`async/await`被称为 JS 中**异步终极解决方案**。它既能够像 co + Generator 一样用同步的方式来书写异步代码，又得到底层的语法支持，无需借助任何第三方库。接下来，我们从原理的角度来重新审视这个语法糖背后究竟做了些什么。

## async

什么是 async ?

> MDN 的定义: async 是一个通过异步执行并隐式返回 Promise 作为结果的函数。

注意重点: **返回结果为 Promise**。

举个例子:

```javascript
async function func() {
  return 100
}
console.log(func())
// Promise {<resolved>: 100}
```

这就是隐式返回 Promise 的效果。

## await

我们来看看 `await`做了些什么事情。

以一段代码为例:

```javascript
async function test() {
  console.log(100)
  let x = await 200
  console.log(x)
  console.log(200)
}
console.log(0)
test()
console.log(300)
```

我们来分析一下这段程序。首先代码同步执行，打印出`0`，然后将`test`压入执行栈，打印出`100`, 下面注意了，遇到了关键角色**await**。

放个慢镜头:

```javascript
await 200
```

被 JS 引擎转换成一个 Promise :

```javascript
let promise = new Promise((resolve, reject) => {
  resolve(200)
})
```

这里调用了 resolve，resolve 的任务进入微任务队列。

然后，JS 引擎将暂停当前协程的运行，把线程的执行权交给`父协程`<br />回到父协程中，父协程的第一件事情就是对`await`返回的`Promise`调用`then`, 来监听这个 Promise 的状态改变 。

```javascript
promise.then((value) => {
  // 相关逻辑，在resolve 执行之后来调用
})
```

然后往下执行，打印出`300`。

根据`EventLoop`机制，当前主线程的宏任务完成，现在检查`微任务队列`, 发现还有一个 Promise 的 resolve，执行，现在父协程在`then`中传入的回调执行。我们来看看这个回调具体做的是什么。

```javascript
promise.then((value) => {
  // 1. 将线程的执行权交给test协程
  // 2. 把 value 值传递给 test 协程
})
```

Ok, 现在执行权到了`test协程`手上，test 接收到`父协程`传来的**200**, 赋值给 a ,然后依次执行后面的语句，打印`200`、`200`。

最后的输出为:

```javascript
0
100
300
200
200
```

总结一下，`async/await`利用`协程`和`Promise`实现了同步方式编写异步代码的效果，其中`Generator`是对`协程`的一种实现，虽然语法简单，但引擎在背后做了大量的工作，我们也对这些工作做了一一的拆解。用`async/await`写出的代码也更加优雅、美观，相比于之前的`Promise`不断调用 then 的方式，语义化更加明显，相比于`co + Generator`性能更高，上手成本也更低，不愧是 JS 异步终极解决方案！

# event loop plus

```javascript
async function foo() {
  console.log('foo')
}
async function bar() {
  console.log('bar start')
  await foo()
  console.log('bar end')
}
console.log('script start')
setTimeout(function () {
  console.log('setTimeout')
}, 0)
bar()
new Promise(function (resolve) {
  console.log('promise executor')
  resolve()
}).then(function () {
  console.log('promise then')
})
console.log('script end')
```

```javascript
script start
bar start
foo
promise executor
script end
bar end
promise then
setTimeout
```

## 实现 Promise.all

对于 all 方法而言，需要完成下面的核心功能:

1. 传入参数为一个空的可迭代对象，则`直接进行resolve`。
1. 如果参数中`有一个`promise 失败，那么 Promise.all 返回的 promise 对象失败。
1. 在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个`数组`

具体实现如下:

```javascript
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let result = []
    let len = promises.length
    if (len === 0) {
      resolve(result)
      return
    }
    const handleData = (data, index) => {
      result[index] = data
      // 最后一个 promise 执行完
      if (index == len - 1) resolve(result)
    }
    for (let i = 0; i < len; i++) {
      // 为什么不直接 promise[i].then, 因为promise[i]可能不是一个promise
      Promise.resolve(promise[i])
        .then((data) => {
          handleData(data, i)
        })
        .catch((err) => {
          reject(err)
        })
    }
  })
}
```

## 实现 Promise.race

race 的实现相比之下就简单一些，只要有一个 promise 执行完，直接 resolve 并停止执行。

```javascript
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    let len = promises.length
    if (len === 0) return
    for (let i = 0; i < len; i++) {
      Promise.resolve(promise[i])
        .then((data) => {
          resolve(data)
          return
        })
        .catch((err) => {
          reject(err)
          return
        })
    }
  })
}
```

到此为止，一个完整的 Promise 就被我们实现完啦。

# 参考文章

[三元博客](https://sanyuan0704.top/)

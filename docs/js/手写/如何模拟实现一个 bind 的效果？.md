实现 bind 之前，我们首先要知道它做了哪些事情。

1.  对于普通函数，绑定 this 指向
1.  对于构造函数，要保证原函数的原型对象上的属性不能丢失

```javascript
Function.prototype.mybind = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new Error(
      'Function.prototype.bind - what is trying to be bound is not callable'
    )
  }
  let self = this

  let FB = function () {
    self.apply(
      //当为普通函数的时候 this 指向window，self指向绑定函数 为 false，this为绑定的实例对象
      //当为构造函数的时候 this 指向实例，self指向绑定函数 为 true，this为new出来的实例对象
      this instanceof self ? this : context,
      args.concat(Array.prototype.slice.call(arguments))
    )
  }
  FB.prototype = Object.create(this.prototype)
  return FB
}
```

# 参考文章

[JavaScript 深入之 bind 的模拟实现](https://juejin.cn/post/6844903476623835149)

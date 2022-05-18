`new`被调用后做了三件事情:

1. 让实例可以访问到私有属性
1. 让实例可以访问构造函数原型(constructor.prototype)所在原型链上的属性
1. 如果构造函数返回的结果不是引用数据类型，那么`new`表达式中的函数调用会自动返回这个新的对象。

```javascript
function newFactory(ctor, ...args) {
  if (typeof ctor !== 'function') {
    throw 'newOperator function the first param must be a function'
  }

  let obj = new Object()
  obj.__proto__ = Object.create(ctor.prototype)
  let res = ctor.apply(obj, args)

  let isObject = typeof res === 'object' && typeof res !== null
  let isFunction = typeof res === 'function'
  return isObject || isFunction ? res : obj
}
```

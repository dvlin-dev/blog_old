使用 ES6

```javascript
Function.prototype.call2 = function (context, ...args) {
  /// ...args 把剩余的参数都放到数组里面
  var context = context || window
  const fn = Symbol()
  context.fn = this
  let result = context.fn(...args)
  delete context.fn
  return result
}
```

```javascript
Function.prototype.apply2 = function (context, arr) {
  context = context || window
  const fn = Symbol()
  context.fn = this
  let result = context.fn(...arr)
  delete context.fn
  return result
}
```

不使用 ES6

```javascript
Function.prototype.call2 = function (context) {
  context = context || window
  context.fn = this
  let args = []
  for (let i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']')
  }
  //这里使用eval，args 会自动调用 Array.toString() 这个方法。
  let result = eval('context.fn(' + args + ')')
  delete context.fn
  return result
}
```

```javascript
Function.prototype.apply2 = function (context, arr) {
  context = context || window
  context.fn = this
  let result
  if (!arr) {
    result = context.fn()
  } else {
    let args = []
    for (let i = 0, len = arr.length; i < len; i++) {
      args.push('arr[' + i + ']')
    }
    result = eval('context.fn(' + args + ')')
  }

  delete context.fn
  return result
}
```

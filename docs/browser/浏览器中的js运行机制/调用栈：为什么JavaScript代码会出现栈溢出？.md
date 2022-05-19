# 调用栈：为什么JavaScript代码会出现栈溢出？

- 每调用一个函数，JavaScript 引擎会为其创建执行上下文，并把该执行上下文压入调用栈，然后 JavaScript 引擎开始执行函数代码。
- 如果在一个函数 A 中调用了另外一个函数 B，那么 JavaScript 引擎会为 B 函数创建执行上下文，并将 B 函数的执行上下文压入栈顶。
- 当前函数执行完毕后，JavaScript 引擎会将该函数的执行上下文弹出栈。
- 当分配的调用栈空间被占满时，会引发“堆栈溢出”问题。

**问题**
```javascript
function runStack (n) {
  if (n === 0) return 100;
  return runStack( n- 2);
}
runStack(50000)
```
这是一段递归代码，可以通过传入参数 n，让代码递归执行 n 次，也就意味着调用栈的深度能达到 n，当输入一个较大的数时，比如 50000，就会出现栈溢出的问题，那么你能优化下这段代码，以解决栈溢出的问题吗？<br />**蹦床函数**<br />[ES6函数扩展 蹦床函数](https://es6.ruanyifeng.com/#docs/function)
蹦床函数（trampoline）可以将递归执行转为循环执行。
```javascript
function runStack (n) {
  if (n === 0) return 100;
  return runStack.bind(null, n- 2); // 返回自身的一个版本
}
// 蹦床函数，避免递归
function trampoline(f) {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
}
trampoline(runStack(1000000))
```
> 也可以使用尾部优化，部分浏览器实现了

**迭代**
```javascript
function runStack (n) {
  while (n > 0) {
    n -= 2
  }
  return 100
}
runStack(50000)
```

参照 ecma262 草案的规定，关于 push 和 pop 的规范如下图所示:

![1.jpg](../assets/1646098177333-4d95e66b-8585-4691-8e6d-2b06748aa7c1.jpeg)

![2.jpg](../assets/1646098180380-ef06771a-5ae6-4404-8666-ce6f8be70774.jpeg)

首先来实现一下 push 方法:

```javascript
Array.prototype.push = function(...items) {
  let O = Object(this);
  let len = this.length >>> 0;
  let argCount = items.length >>> 0;
  // 2 ** 53 - 1 为JS能表示的最大正整数
  if (len + argCount > 2 ** 53 - 1) {
    throw new TypeError("The number of array is over the max value restricted!")
  }
  for(let i = 0; i < argCount; i++) {
    O[len + i] = items[i];
  }
  let newLength = len + argCount;
  O.length = newLength;
  return newLength;
}
```

亲测已通过MDN上所有测试用例。[MDN链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/push)

然后来实现 pop 方法:

```javascript
Array.prototype.pop = function() {
  let O = Object(this);
  let len = this.length >>> 0;
  if (len === 0) {
    O.length = 0;
    return undefined;
  }
  len --;
  let value = O[len];
  delete O[len];
  O.length = len;
  return value;
}
```

亲测已通过MDN上所有测试用例。[MDN链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)

参考链接:

[V8数组源码](https://github.com/v8/v8/blob/ad82a40509c5b5b4680d4299c8f08d6c6d31af3c/src/js/array.js)

[ecma262规范草案](https://tc39.es/ecma262)

[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)

[三元博客](https://github.com/sanyuan0704/my_blog/blob/master/blog)

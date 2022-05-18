在 forEach 中用 return 不会返回，函数会继续执行。

```javascript
let nums = [1, 2, 3]
nums.forEach((item, index) => {
  return //无效
})
```

中断方法：

1.  使用 try 监视代码块，在需要中断的地方抛出异常。
1.  官方推荐方法（替换方法）：用 every 和 some 替代 forEach 函数。every 在碰到 return false 的时候，中止循环。some 在碰到 return ture 的时候，中止循环

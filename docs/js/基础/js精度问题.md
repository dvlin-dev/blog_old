---
sidebar_position: 1
---
# 0.1 + 0.2 ！== 0.3
在两数相加时，会先转换成二进制，0.1 和 0.2 转换成二进制的时候尾数会发生无限循环，然后进行对阶运算，JS 引擎对二进制进行截断，所以造成精度丢失。

解决方案：

1. 获取加数中最多的小数位数 e，所有的加数同时放大 Math.pow(10, e) 倍，进行计算之后的结果再缩小 Math.pow(10, e) 倍
1. 可以引入ES6中的机器精度`Number.EPSILON` 判定是计算误差还是数据不同，`Number.EPSILON` 为JavaScript可以表示的最小精度2^(-52)。

```javascript
console.log( Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON) //true,则证明 0.1 + 0.2 === 0.3
```
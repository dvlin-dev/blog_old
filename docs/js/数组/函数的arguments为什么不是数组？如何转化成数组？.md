因为 argument 是一个对象，只不过它的属性从 0 开始排，依次为 0，1，2...最后还有 callee 和 length 属性。我们也把这样的对象称为类数组。

常见的类数组还有：

- 用 getElementByTagName/ClassName/Name（）获得的 HTMLCollection
- 用 querySlector 获得的 nodeList

那这导致很多数组的方法就不能用了，必要时需要我们将它们转换成数组，有哪些方法呢？

## 1. Array.prototype.slice.call()

```javascript
function sum(a, b) {
  let args = Array.prototype.slice.call(arguments)
  console.log(args.reduce((sum, cur) => sum + cur)) //args可以调用数组原生的方法啦
}
sum(1, 2) //3
```

## 2. Array.from()

```javascript
function sum(a, b) {
  let args = Array.from(arguments)
  console.log(args.reduce((sum, cur) => sum + cur)) //args可以调用数组原生的方法啦
}
sum(1, 2) //3
```

这种方法也可以用来转换 Set 和 Map 哦！

## 3. ES6 展开运算符

```javascript
function sum(a, b) {
  let args = [...arguments]
  console.log(args.reduce((sum, cur) => sum + cur)) //args可以调用数组原生的方法啦
}
sum(1, 2) //3
```

## 4. 利用 concat+apply

```javascript
function sum(a, b) {
  let args = Array.prototype.concat.apply([], arguments) //apply方法会把第二个参数展开
  console.log(args.reduce((sum, cur) => sum + cur)) //args可以调用数组原生的方法啦
}
sum(1, 2) //3
```

当然，最原始的方法就是再创建一个数组，用 for 循环把类数组的每个属性值放在里面，过于简单，就不浪费篇幅了。

## 参考文章

[三元博客](https://github.com/sanyuan0704/my_blog/blob/master/blogs/javascript/js-array/002.md)

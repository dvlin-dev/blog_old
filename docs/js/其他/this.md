其实 JS 中的 this 是一个非常简单的东西，只需要理解它的执行规则就 OK。

call/apply/bind 可以显示绑定, 这里就不说了。

主要这些场隐式绑定的场景讨论:

1. 全局上下文
1. 直接调用函数
1. 对象.方法的形式调用
1. DOM 事件绑定(特殊)
1. new 构造函数绑定
1. 箭头函数

## 1. 全局上下文

全局上下文默认 this 指向 window, 严格模式下指向 undefined。

## 2. 直接调用函数

比如:

```javascript
let obj = {
  a: function () {
    console.log(this)
  },
}
let func = obj.a
func()
```

这种情况是直接调用。this 相当于全局上下文的情况。

## 3. 对象.方法的形式调用

还是刚刚的例子，我如果这样写:

```javascript
obj.a()
```

这就是`对象.方法`的情况，this 指向这个对象

## 4. DOM 事件绑定

onclick 和 addEventerListener 中 this 默认指向绑定事件的元素。

IE 比较奇异，使用 attachEvent，里面的 this 默认指向 window。

## 5. new+构造函数

此时构造函数中的 this 指向实例对象。

## 6. 箭头函数？

箭头函数没有 this, 因此也不能绑定。里面的 this 会指向当前最近的非箭头函数的 this，找不到就是 window(严格模式是 undefined)。比如:

```javascript
let obj = {
  a: function() {
    let do = () => {
      console.log(this);
    }
    do();
  }
}
obj.a(); // 找到最近的非箭头函数a，a现在绑定着obj, 因此箭头函数中的this是obj
```

### tips:

```javascript
function demo() {}
demo.prototype.a = () => {
  console.log(this)
}
let c = new demo()
c.a() //window
```

> 优先级: new  > call、apply、bind  > 对象.方法 > 直接调用。

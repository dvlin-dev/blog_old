# this

# 全局执行上下文中的 this

首先我们来看看全局执行上下文中的 this 是什么。你可以在控制台中输入 console.log(this)来打印出来全局执行上下文中的 this，最终输出的是 window 对象。所以你可以得出这样一个结论：全局执行上下文中的 this 是指向 window 对象的。这也是 this 和作用域链的唯一交点，作用域链的最底端包含了 window 对象，全局执行上下文中的 this 也是指向 window 对象。

# 函数执行上下文中的 this

现在你已经知道全局对象中的 this 是指向 window 对象了，那么接下来，我们就来重点分析函数执行上下文中的 this。还是先看下面这段代码：

```javascript
function foo() {
  console.log(this)
}
foo() //window
```

改变 this 的指向

## call

> call 、bind 、 apply 这三个函数的第一个参数都是 this 的指向对象，
> 第二个参数差别就来了：
> call 的参数是直接放进去的，第二第三第 n 个参数全都用逗号分隔，直接放到后面 obj.myFun.call(db,'成都', ... ,'string' )。
> apply 的所有参数都必须放在一个数组里面传进去 obj.myFun.apply(db,['成都', ..., 'string' ])。
> bind 除了返回是函数以外，它 的参数和 call 一样。

```javascript
let bar = {
  myName: 'aaa',
  test1: 1,
}
function foo() {
  this.myName = 'bbb'
}
foo.call(bar)
console.log(bar)
console.log(myName)
```

foo 函数内部的 this 已经指向了 bar 对象，因为通过打印 bar 对象，可以看出 bar 的 myName 属性已经由“aaa”变为“bbb”了，**同时在全局执行上下文中打印 myName，JavaScript 引擎提示该变量未定义。**

## 通过对象调用

```javascript
var myObj = {
  name: 'aaa',
  showThis: function () {
    console.log(this)
  },
}
myObj.showThis()
```

this 值是指向 myObj <br />**使用对象来调用其内部的一个方法，该方法的 this 是指向对象本身的。**

接下来我们稍微改变下调用方式，把 showThis 赋给一个全局对象，然后再调用该对象，代码如下所示：

```javascript
var myObj = {
  name: 'aaa',
  showThis: function () {
    this.name = 'bbb'
    console.log(this)
  },
}
var foo = myObj.showThis
foo()
```

执行这段代码，你会发现 this 又指向了全局 window 对象。所以通过以上两个例子的对比，你可以得出下面这样两个结论：

- **在全局环境中调用一个函数，函数内部的 this 指向的是全局变量 window。**
- **通过一个对象来调用其内部的一个方法，该方法的执行上下文中的 this 指向对象本身。**

## 通过构造函数设置

```javascript
function CreateObj() {
  this.name = 'aaa'
}
var myObj = new CreateObj()
```

在这段代码中，我们使用 new 创建了对象 myObj，那你知道此时的构造函数 CreateObj 中的 this 到底指向了谁吗？<br />其实，当执行 new CreateObj() 的时候，JavaScript 引擎做了如下四件事：

- 首先创建了一个空对象 tempObj；
- 接着调用 CreateObj.call 方法，并将 tempObj 作为 call 方法的参数，这样当 CreateObj 的执行上下文创建时，它的 this 就指向了 tempObj 对象；
- 然后执行 CreateObj 函数，此时的 CreateObj 函数执行上下文中的 this 指向了 tempObj 对象；
- 最后返回 tempObj 对象。

```javascript
var tempObj = {}
CreateObj.call(tempObj)
return tempObj
```

# this 的设计缺陷以及应对方案

## 嵌套函数中的 this 不会从外层函数中继承

```javascript
var myObj = {
  name: 'aaa',
  showThis: function () {
    console.log(this)
    function bar() {
      console.log(this)
    }
    bar()
  },
}
myObj.showThis()
```

你可能会很自然地觉得，bar 中的 this 应该和其外层 showThis 函数中的 this 是一致的，都是指向 myObj 对象的，这很符合人的直觉。<br />但实际情况却并非如此，执行这段代码后，你会发现**函数 bar 中的 this 指向的是全局 window 对象，而函数 showThis 中的 this 指向的是 myObj 对象。**这就是 JavaScript 中非常容易让人迷惑的地方之一，也是很多问题的源头。

你可以通过一个小技巧来解决这个问题，比如在 showThis 函数中声明一个变量 self 用来保存 this，然后在 bar 函数中使用 self，代码如下所示：

```javascript
var myObj = {
  name: 'aaa',
  showThis: function () {
    console.log(this)
    var self = this
    function bar() {
      self.name = 'bbb'
    }
    bar()
  },
}
myObj.showThis()
console.log(myObj.name)
console.log(window.name)
```

也可以用 ES6 箭头函数来解决

```javascript
var myObj = {
  name: 'aaa',
  showThis: function () {
    console.log(this)
    var bar = () => {
      this.name = 'bbb'
      console.log(this)
    }
    bar()
  },
}
myObj.showThis()
console.log(myObj.name)
console.log(window.name)
```

这是因为 ES6 中的箭头函数并不会创建其自身的执行上下文，所以箭头函数中的 this 取决于它的外部函数。

你现在应该知道了** this 没有作用域的限制，这点和变量不一样，所以嵌套函数不会从调用它的函数中继承 this**，这样会造成很多不符合直觉的代码。<br />要解决这个问题，你可以有两种思路：

- 第一种是把 this 保存为一个 self 变量，再利用变量的作用域机制传递给嵌套函数。
- 第二种是继续使用 this，但是要把嵌套函数改为箭头函数，因为箭头函数没有自己的执行上下文，所以它会继承调用函数中的 this。

## 普通函数中的 this 默认指向全局对象 window

在默认情况下调用一个函数，其执行上下文中的 this 是默认指向全局对象 window 的。

不过这个设计也是一种缺陷，因为在实际工作中，我们并不希望函数执行上下文中的 this 默认指向全局对象，因为这样会打破数据的边界，造成一些误操作。如果要让函数执行上下文中的 this 指向某个对象，最好的方式是通过 call 方法来显示调用。

这个问题可以通过设置 JavaScript 的“严格模式”来解决。在严格模式下，默认执行一个函数，其函数的执行上下文中的 this 值是 undefined，这就解决上面的问题了。

# 总结

1. 当函数作为对象的方法调用时，函数中的 this 就是该对象；
1. 当函数被正常调用时，在严格模式下，this 值是 undefined，非严格模式下 this 指向的是全局对象 window；
1. 嵌套函数中的 this 不会继承外层函数的 this 值。
1. 箭头函数没有自己的执行上下文，所以箭头函数的 this 就是它外层函数的 this。

# 思考

```javascript
let userInfo = {
  name: 'jack.ma',
  age: 13,
  sex: male,
  updateInfo: function () {
    //模拟xmlhttprequest请求延时
    setTimeout(function () {
      this.name = 'pony.ma'
      this.age = 39
      this.sex = female
    }, 100)
  },
}

userInfo.updateInfo()
```

我想通过 updateInfo 来更新 userInfo 里面的数据信息，但是这段代码存在一些问题，你能修复这段代码吗？

1. 箭头函数
1. 缓存上下文（self、自执行函数）
1. 显示绑定上下文（call, apply, bind)
1. setTimeout 第三个参数传入（其实也相当于缓存了上下文）

```javascript
// 修改方法一：箭头函数最方便
let userInfo = {
  name: 'jack.ma',
  age: 13,
  sex: 'male',
  updateInfo: function () {
    // 模拟 xmlhttprequest 请求延时
    setTimeout(() => {
      this.name = 'pony.ma'
      this.age = 39
      this.sex = 'female'
    }, 100)
  },
}

userInfo.updateInfo()
setTimeout(() => {
  console.log(userInfo)
}, 200)

// 修改方法二：缓存外部的this
let userInfo = {
  name: 'jack.ma',
  age: 13,
  sex: 'male',
  updateInfo: function () {
    let me = this
    // 模拟 xmlhttprequest 请求延时
    setTimeout(function () {
      me.name = 'pony.ma'
      me.age = 39
      me.sex = 'female'
    }, 100)
  },
}

userInfo.updateInfo()
setTimeout(() => {
  console.log(userInfo)
}, 200)

// 修改方法三，其实和方法二的思路是相同的
let userInfo = {
  name: 'jack.ma',
  age: 13,
  sex: 'male',
  updateInfo: function () {
    // 模拟 xmlhttprequest 请求延时
    void (function (me) {
      setTimeout(function () {
        me.name = 'pony.ma'
        me.age = 39
        me.sex = 'female'
      }, 100)
    })(this)
  },
}

userInfo.updateInfo()
setTimeout(() => {
  console.log(userInfo)
}, 200)

let update = function () {
  this.name = 'pony.ma'
  this.age = 39
  this.sex = 'female'
}

方法四: 利用call或apply修改函数被调用时的this值(不知掉这么描述正不正确)
let userInfo = {
  name: 'jack.ma',
  age: 13,
  sex: 'male',
  updateInfo: function () {
    // 模拟 xmlhttprequest 请求延时
    setTimeout(function () {
      update.call(userInfo)
      // update.apply(userInfo)
    }, 100)
  },
}

userInfo.updateInfo()
setTimeout(() => {
  console.log(userInfo)
}, 200)

// 方法五: 利用bind返回一个新函数，新函数被调用时的this指定为userInfo
let userInfo = {
  name: 'jack.ma',
  age: 13,
  sex: 'male',
  update: function () {
    this.name = 'pony.ma'
    this.age = 39
    this.sex = 'female'
  },
  updateInfo: function () {
    // 模拟 xmlhttprequest 请求延时
    setTimeout(this.update.bind(this), 100)
  },
}
```

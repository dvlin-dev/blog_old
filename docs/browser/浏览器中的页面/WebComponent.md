# WebComponent

> 组件化: 对内高内聚，对外低耦合

# 阻碍前端组件化的因素

- CSS 是影响全局的
- 任何地方都可以直接读取和修改 DOM

# WebComponent 组件化开发

现在我们了解了 CSS 和 DOM 是阻碍组件化的两个因素，那要怎么解决呢？

WebComponent 给出了解决思路，它提供了对局部视图封装能力，可以让 DOM、CSSOM 和 JavaScript 运行在局部环境中，这样就使得局部的 CSS 和 DOM 不会影响到全局。

WebComponent 是一套技术的组合，具体涉及到了 Custom elements（自定义元素）、Shadow DOM（影子 DOM）和 HTML templates（HTML 模板），详细内容可以参考 MDN 上的 [相关链接](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)

```javascript

<!DOCTYPE html>
<html>


<body>
    <!--
            一：定义模板
            二：定义内部CSS样式
            三：定义JavaScript行为
    -->
    <template id="bowlingq">
        <style>
            p {
                background-color: brown;
                color: cornsilk
            }


            div {
                width: 200px;
                background-color: bisque;
                border: 3px solid chocolate;
                border-radius: 10px;
            }
        </style>
        <div>
            <p>time.geekbang.org</p>
            <p>time1.geekbang.org</p>
        </div>
        <script>
            function foo() {
                console.log('inner log')
            }
        </script>
    </template>
    <script>
        class BowlingQ extends HTMLElement {
            constructor() {
                super()
                //获取组件模板
                const content = document.querySelector('#bowlingq').content
                //创建影子DOM节点
                const shadowDOM = this.attachShadow({ mode: 'open' })
                //将模板添加到影子DOM上
                shadowDOM.appendChild(content.cloneNode(true))
            }
        }
        customElements.define('bowling-q', BowlingQ)
    </script>


    <bowling-q></bowling-q>
    <div>
        <p>bowlingq</p>
        <p>bowlingq</p>
    </div>
    <bowling-q></bowling-q>
</body>


</html>
```

**首先，使用 template 属性来创建模板。**<br />**其次，我们需要创建一个 GeekBang 的类。**在该类的构造函数中要完成三件事：

1. 查找模板内容；
1. 创建影子 DOM；
1. 再将模板添加到影子 DOM 上。
   > 影子 DOM 的作用是将模板中的内容与全局 DOM 和 CSS 进行隔离，这样我们就可以实现元素和样式的私有化了。你可以把影子 DOM 看成是一个作用域，其内部的样式和元素是不会影响到全局的样式和元素的，而在全局环境下，要访问影子 DOM 内部的样式或者元素也是需要通过约定好的接口的。

在创建好封装影子 DOM 的类之后，我们就可以使用 customElements.define 来自定义元素了<br />**最后，就可以像正常使用 HTML 元素一样使用该元素**

影子 DOM 内部的样式是不会影响到全局 CSSOM 的。另外，使用 DOM 接口也是无法直接查询到影子 DOM 内部元素的

影子 DOM 的 JavaScript 脚本是不会被隔离的，比如在影子 DOM 定义的 JavaScript 函数依然可以被外部访问

# 浏览器如何实现影子 DOM

影子 DOM 的功能：

1. 影子 DOM 中的元素对于整个网页是不可见的；
1. 影子 DOM 的 CSS 不会影响到整个网页的 CSSOM，影子 DOM 内部的 CSS 只对内部的元素起作用。

怎么实现的？

每个影子 DOM 都有一个 shadow root 的根节点，我们可以将要展示的样式或者元素添加到影子 DOM 的根节点上，每个影子 DOM 你都可以看成是一个独立的 DOM，它有自己的样式、自己的属性，内部样式不会影响到外部样式，外部样式也不会影响到内部样式。

浏览器为了实现影子 DOM 的特性，在代码内部做了大量的条件判断，比如当通过 DOM 接口去查找元素时，渲染引擎会去判断 bowling-q 属性下面的 shadow-root 元素是否是影子 DOM，如果是影子 DOM，那么就直接跳过 shadow-root 元素的查询操作。所以这样通过 DOM API 就无法直接查询到影子 DOM 的内部元素了。

另外，当生成布局树的时候，渲染引擎也会判断 bowling-q 属性下面的 shadow-root 元素是否是影子 DOM，如果是，那么在影子 DOM 内部元素的节点选择 CSS 样式的时候，会直接使用影子 DOM 内部的 CSS 属性。所以这样最终渲染出来的效果就是影子 DOM 内部定义的样式。

# 总结

web component 是通过浏览器引擎提供 api 接口进行操作，让后在 dom，cssom 生成过程中控制实现组件化的作用域/执行执行上下文的隔离； vue/react 是在没有浏览器引擎支持的情况下，通过采取一些取巧的手法（比如：js 执行上下文的封装利用闭包；样式的封装利用文件 hash 值作为命名空间在 css 选择的时候多套一层选择条件（hash 值），本质上还是全局的只是不同组件 css 选择的时候只能选择到组件相应的 css 样式，实现的隔离）

一方面，React 组件之间是不会互相继承的。比如说，你不会创建一个 Button 组件，然后再创建一个 DropdownButton 来继承 Button。所以说，React 中其实是没有利用到 Class 的继承特性的。

另一方面，因为所有 UI 都是由状态驱动的，因此很少会在外部去调用一个类实例（即组件）的方法。要知道，组件的所有方法都是在内部调用，或者作为生命周期方法被自动调用的。

所以你看，这两个 Class 最重要的特性其实都没有用到。而在 React 出现之时，主流的方式还是基于对象去考虑问题。例如获得一个对话框的实例，然后通过 dialog.show(), dialog.hide() 这样的方式细粒度地去控制 UI 的变化。

而这在 React 中其实是没有必要的，因为所有的 UI 都是声明出来的，不用处理细节的变化过程。因此，通过函数去描述一个组件才是最为自然的方式。这也是为什么 React 很早就提供了函数组件的机制。

只是当时有一个局限是，函数组件无法存在内部状态，必须是纯函数，而且也无法提供完整的生命周期机制。这就极大限制了函数组件的大规模使用。

那么我们自然就知道了，Class 作为 React 组件的载体，也许并不是最适合，反而函数是更适合去描述 State => View 这样的一个映射，但是函数组件又没有 State ，也没有生命周期方法。以此来看，我们应该如何去改进呢？


## Hooks 是如何诞生的？
其实顺着函数组件的思路继续思考，就会发现，如果我们想要让函数组件更有用，目标就是给函数组件加上状态。这看上去似乎并不是难事。

简单想一下，函数和对象不同，并没有一个实例的对象能够在多次执行之间保存状态，那势必需要一个函数之外的空间来保存这个状态，而且要能够检测其变化，从而能够触发函数组件的重新渲染。

再进一步想，那我们是不是就是需要这样一个机制，能够把一个外部的数据绑定到函数的执行。当数据变化时，函数能够自动重新执行。这样的话，任何会影响 UI 展现的外部数据，都可以通过这个机制绑定到 React 的函数组件。在 React 中，这个机制就是 Hooks。

通过这样的思考，你应该能够理解 Hooks 诞生的来龙去脉了。比起 Class 组件，函数组件是更适合去表达 React 组件的执行的，因为它更符合 State => View 这样的一个逻辑关系。但是因为缺少状态、生命周期等机制，让它一直功能受限。而现在有了 Hooks，函数组件的力量终于能真正发挥出来了！不过这里有一点需要特别注意，Hooks 中被钩的对象，不仅可以是某个独立的数据源，也可以是另一个 Hook 执行的结果，这就带来了 Hooks 的最大好处：逻辑的复用。

## Hooks 带来的最大好处：逻辑复用
在之前的 React 使用中，有一点经常被大家诟病，就是非常难以实现逻辑的复用，必须借助于高阶组件等复杂的设计模式。但是高阶组件会产生冗余的组件节点，让调试变得困难。不过这些问题可以通过 Hooks 得到很好的解决。所以如果有人问你 Hooks 有什么好处，那么最关键的答案就是简化了逻辑复用。

## Hooks 的另一大好处：有助于关注分离
除了逻辑复用之外，Hooks 能够带来的另外一大好处就是有助于关注分离，意思是说 Hooks 能够让针对同一个业务逻辑的代码尽可能聚合在一块儿。这是过去在 Class 组件中很难做到的。因为在 Class 组件中，你不得不把同一个业务逻辑的代码分散在类组件的不同生命周期的方法中。

所以通过 Hooks 的方式，把业务逻辑清晰地隔离开，能够让代码更加容易理解和维护。

Hooks 作为 React 自诞生以来最大的一个新功能，可以说得到了普遍好评，成为了 React 开发的主流方式。而它也在一定程度上更好地体现了 React 的开发思想，即从 **State => View 的函数式映射。+**

此外， Hooks 也解决了 Class 组件存在的一些代码冗余、难以逻辑复用的问题。


## state |  immutable | this
先看一个例子：
```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      console.log(`You clicked ${count} times`);
    }, 3000);
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
在函数式组件中，Counter 实际上会被渲染6次，并依次输出 

- you clicked  0 times
- you clicked  1 times
- you clicked  2 times
- you clicked  3 times
- you clicked  4 times
- you clicked  5 times

但如果你要在 class 组件中这样做的话，count 始终是最新的值
> dan 的解释：
> 我觉得Hooks这么依赖Javascript闭包是挺讽刺的一件事。有时候组件的class实现方式会受闭包相关的苦（[the canonical wrong-value-in-a-timeout confusion](https://wsvincent.com/javascript-closure-settimeout-for-loop/)），但其实这个例子中真正的混乱来源是可变数据（React 修改了class中的this.state使其指向最新状态），并不是闭包本身的错。

在 React 中 **state** 是不可变(**immutable**)的，所以他们永远不会改变。**然而，this是，而且永远是，可变(mutable)的。**

通常这个问题，<br />在类组件中，如果要保持点击时的值是**当时**的，可以采用闭包来解决，先把props 取出来赋值。<br />在函数组件中，如果要保持调用时的值是**最新**的，可以采用`ref`或者`useReducer`


## 引用
[Dan 函数组件和类组件](https://overreacted.io/zh-hans/how-are-function-components-different-from-classes/)
Dan useEffect 

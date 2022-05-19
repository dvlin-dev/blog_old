![[图]react-dom-render.jpg](../../assets/1644379442833-bd089c0b-02b7-40b1-bde7-fd432ce9ddca.jpeg)
render 代码执行过程

-  创建 root 过程调用 legacyCreateRootFromDOMContainer 
-  判断是否需要合并根节点内子节点，服务端渲染需要合并节点，不需要合并删除跟节点的默认子节点 
-  new ReactRoot 实例，内部通过 react-reconciler（和平台无关的节点的调和操作）创建 FiberRoot，存储在 root 实例 
-  执行 root.render，内部通过 react-reconciler 计算 expirationTime（相关 ConcurrentMode 功能） 

React 创建更新的方式

-  ReactDOM.render || ReactDOM.hydrate（首次渲染） 
-  setState || forceUpdate（更新渲染） 

说明：

render 和 hydrate 唯一区别是是否要调和复用节点，hydrate 更多应用在服务端渲染的场景，由于获取的 dom 节点和浏览器端是一样的，所有会复用节点。

ReactDOM.render 执行步骤

-  创建 ReactRoot 
-  创建 FiberRoot 和 RootFiber 
-  创建更新，到达更新调度的阶段 

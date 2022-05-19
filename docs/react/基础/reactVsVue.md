
### 1. 数据流
vue不全部是mvvm   提供了ref

### 2. react diff vs vue diff
react: fibernode（链表）  jsx数组<br />vue vnode 数组  <br />vue 可正序倒序 因为数组可以随意访问。

#### diff
diff针对整个树 reconcile 比较fiber和jsx对象<br />bailout： shouldComponentUpdate pure react.memo 命中 这个， 两种级别  一种是单个节点 一种是整棵树，<br />没有编译时的优化 所以API
![image.png](../../assets/1649595345907-820dbbfa-ce54-4201-ae27-52760085cba9.png)
 
### fiber
优先级调度 实现异步可中断的更新。<br />Scheduler  

### 3. 灵活度
**动态路由**<br />vue addconfig<br />react动态的

### 4. 生态
国外搞开源的比较多<br />学一个新东西也比较多的


## offscreen
 hooks 和 class 不能比



## react  数据是不可变的，不能在原数据上修改，只能用新的值覆盖
例如组件每次渲染都有自己的state、props，不去修改原数据，可以防止之前渲染的state被污染

## react 没有vue的双向数据绑定
react 虽然用 setState 看起来是可以实现双向数据绑定的效果，其实是每次`setState`都用全新的值去渲染视图


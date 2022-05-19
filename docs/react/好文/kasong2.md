1. VUE 、REACT 都是 DSL（领域特定的语言） 类的语言 类似 HTML、CSS，选择哪个看你的业务需求、类似小程序像 VUE 其实不是 只是借鉴
1. vue3、react：看上层需求

### 高优先级打断低优先级

会丢失被打断的任务的状态 重新开始

### vite webpack

![image.png](../../assets/1649593772696-bd33886f-06fe-4e04-8710-7ab18645fbc9.png)
98% vs 100<br />vite webpack

### 1

16.8 hooks suspense<br />18 批处理 batch update<br />concurment

### react 懒加载的最佳实践

react-loader 。。。。

### react 组件库 中 css 解决方案

考虑导出的问题怎么用 esm cssmoudl

### 前端转岗

![image.png](../../assets/1649594369223-6983fd99-a0df-4062-8481-ecf30dc4bc52.png)
转岗最重要不要丢失自己的代码能力

### react diff vs vue diff

react: fibernode（链表） jsx 数组<br />vue vnode 数组 <br />vue 可正序倒序 因为数组可以随意访问。

### diff

diff 针对整个树 reconcile 比较 fiber 和 jsx 对象<br />bailout： should react.memo 命中 这个， 两种级别 一种是单个节点 一种是整棵树，<br />没有编译时的优化 所以 API
![image.png](../../assets/1649595345907-820dbbfa-ce54-4201-ae27-52760085cba9.png)

### 123

![image.png](../../assets/1649595545271-3bf135f8-49ca-431b-8e8b-ee255b2f1e0e.png)
reactDom.render createRoot<br />用了并发特性 自己帮你处理

### other

useEffect 宏任务

### react 源码 考核的深度

1. 原理
1. 结合业务

![image.png](../../assets/1649596155997-41e12eeb-2349-4e3c-bfd0-56e48151578f.png)
![image.png](../../assets/1649596213663-73d53bdf-6e6d-4732-8d8a-858118feee66.png)
![image.png](../../assets/1649596445743-6ef6d7a2-b18a-476f-b9d6-b2d6651c7d03.png)
hooks 理念

### 白屏

#### 请求 fetch

宿主环境：webview 预请求 预加载

#### 运行时

SSG <br />SSR 1. 常规的 SSR 页面刚出 btn 点没用 因为 react 还没加载
![image.png](../../assets/1649596914073-2468dd89-6556-4c1b-b990-168559712b8d.png)
react18 水合模式 有个 btn 优先激活

// TODO 看看 scoket 怎么封装 看看库

### react 性能优化

eager state<br />bailout

`update(1)` 就是 eager state 前后一样就不触发<br />bailout ： pure memo useMemo

### rust

构建工具 rust go 前端基建蔚来<br />wasm 浏览器 IDE 设计软件 figma 音视频处理

### vite webpack

webpack 兜底<br />vite 可以尝试用

浏览器工作原理
  
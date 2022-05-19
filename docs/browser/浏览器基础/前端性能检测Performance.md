# Performance

[https://developer.mozilla.org/zh-CN/docs/Web/API/Performance](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance)
**Performance**

接口可以获取到当前页面中与性能相关的信息。它是 High Resolution Time API 的一部分，同时也融合了  Performance Timeline API、[Navigation Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_timing_API)、 [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) 和 [Resource Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API)
该类型的对象可以通过调用只读属性 `[Window.performance](https://developer.mozilla.org/zh-CN/docs/Web/API/performance_property)` 来获得。

> 注意：除了以下指出的情况外，该接口及其成员在 `Web Worker` 中可用。此外，还需注意，performance 的创建和衡量都是同一环境下的。即，如果你在主线程（或者其他 worker）中创建了一个 performance，那么它在另外的 worker 线程中是不可用的；反之亦然。

属性

| 名称                       | 详情                                                                                                                                     | 备注                                  |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| eventCounts                | 事件数量                                                                                                                                 | 目前为实验室阶段,MDN 上仍无具体解释。 |
| memory                     | 栈的使用情况                                                                                                                             | 非标准                                |
| navigation                 | 提供了在指定的时间段里发生的操作相关信息，包括页面是加载还是刷新、发生了多少次重定向等等                                                 | 弃用                                  |
| onresourcetimingbufferfull | 一个回调的 `[EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget)`<br />，当浏览器的资源时间性能缓冲区已满时会触发 |                                       |
| timeOrigin                 | 性能测量开始时的时间的高精度时间戳。                                                                                                     | 非标准                                |
| timing                     | `[PerformanceTiming](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceTiming)`<br /> 对象包含延迟相关的性能信息               | 弃用                                  |

navigation

```JavaScript
interface PerformanceNavigation {
  const unsigned short TYPE_NAVIGATE = 0;
  const unsigned short TYPE_RELOAD = 1;
  const unsigned short TYPE_BACK_FORWARD = 2;
  const unsigned short TYPE_RESERVED = 255;
  readonly attribute unsigned short type;
  readonly attribute unsigned short redirectCount;
};
```

该属性是一个对象，有两个属性值，分别是 `redirectCount（重定向次数）` 、 `type（操作的类型）`：

`redirectCount`

该属性值为几，就说明了当前页面重定向了多少次；

`type`

``type(0)`：当前页面是通过点击链接，书签和表单提交，或者脚本操作，或者在 url 中直接输入地址;<br />`type(1)`：点击刷新页面按钮或者通过 Location.reload()方法显示的页面；<br />`type(2)`：页面通过历史记录和前进后退访问时；<br />`type(255)`：任何未由上述值定义的导航类型。<br />onresourcetimingbufferfull<br />`**onresourcetimingbufferfull**`属性是一个在`resourcetimingbufferfull`事件触发时会被调用的 `[event handler](https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers)` 。这个事件当浏览器的资源时间性能缓冲区已满时会触发。<br />下面的示例在`onresourcetimingbufferfull属性上`设置一个回调函数。

```JavaScript
function buffer_full(event) {
  console.log("WARNING: Resource Timing Buffer is FULL!");
  performance.setResourceTimingBufferSize(200);
}
function init() {
  // Set a callback if the resource buffer becomes filled
  performance.onresourcetimingbufferfull = buffer_full;
}
<body onload="init()">
```

timing

| 时间段                                    | 描述                                                                                                                                                                                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| navigationStart ~ unloadEventEnd          | 上一页面的卸载耗时                                                                                                                                                                                                            |
| fetchStart ~ domainLookupStart            | 查询 app DNS 缓存耗时                                                                                                                                                                                                         |
| domainLookupStart ~ domainLookupEnd       | dns 查询耗时                                                                                                                                                                                                                  |
| connectStart ~ connectEnd                 | TCP 连接耗时                                                                                                                                                                                                                  |
| connectEnd ~ secureConnectionStart        | 针对 https 协议，在 tcp 握手后，传输真正的内容前，建立安全连接的耗时                                                                                                                                                          |
| fetchStart ~ responseStart                | `TTFB`<br />（time to first byte）, 即首包时长（从用户代理发出第一个请求开始，到页面读取到第一个字节的耗时）。在一个 web 程序中，用户代理发送的第一个 get 请求一般是 index.html，即接收到这个 html 文件的第一个字节的耗费时间 |
| responseStart ~ responseEnd               | 内容响应时长                                                                                                                                                                                                                  |
| domLoading ~ domInteractive               | dom 解析完成，即 DOM 树构建完成的时长                                                                                                                                                                                         |
| domContentLoadedEventEnd ~ loadEventStart | 渲染时长，domContentLoaded 表示 DOM，CSSOM 均准备就绪（CSSOM 就绪意味着没有样式表阻止 js 脚本执行），开始构建渲染树                                                                                                           |
| navigationStart ~ domLoading              | FPT（first paint time）, 即首次渲染时间，或白屏时间，从用户打开页面开始，到第一次渲染出可见元素为止                                                                                                                           |
| navigationStart ~ domInteractive          | `TTI`<br />（time to interact），首次可交互时间                                                                                                                                                                               |
| fetchStart ~ domContentLoadedEventEnd     | html 加载完成时间，此时 DOM 已经解析完成                                                                                                                                                                                      |
| navigationStart ~ loadEventStart          | 页面完全加载完成的时间                                                                                                                                                                                                        |

方法

| `[Performance.clearMarks()](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/clearMarks)`                                                                                                                                      | 将给定的 mark 从浏览器的性能输入缓冲区中移除。                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[Performance.clearMeasures()](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/clearMeasures)`                                                                                                                                | 将给定的 measure 从浏览器的性能输入缓冲区中移除。                                                                                                                                                                                                                     |
| `[Performance.clearResourceTimings()](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/clearResourceTimings)`                                                                                                                  | 从浏览器的性能数据缓冲区中移除所有 `[entryType](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceEntry/entryType)`<br /> 是 "`resource`<br />" 的 `[performance entries](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceEntry)`<br />。       |
| `[Performance.getEntries()](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/getEntries)`                                                                                                                                      | 基于给定的 _filter_ 返回一个 `[PerformanceEntry](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceEntry)`<br /> 对象的列表。                                                                                                                               |
| `[Performance.getEntriesByName()](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/getEntriesByName)`                                                                                                                          | 基于给定的 _name_ 和 _entry type_ 返回一个 `[PerformanceEntry](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceEntry)`<br /> 对象的列表。                                                                                                                 |
| `[Performance.getEntriesByType()](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/getEntriesByType)`                                                                                                                          | 基于给定的 _entry type_ 返回一个 `[PerformanceEntry](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceEntry)`<br /> 对象的列表                                                                                                                             |
| `[Performance.mark()](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/mark)`                                                                                                                                                  | 根据给出 name 值，在浏览器的性能输入缓冲区中创建一个相关的`[timestamp](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMHighResTimeStamp)`                                                                                                                         |
| `[Performance.measure()](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/measure)`                                                                                                                                            | 在浏览器的指定 _start mark 和  end mark_ 间的性能输入缓冲区中创建一个指定的 `[timestamp](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMHighResTimeStamp)`                                                                                                       |
| `[Performance.now()](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/now)`                                                                                                                                                    | 返回一个表示从性能测量时刻开始经过的毫秒数 `[DOMHighResTimeStamp](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMHighResTimeStamp)`                                                                                                                              |
| `[Performance.setResourceTimingBufferSize()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/setResourceTimingBufferSize)`<br />[ ](https://developer.mozilla.org/en-US/docs/Web/API/Performance/setResourceTimingBufferSize) | 将浏览器的资源 timing 缓冲区的大小设置为  "`resource`<br />" `[type](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceEntry/entryType)`<br />`[performance entry](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceEntry)`<br /> 对象的指定数量 |
| `[Performance.toJSON()](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/toJSON)`                                                                                                                                              | 其是一个 JSON 格式转化器，返回 Performance 对象的 JSON 对象                                                                                                                                                                                                           |

api 简单使用

```JavaScript
//以一个标志开始。
performance.mark("measure-start");
//等待一些时间。
setTimeout(function(){
  //标志时间的结束。
  performance.mark("measure-end");
  //测量两个不同的标志。
  performance.measure("measure-list", "measure-start","measure-end");
  let markArr = performance.getEntriesByName("measure-list");
  console.log(markArr);
  //获取所有的测量输出。
  //在这个例子中只有一个。
  var measure = markArr[0];
  console.log("setTimeout milliseconds:",measure);
  //清除存储的标志位
  performance.clearMarks();
  performance.clearMeasures();
},1000);
```

其他<br />除此之外，在 chrome 浏览器上有 Performance 图形化界面，还有 Lighthouse 也可以提供资源效率的检测<br />参考文献<br />[https://www.w3.org/TR/navigation-timing/](https://www.w3.org/TR/navigation-timing/)

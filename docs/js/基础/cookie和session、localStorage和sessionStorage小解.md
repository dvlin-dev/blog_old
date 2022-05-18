# cookie 和 session、localStorage 和 sessionStorage 小解

一、cookie 和 session

> cookie 和 session 都是用来跟踪浏览器用户身份的会话方式。

区别：

1、保持状态

**cookie**保存在浏览器端，**session**保存在服务器端

2、使用方式

（1）cookie 机制：如果不在浏览器中设置过期时间，cookie 被保存在内存中，生命周期随浏览器的关闭而结束，这种 cookie 简称会话 cookie。如果在浏览器中设置了 cookie 的过期时间，cookie 被保存在硬盘中，关闭浏览器后，cookie 数据仍然存在，直到过期时间结束才消失。

> Cookie 是服务器发给客户端的特殊信息，cookie 是以文本的方式保存在客户端，每次请求时都带上它

（2）session 机制：当服务器收到请求需要创建 session 对象时，首先会检查客户端请求中是否包含 sessionid。如果有 sessionid，服务器将根据.该 id 返回对应 session 对象。如果客户端请求中没有 sessionid，服务器会创建新的 session 对象，并把 sessionid 在本次响应中返回给客户端。

> 通常使用 cookie 方式存储 sessionid 到客户端，在交互中浏览器按照规则将 sessionid 发送给服务器。如果用户禁用 cookie，则要使用 URL 重写，可以通过 response.encodeURL(url) 进行实现；API 对 encodeURL 的结束为，当浏览器支持 Cookie 时，url 不做任何处理；当浏览器不支持 Cookie 的时候，将会重写 URL 将 SessionID 拼接到访问地址后。

3、存储内容

cookie 只能保存字符串类型，以文本的方式；session 通过类似与 Hashtable 的数据结构来保存，能支持任何类型的对象(session 中可含有多个对象)

4、存储的大小

cookie：单个 cookie 保存的数据不能超过 4kb；session 大小没有限制。

5、安全性

cookie：针对 cookie 所存在的攻击：Cookie 欺骗，Cookie 截获；session 的安全性大于 cookie。

> 原因如下：（1）sessionID 存储在 cookie 中，若要攻破 session 首先要攻破 cookie；<br />（2）sessionID 是要有人登录，或者启动 session_start 才会有，所以攻破 cookie 也不一定能得到 sessionID；<br />（3）第二次启动 session_start 后，前一次的 sessionID 就是失效了，session 过期后，sessionID 也随之失效。<br />（4）sessionID 是加密的<br />（5）综上所述，攻击者必须在短时间内攻破加密的 sessionID，这很难。

6、应用场景

**cookie**：<br />（1）判断用户是否登陆过网站，以便下次登录时能够实现自动登录（或者记住密码）。如果我们删除 cookie，则每次登录必须从新填写登录的相关信息。

（2）保存上次登录的时间等信息。

（3）保存上次查看的页面

（4）浏览计数

**session**：Session 用于保存每个用户的专用信息，变量的值保存在服务器端，通过 SessionID 来区分不同的客户。

（1）网上商城中的购物车

（2）保存用户登录信息

（3）将某些数据放入 session 中，供同一用户的不同页面使用

（4）防止用户非法登录

7、缺点

**cookie**：

（1）大小受限

（2）用户可以操作（禁用）cookie，使功能受限

（3）安全性较低

（4）有些状态不可能保存在客户端。

（5）每次访问都要传送 cookie 给服务器，浪费带宽。

（6）cookie 数据有路径（path）的概念，可以限制 cookie 只属于某个路径下。

> session：<br />（1）Session 保存的东西越多，就越占用服务器内存，对于用户在线人数较多的网站，服务器的内存压力会比较大。<br />（2）依赖于 cookie（sessionID 保存在 cookie），如果禁用 cookie，则要使用 URL 重写，不安全<br />（3）创建 Session 变量有很大的随意性，可随时调用，不需要开发者做精确地处理，所以，过度使用 session 变量将会导致代码不可读而且不好维护。

二、localStorage 和 sessionStorage

> 官网文档

[https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)

[https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage)

[https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API)

WebStorage

WebStorage 的目的是克服由 cookie 所带来的一些限制，当数据需要被严格控制在客户端时，不需要持续的将数据发回服务器。

WebStorage 两个主要目标：

（1）提供一种在 cookie 之外存储会话数据的路径。

（2）提供一种存储大量可以跨会话存在的数据的机制。

**HTML5 的 WebStorage 提供了两种 API：localStorage（本地存储）和 sessionStorage（会话存储）。**

> 可以参考下 MDN 上的资料！

1、生命周期

**localStorage**:localStorage 的生命周期是永久的，关闭页面或浏览器之后 localStorage 中的数据也不会消失。localStorage 除非主动删除数据，否则数据永远不会消失。

**sessionStorage**的生命周期是在仅在当前会话下有效。sessionStorage 引入了一个“浏览器窗口”的概念，sessionStorage 是在同源的窗口中始终存在的数据。只要这个浏览器窗口没有关闭，即使刷新页面或者进入同源另一个页面，数据依然存在。但是 sessionStorage 在关闭了浏览器窗口后就会被销毁。同时独立的打开同一个窗口同一个页面，sessionStorage 也是不一样的。

2、存储大小

localStorage 和 sessionStorage 的存储数据大小一般都是：5MB

3、存储位置

localStorage 和 sessionStorage 都保存在客户端，不与服务器进行交互通信。

4、存储内容类型

localStorage 和 sessionStorage 只能存储字符串类型，对于复杂的对象可以使用 ECMAScript 提供的 JSON 对象的 stringify 和 parse 来处理

5、获取方式

localStorage：window.localStorage;；sessionStorage：window.sessionStorage;。

6、应用场景：localStoragese：常用于长期登录（+判断用户是否已登录），适合长期保存在本地的数据。sessionStorage：敏感账号一次性登录；

WebStorage 的优点：

（1）存储空间更大：cookie 为 4KB，而 WebStorage 是 5MB；

（2）节省网络流量：WebStorage 不会传送到服务器，存储在本地的数据可以直接获取，也不会像 cookie 一样美词请求都会传送到服务器，所以减少了客户端和服务器端的交互，节省了网络流量；

（3）对于那种只需要在用户浏览一组页面期间保存而关闭浏览器后就可以丢弃的数据，sessionStorage 会非常方便；

（4）快速显示：有的数据存储在 WebStorage 上，再加上浏览器本身的缓存。获取数据时可以从本地获取会比从服务器端获取快得多，所以速度更快；

（5）安全性：WebStorage 不会随着 HTTP header 发送到服务器端，所以安全性相对于 cookie 来说比较高一些，不会担心截获，但是仍然存在伪造问题；

（6）WebStorage 提供了一些方法，数据操作比 cookie 方便；

> setItem (key, value) ——   保存数据，以键值对的方式储存信息。<br />getItem (key) ——   获取数据，将键值传入，即可获取到对应的 value 值。<br />removeItem (key) ——   删除单个数据，根据键值移除对应的信息。<br />clear () ——   删除所有的数据<br />key (index) —— 获取某个索引的 key

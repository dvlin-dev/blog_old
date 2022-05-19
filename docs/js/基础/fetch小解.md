原生 xhr、jquery ajax、axios、fetch 对比

```JavaScript
// 原生XHR
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText)   // 从服务器获取数据
    }
}
xhr.send()
//jquery ajax
$.ajax({
    type: 'POST',
    url: url,
    data: data,
    dataType: dataType,
    success: function() {},
    error: function() {}
})
//axios
axios({
  method:'get',
  url:url,
})
  .then(function(response) {}
  .catch(function(error)));

// fetch
fetch(url)
  .then(response => {
      if (response.ok) {
          return response.json();
      }
  })
  .then(data => console.log(data))
  .catch(err => console.log(err))
```

我们一眼就能看出 fetch 和 axios 很像，他们的 API 是基于 Promise 设计的，经过优化后，代码会更加优雅

```JavaScript
try {
    const response = await fetch(url)
    const data = await response.json()
    console.log(data);
  } catch (error) {
    console.log('请求出错', error);
  }
```

他是浏览器底层的 api，不需要引入库就能使用。<br />Post 请求<br />不过他并不完善，很多情况下需要我们再次封装。

```JavaScript
// jquery ajax
$.post(url, {name: 'test'})
// fetch
fetch(url, {
    method: 'POST',
    body: Object.keys({name: 'test'}).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&')
})
```

由于 fetch 是比较底层的 API，所以需要我们手动将参数拼接成'name=test'的格式，而 jquery ajax 已经封装好了。所以 fetch 并不是开箱即用的。<br />另外，fetch 还不支持超时控制。<br />带 Cookie 发送请求<br />如果我们想要在异步请求中带上 cookie 参数，那么需要显式指定 credentials 参数：

```JavaScript
fetch(url, {
  credentials: 'include'
})
```

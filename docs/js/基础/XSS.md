<h1>XSS</h1>
```js
script src="https://cdn.bootcdn.net/ajax/libs/dompurify/2.3.0/purify.js
```
```js
${DOMPurify.sanitize(data.content[i].mbName)}
```
```js

//昵称输入框的监听
document.querySelector("#name").addEventListener("keydown", debounce(function () {
    const content = DOMPurify.sanitize(this.value.trim());
    if (content.length &lt;= 0) {
        $("#name").popover("show");
    } else if (testEmail($("#emali").val())) {
        $("#name").popover("hide");
        document.querySelector("#submit").className = "btn btn_submit_scuess";
    } else {
        $("#name").popover("hide");
    }
}, 100));
```
<p>转义html</p>
```js
function mdToHtml(markdownText) {

return DOMPurify.sanitize(marked(markdownText, {

    gfm: true

}));

}
```
```js

 ${mdToHtml(data.content[i].mbContent)}
```
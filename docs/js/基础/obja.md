# obj.a 和obj[a] 区别

需求：现需要给对象加个属性值，但是属性值的属性要是动态获取的<br />方案一：<br />假如我们使用obj.a进行赋值
```JavaScript
let Obj = {}
Obj.name = '小明'
```
方案二:<br />此时我们使用obj[a]
```JavaScript
let Obj = {}
let a = 'name'
Obj[a] = '小明'
```
显而易见，方案二符合我们的需求

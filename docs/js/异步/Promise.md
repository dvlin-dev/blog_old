
# Promise
[https://www.wolai.com/pFYQMwgDhT1vkHPgrQgRmo?theme=light](https://www.wolai.com/pFYQMwgDhT1vkHPgrQgRmo?theme=light)
源哥的promise代码⬆<br />[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
[https://github.com/zloirock/core-js/blob/master/packages/core-js/modules/es.promise.js](https://github.com/zloirock/core-js/blob/master/packages/core-js/modules/es.promise.js)
> Promise底层代码，核心可看258行

```javascript
Internal.prototype = redefineAll(PromiseConstructorPrototype, {
    // `Promise.prototype.then` method
    // https://tc39.es/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      // newPromiseCapability 把onFulfilled方法封装成一个自带promise属性的对象
      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = IS_NODE ? process.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify(state, false);
      //如果不做任何操作，则在最后返回一个全新的promise，跟上次promise有不清楚的关系，因为传this了
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.es/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
```
![](./assets/1642059696265-da6f168c-fc80-4ec2-9cf7-665078319d41.png)
```javascript
p = new Promise((resolve,reject) => {
        resolve("success")
    }).then( str => {
        console.log(str)
    }).then(function(obj){
        console.log(typeof obj === 'undefined')
        //此处的this等于p.then返回的promise
        // p等于 p.then.then返回的pomise
        console.log(this === p)
    })
success
true   //obj === 'undefined' 因为虽然返回了Promise,但是没有参数
false
Promise {<fulfilled>: undefined}
[[Prototype]]: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: undefined
```
core-js
```javascript
Internal.prototype = redefineAll(PromiseConstructorPrototype, {
    // `Promise.prototype.then` method
    // https://tc39.es/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = IS_NODE ? process.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify(state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.es/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
   //因为catch === this.then(undefined, onRejected);
   //所以catch下面能一直.then 
   再来个例子：
promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  reject(1); 
}).then(undefined,res =>{
    console.log(res)
  //不return或者return undefined == return一个fulfilled状态的promise
  //(虽然是成功状态，但是里面没有参数) 可以无限.then()
})
// !!此时 下面的代码块就等于 .catch
.then(undefined,res =>{
    console.log(res)
})
//因为
'catch': function (onRejected) {
    return this.then(undefined, onRejected);
 }
```
案例
```javascript
let p = new Promise((resolve,reject) => {
        resolve("success")
    }).then( str => {
        console.log(str)
    }).then(function(obj){
        console.log(1)
        return Promise  
        // 如果上一行不renturn 东西，只要不报错，不返回错误状态的promise 
        // 就等于返回一个新的没有传值的promse
    }).then(function(obj){
        console.log(2)
    }).then(function(obj){
        
    }).then(function(obj){
        
    })
success
1
2
```
```javascript
let p = new Promise((resolve,reject) => {
        resolve("success")
    }).then( str => {
        console.log(str)
    }).then(function(obj){
        console.log(1)
        return new Promise(() => {
            //此处一直处于padding状态 所以也不会向下执行
        })
        //不传参数报错，Promise解析器未定义不是一个函数
        //Promise resolver undefined is not a function
    }).then(function(obj){
        console.log(2)
    })
    setTimeout(() => {
        console.log(p)
    }, 1000);
success
1
Promise {<pending>}   //一直处于pending状态的promise
[[Prototype]]: Promise
[[PromiseState]]: "pending"
[[PromiseResult]]: undefined
```
```javascript
let p = new Promise((resolve, reject) => {
        resolve("success")
    }).then(() => {
        console.log(1)
    }).then(() => {
        console.log(2)
        return Promise.reject("error")
    }).then(() => {
        console.log(3)
    }).catch(error => {
        console.log(error)
    }).
    // !!!上下同理!!!
    let p = new Promise((resolve, reject) => {
        resolve("success")
    }).then(() => {
        console.log(1)
    }).then(() => {
        console.log(2)
        throw "error"
    }).then(() => {
        console.log(3)
    }).catch(error => {
        console.log(error)
    })
```
tips<br />一、如果Promise 失败，则走reject，返回undefined，下一个then会走成功事件，这个值为undefined
```javascript
axios.get("api").then(
  reponse =>{
    
  },
  error => {
    console.log("api请求失败")
  }
)
 .then(
  reponse =>{
    console.log("success",data)
  },
  error => {
    
  }
)
此时打印的是：
            api请求失败
            success undefined
```
二、中断Promise
```javascript
//返回一个初始化状态的promise即可中断promise
axios.get("api").then(
  reponse =>{
    
  },
  error => {
    console.log("api请求失败")
    return new Promise(()=>{})
  }
)
```
总结
```javascript
1. promise.then (只要不返回错误状态的promise 、抛出错误、返回一直pending的promise)
    他能一直then下去
2. 可以用返回错误状态的promise 、抛出错误、返回一直pending的promise 打断promise的执行，例子见上面三个案例
3. promise.catch 等于执行.then里面的onRejected方法,返回的是一个全新的promise 
   详情可见core-js 他只是给reaction.fail赋值，返回的还是reaction.promise
```
promise里面的回调是立即执行的, 后面的then是在微任务队列里, 微任务产生的微任务还在本轮循环里<br />宏任务先执行, 大于微任务, 宏任务执行一个, 清空微任务队列, 再执行一个宏任务<br />整体js代码就是一个宏任务, 所以整体先执行, 遇见promise执行里面回调函数, then放在微任务里<br />然后继续执行同步代码<br />整体执行结束, 一个宏任务执行完了, 清空微任务<br />然后再执行宏任务

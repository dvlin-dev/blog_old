# Promise 的链式调用，和 axios 处理高并发

```JavaScript
axios.get( api1 )
  .then( d1 ){
     return axios.get( api2 )
   }
  .then( d2 ){
     return axios.get( api3 )
  }
  .then ( d3 ){
    return axios.get( api4 )
  }
```

与下面的有什么不同

```JavaScript
axios.get( api )
  .then( data ){
    return new Promise((res,rej)=>{
      axios.get( api2 )
        .then ( data2 ){
           res(data2)
         }
    })
  }
  .then( data3 ){
    console.log( data3)
  }
```

自己的答案<br />多创建了个 Promise 对象<br />![](../assets/1642059696265-da6f168c-fc80-4ec2-9cf7-665078319d41.png)
可以先处理数据，再把返回的处理好的数据

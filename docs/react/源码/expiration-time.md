React 这么设计抹相当于抹平了25ms内计算过期时间的误差，那他为什么要这么做呢？看到LOW_PRIORITY_BATCH_SIZE这个字样，bacth，是不是就对应batchedUpdates？再细想了一下，这么做也许是为了让非常相近的两次更新得到相同的expirationTime，然后在一次更新中完成，相当于一个自动的batchedUpdates。<br />多次调用的setState的任务，前一个state和后一个state还是会有毫秒级别的差距。<br />所以要用一个时间间断去计算。<br />但是他的expirationTime是和now()去比较。<br />也就意味着<br />时间戳在0-249的expirationTime是相同的。<br />在250-499的expirationTime是相同的。<br />多次setState 以同一个优先级执行，防止多次执行 影响效率

## 种类
Sync 模式 直接执行<br />异步模式 可能会被中断<br />指定context 

 flushSync 可以强制指定为Sync模式,提高优先级,直接执行

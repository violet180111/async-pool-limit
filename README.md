# Concurrent-Limit

一个 promise 并发调度器(a promise based concurrent scheduler)

# option

| param  |                                     description                                     |   type   |
| ------ | :---------------------------------------------------------------------------------: | :------: |
| limit  |                      最大并发数(Maximum number of concurrent )                      |  number  |
| values |                                 源数据(Source Data)                                 |  array   |
| pCtor  |                创建 promise 的函数(Functions for creating a promise)                | function |
| cb     | 每个 promise 成功或者失败的回调(Callback after success or failure of each promise ) | function |

# Usage

```js
const timeout = time => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });
};

scheduler({
  limit: 2,
  values: [10, 50, 30, 20],
  pCtor: timeout,
  cb: res => {
    console.log(res);
  },
});

// 10 30 50 20
```

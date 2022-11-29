# Promise 规范

## 术语
1. Promise: 是一个有then方法的对象或函数，行为遵循本规范
2. thenable：是一个then方法的函数或对象
3. value： Promise状态成功的值，**resolve**的参数，number，boolean， undefined，promise
4. reason：Promise状态失败的值，**reject**的参数，表示拒绝的原因
5. exception：异常值

## 规范
### Promise states

三种状态
1. pending
    1.1 初始状态，可改变
    1.2 一个promise在resolve或reject之前处于这个状态
    1.3 通过resolve：pending -> fulfilled状态
    1.4 通过reject：pending -> rejected状态

2. fulfilled
    2.1 最终状态，不可变
    2.2 一个promise被 resolve 之后变成这个状态
    2.3 必须有value

3. rejected
    2.1 最终状态，不可变
    2.2 一个promise被 reject 之后变成这个状态
    2.3 必须有reason值


pending -> resolve(value) -> fulfilled
pending -> reject(reason) -> rejected

### then
promise应该有一个then方法，用来访问最终的结果

    ```js
    promise.then(onFulfilled, onRejected)
    ```

1. 参数要求
    1.1 onFulfilled 必须是一个函数，如果不是函数，应该被**被忽略**
    1.2 onRejected 必须是一个函数，如果不是函数，应该被**被忽略**

2. onFulfilled 特性
    2.1 promise 变成 fulfilled 时， 应该调用onFulfilled， 参数value
    2.2 promise 变成 fulfilled 之前，不能被调用
    2.3 只能被调用一次


3. onRejected 特性
    3.1 promise 变成 rejected 时， 应该调用 onRejected， 参数reason
    3.2 promise 变成 rejected 之前，不能被调用
    3.3 只能被调用一次

4. onFulfilled/onRejected 执行环境应该是**微任务**里

    ```js
    // 浏览器封装好了，
    queueMicroTask(() => {

    })

    // setTimeout是宏任务
    ```

5. then方法可以被调用多次
    ```js
    const promise1 = new Promise();
    // 按调用顺序来
    promise1.then(cb1, cb2)
    promise1.then(cb1, cb2)
    promise1.then(cb1, cb2)
    promise1.then(cb1, cb2)

    [onFulfilled1, onFulfilled2, onFulfilled3...]
    [onRejected1, onRejected2, onRejected3..]
    ```

    5.1 promise的状态变成fulfilled后，所有的 onFulfilled 回调都需要按照then的顺序执行
    5.2 promise的状态变成rejected后，所有的 onRejected 回调都需要按照then的顺序执行


6. 返回值
    then 返回值应该是一个promise，**是一个新的promise**
    ```js
    const promise1 = new Promise((resolve, reject) => {})

    const promise2 = promise1.then(cb1, cb2).then().then()
    ```
    6.1 onFulfilled或者onRejected执行结果为x，调用 resolvePromise()
    6.2 onFulfilled或者onRejected执行报错了，promise2就需要被reject
    6.3 onFulfilled 不是一个函数，promise2 以 promise1 的 value，触发fulfilled
    6.4 onRejected 不是一个函数，promise2 以 promise1 的 reason，触发rejected

7. resolvePromise
    ```js
    resolvePromise(promise2, x, resolve, reject)
    ```
    7.1 promise2 === x， reject typeError
    7.2 如果x是一个promise，
        pending
        fulfilled
        rejected
    7.3 object / function
        let then = x.then

        then如果是函数： then.call(x)
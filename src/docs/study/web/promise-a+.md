# Promise/A+ 规范

`Promise` 是 `TC39` 委员会制定的范式；我们在 `JavaScript` 中使用的 `Promise` 对象其实是 `A+` 规范的实现，我们把这种规范称为 `Promise/A+` 规范。

## Promise 是什么？

`Promise` 是一种现代化的异步实现方案，它许给我们一个承诺，承诺可能会兑现，也有可能会拒绝；承诺之后将会做一些异步的操作，结束后将会返回成功或失败，以方便下一个承诺的进行。

## Promise 的简单运用

```javascript
new Promise((resolve, reject) => {
  Math.random() > 0.5 ? reject('error') : resolve('success')
}).then(
  res => {
    console.log(res)
  },
  err => {
    console.log(err)
  }
)
```

注意以上的这个示例没有任何问题，这也是 `Promise` 正确的用法，也会你会拥有疑问但是没关系，继续看下去你将能理解。

## Promise/A+ 规范内容

`Promise` 拥有三种状态

`PENDING` 是在 `resolve` 或 `reject` 之前之前的等待状态，是初始的状态。

`FULFILLED` 是在被 `resolve` 后的状态，意味着操作成功完成，这个状态必须拥有不可变的值`（value）`。

`REJECTED` 是在被 `rejcet` 后的状态，意味着操作失败，这个状态必须拥有不可变的拒绝原因`（reason）`。

```javascript
// 定义Promise的状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor() {
    // 默认状态
    this.status = PENDING
    // 成功的值，默认为 undefined
    this.value = undefined
    // 失败的值，默认为 undefined
    this.reason = undefined
  }
}
```

`Promise` 中通过 `resolve`、`reject` 分别将状态推向成功或失败。

根据规范，`resolve` 将状态改为 `FULFILLED`，`reject` 将状态改为 `REJECTED`。

```javascript
class MyPromise {
  constructor() {
    // 默认状态
    this.status = PENDING;
    // 成功的值，默认为 undefined
    this.value = undefined;
    // 失败的值，默认为 undefined
    this.reason = undefined;

    // 成功处理
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
      }
    };

    // 失败处理
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
      }
    };
  }

  // 承诺者通过 resolve 和 reject 兑现或拒绝承诺
  try {
    fn(resolve, reject);
  } catch (error) {
    reject(error);
  }
}
```

`Promise` 必须拥有了 `then` 方法的对象和函数，并接收两个可选参数 `onFulfilled`、`onRejected`；

`onFulfilled` 在承诺兑现的时候必须被调用，其中第一个参数为 `promise` 的终值 `value`。

`onRejected` 在拒绝兑现承诺的时候必须被调用，其中第一个参数为 `promise` 的拒绝原因 `reason`。

`onFulfilled`、`onRejected` 如果不是函数，其必须被忽略，且只能被调用一次。

```
class MyPromise {
  constructor() {
    // xxx
  }

  // 拥有 then 方法
  then(onFulfilled, onRejected) {
    // 如果 onFulfilled 不是一个函数，给一个默认函数，返回value。
    let realOnFulfilled = onFulfilled;
    if (typeof realOnFulfilled !== "function") {
      realOnFulfilled = (value) => value;
    }
    // 如果 onRejected 不是一个函数，给一个默认函数，返回reason的Error。
    let  = onRejected;
    if (typeof realOnRejected !== "function") {
      realOnRejected = (reason) => {
        throw reason;
      };
    }

    // 如果状态为 FULFILLED，执行 realOnFulfilled 返回 value。
    if (this.status === FULFILLED) {
      realOnFulfilled(this.value);
    }

    // 如果状态为 REJECTED，执行 realOnRejected 返回 reason。
    if (this.status === REJECTED) {
      realOnRejected(this.reason);
    }
  }
}
```

因为根据 `Promise/A+` 的规范，我们需要接受 `onFulfilled`, `onRejected` 两个函数。这也是在文章的开始通过两个函数来进行演示的原因。

```javascript
new MyPromise((resolve, reject) => {
  Math.random() > 0.5 ? reject('error') : resolve('success')
}).then(
  res => {
    console.log(res)
  },
  err => {
    console.log(err)
  }
)
```

此时我们实现了只能处理同步任务的 `Promise`,我们还需要对异步任务支持，在这里通过发布订阅模式解决异步的问题。如果不太熟悉的小伙伴可以阅读上一期的文章《发布订阅模式的实现》

定义 `onFulfilledCallbacks`、`onRejectedCallbacks`用于存放成功和失败的回调。

当遇到异步函数时，`then` 方法执行时 `promise` 的状态为 `PENDING`，先将回调函数存放起来。

等待异步函数执行完毕后执行 `resolve`、`reject` 方法是将 `onFulfilledCallbacks`、`onRejectedCallbacks` 的方法依次执行。

```javascript
class MyPromise {
  constructor(fn) {
    // 默认状态
    this.status = PENDING
    // 成功的值，默认为 undefined
    this.value = undefined
    // 失败的值，默认为 undefined
    this.reason = undefined

    // 存放成功的回调
    this.onFulfilledCallbacks = []
    // 存放失败的回调
    this.onRejectedCallbacks = []

    // 成功处理
    const resolve = value => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value

        // 依次将成功的回调执行
        this.onFulfilledCallbacks.forEach(cb => {
          cb(this.value)
        })
      }
    }

    // 失败处理
    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason

        // 依次将失败的回调执行
        this.onRejectedCallbacks.forEach(cb => {
          cb(this.reason)
        })
      }
    }

    // 承诺者通过 resolve 和 reject 兑现或拒绝承诺
    try {
      fn(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  // 拥有 then 方法
  then(onFulfilled, onRejected) {
    // 如果 onFulfilled 不是一个函数，给一个默认函数，返回value。
    let realOnFulfilled = onFulfilled
    if (typeof realOnFulfilled !== 'function') {
      realOnFulfilled = value => value
    }
    // 如果 onRejected 不是一个函数，给一个默认函数，返回reason的Error。
    let realOnRejected = onRejected
    if (typeof realOnRejected !== 'function') {
      realOnRejected = reason => {
        throw reason
      }
    }
    // 如果状态为 PENDING，说明执行了异步任务，状态未能立即修改，先将回调函数存储起来。
    if (this.status === PENDING) {
      this.onFulfilledCallbacks.push(realOnFulfilled)
      this.onRejectedCallbacks.push(realOnRejected)
    }

    // 如果状态为 FULFILLED，执行 realOnFulfilled 返回 value。
    if (this.status === FULFILLED) {
      realOnFulfilled(this.value)
    }

    // 如果状态为 REJECTED，执行 realOnRejected 返回 reason。
    if (this.status === REJECTED) {
      realOnRejected(this.reason)
    }
  }
}
```

```javascript
new MyPromise((resolve, reject) => {
  // 通过 setTimeout 模拟异步任务
  setTimeout(() => {
    Math.random() > 0.5 ? reject('error') : resolve('success')
  }, 1000)
}).then(
  res => {
    cnsole.log(res)
  },
  err => {
    console.log(err)
  }
)
```

`then` 的返回值必须是一个 `Promise`，并且如果 `onFulfilled`、`onRejected` 报错，`promise2` 必须拒绝执行，并且返回拒绝原因。

以上为基础版本的 `Promise`,当然在 `Promise/A+` 规范中还有很多的细节，有需要了解的可自行网上了解和学习，接下来我们将来继续完善 `Promise` 的一些常用功能。

## catch

发生错误时的回调函数

```javascript
class MyPromise {
  // ...
  catch(onRejected) {
    this.then(null, onRejected)
  }
}
```

## finally

无论 `Promise` 状态的状态如何，都将执行的操作。

```javascript
class MyPromise {
  // ...
  finally(fn) {
    return this.then(
      value => {
        return MyPromise.resolve(fn()).then(() => {
          return value
        })
      },
      error => {
        return MyPromise.resolve(fn()).then(() => {
          throw error
        })
      }
    )
  }
}
```

## resolve

将现有对象转为 `Promise` 对象, 如果 `Promise.resolve` 方法的参数，不是具有 `then` 方法，则返回一个新的 `Promise` 对象，并且它的状态为 `FULFILLED`。

```javascript
class MyPromise {
  // ...
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value
    }

    return new MyPromise(resolve => {
      resolve(value)
    })
  }
}
```

## reject

返回一个新的 `Promise` 实例，该实例的状态为 `REJECTED`。

```javascript
class MyPromise {
  // ...
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason)
    })
  }
}
```

## all

将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。
如果存在任何一个 `reject`，则返回 `reject`，反之 `resolve`。

```javascript
class MyPromise {
  // ...
  static all(promiseList) {
    let result = []

    let promise = new MyPromise((resolve, reject) => {
      promiseList.forEach((promise, idx) => {
        MyPromise.resolve(promise).then(
          value => {
            result[idx] = value
            if (idx === promiseList.length - 1) {
              resolve(result)
            }
          },
          reason => {
            reject(reason)
          }
        )
      })
    })

    return promise
  }
}
```

## reject

将多个 `Promise` 实例，包装成一个新的 `Promise` 实例,返回率先改变状态的实例的结果。

```javascript
class MyPromise {
  // ...
  static race(promiseList) {
    let promise = new MyPromise((resolve, reject) => {
      for (let i = 0; i < promiseList.length; i++) {
        MyPromise.resolve(promiseList[i]).then(
          value => {
            return resolve(value)
          },
          reason => {
            return reject(reason)
          }
        )
      }
    })
    return promise
  }
}
```

## 完整代码

```javascript
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

// 这里我们基于对象来实现
class MyPromise {
  constructor(fn) {
    // 默认状态
    this.status = PENDING
    // 成功的值，默认为 undefined
    this.value = undefined
    // 失败的值，默认为 undefined
    this.reason = undefined

    // 存放成功的回调
    this.onFulfilledCallbacks = []
    // 存放失败的回调
    this.onRejectedCallbacks = []

    // 成功处理
    const resolve = value => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value

        // 依次将成功的回调执行
        this.onFulfilledCallbacks.forEach(cb => {
          cb(this.value)
        })
      }
    }

    // 失败处理
    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason

        // 依次将失败的回调执行
        this.onRejectedCallbacks.forEach(cb => {
          cb(this.reason)
        })
      }
    }

    // 承诺者通过 resolve 和 reject 兑现或拒绝承诺
    try {
      fn(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  // 拥有 then 方法
  then(onFulfilled, onRejected) {
    // 如果 onFulfilled 不是一个函数，给一个默认函数，返回value。
    let realOnFulfilled = onFulfilled
    if (typeof realOnFulfilled !== 'function') {
      realOnFulfilled = value => value
    }
    // 如果 onRejected 不是一个函数，给一个默认函数，返回reason的Error。
    let realOnRejected = onRejected
    if (typeof realOnRejected !== 'function') {
      realOnRejected = reason => {
        throw reason
      }
    }

    // 如果状态为 pending，说明执行了异步任务，状态未能立即修改，先将回调函数存储起来。
    if (this.status === PENDING) {
      let promise2 = new MyPromise((resolve, reject) => {
        this.onFulfilledCallbacks.push(() => {
          try {
            realOnFulfilled(this.value)
          } catch (error) {
            reject(error)
          }
        })

        this.onRejectedCallbacks.push(() => {
          try {
            realOnRejected(this.reason)
          } catch (error) {
            reject(error)
          }
        })
      })
      return promise2
    }

    // 如果状态为 fulfilled，执行 realOnFulfilled 返回 value。
    if (this.status === FULFILLED) {
      let promise2 = new MyPromise((resolve, reject) => {
        try {
          realOnFulfilled(this.value)
        } catch (error) {
          reject(error)
        }
      })
      return promise2
    }

    // 如果状态为 rejected，执行 realOnRejected 返回 reason。
    if (this.status === REJECTED) {
      let promise2 = new MyPromise((resolve, reject) => {
        try {
          realOnRejected(this.reason)
        } catch (error) {
          reject(error)
        }
      })
      return promise2
    }
  }

  // 发生错误时的回调函数
  catch(onRejected) {
    this.then(null, onRejected)
  }

  // 无论 Promise 状态的状态如何，都将执行的操作。
  finally(fn) {
    return this.then(
      value => {
        return MyPromise.resolve(fn()).then(() => {
          return value
        })
      },
      error => {
        return MyPromise.resolve(fn()).then(() => {
          throw error
        })
      }
    )
  }

  // 将现有对象转为 Promise 对象, 如果 Promise.resolve 方法的参数，不是具有 then 方法，则返回一个新的 Promise 对象，并且它的状态为 fuifilled。
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value
    }

    return new MyPromise(resolve => {
      resolve(value)
    })
  }

  // 返回一个新的 Promise 实例，该实例的状态为 rejected。
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason)
    })
  }

  // 将多个 Promise 实例，包装成一个新的 Promise 实例。
  // 如果存在任何一个 reject，则返回 reject，反之 resolve。
  static all(promiseList) {
    let result = []

    let promise = new MyPromise((resolve, reject) => {
      promiseList.forEach((promise, idx) => {
        MyPromise.resolve(promise).then(
          value => {
            result[idx] = value
            if (idx === promiseList.length - 1) {
              resolve(result)
            }
          },
          reason => {
            reject(reason)
          }
        )
      })
    })

    return promise
  }

  // 将多个 Promise 实例，包装成一个新的 Promise 实例。
  // 返回率先改变状态的实例的结果。
  static race(promiseList) {
    let promise = new MyPromise((resolve, reject) => {
      for (let i = 0; i < promiseList.length; i++) {
        MyPromise.resolve(promiseList[i]).then(
          value => {
            return resolve(value)
          },
          reason => {
            return reject(reason)
          }
        )
      }
    })
    return promise
  }
}
```

## 总结

`Promise` 是基于发布订阅模式实现的。

`then` 方法对于还在 `pending` 的任务，将回调函数 `onFilfilled` 和 `onRejected` 存入数组。

`Promise` 的 `resolve` 、 `reject` 方法将数组中的方法依次执行

`then、catch、finally` 方法会返回一个新的 `Promise` 方法以便链式调用。

## 最后

感谢你的阅读~

如果你有任何的疑问请关注微信公众号后台私信，我们一同探讨交流！

![关注公众号](/assets/subscription.webp)

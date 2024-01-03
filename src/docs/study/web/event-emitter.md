# 设计模式之发布订阅模式

发布订阅模式`EventEmitter`是一种设计模式，它是一种编程思想，它可以帮助我们解决”回调地狱“的问题。`Promise` 也是借鉴了发布订阅设计模式的思想来实现的。

发布订阅模式核心依赖于 `Publisher`（发布者）、`Subscriber`（订阅者）、`Event Channel`（消息中心）

订阅者向消息中心订阅消息，发布者向消息中心发布消息，有消息触发时，消息中心负责通知订阅者。

![发布订阅模式](/assets/web/image.png)

## 实现发布订阅模式

```javascript
class PubSub {
  constructor() {
    // 定义一个消息中心，用于存储消息与订阅者的消息。
    this.events = {}
  }

  // 订阅者
  subscribe(event, callback) {
    // 如果已经有订阅者订阅，直接添加
    if (this.events[event]) {
      this.events[event].push(callback)
    } else {
      // 没有订阅者，以数组的形式放进去
      this.events[event] = [callback]
    }
  }

  // 发布者
  publish(event, ...agrs) {
    const subscribedEnvets = this.events[event]
    // 如果存在订阅者，则一次将消息通知给订阅者
    if (subscribedEnvets && subscribedEnvets.length) {
      subscribedEnvets.forEach(callback => {
        callback.call(this, ...agrs)
      })
    }
  }

  // 取消订阅
  unsubscribe(event, callback) {
    const subscribedEnvets = this.events[event]
    // 如果存在订阅者，则将指定的订阅者移除
    if (subscribedEnvets && subscribedEnvets.length) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }
}
```

```javascript
const pubSub = new PubSub()

// 接受订阅消息的回调函数
const subscribeCallback = message => {
  console.log('message', message)
}

pubSub.subscribe('request', subscribeCallback)
pubSub.publish('request', '收到消息')

// 取消订阅后不会接受消息
pubSub.unsubscribe('request', subscribeCallback)
pubSub.publish('request', '收到消息2')

// log
// message 收到消息
```

## 解决回调地狱

以下代码掩饰了网络请求，第二个网络请求依赖于第一个网络请求，第三个网络请求依赖于第二个网络请求，这就是典型的回调地狱。

```javascript
request('https://www.baidu.com', (error, response) => {
  if (!error && response.statusCode === 200) {
    console.log('request1')
    request('https://www.baidu.com', (error, response) => {
      if (!error && response.statusCode === 200) {
        console.log('request2')
        request('https://www.baidu.com', (error, response) => {
          if (!error && response.statusCode === 200) {
            console.log('request3')
          }
        })
      }
    })
  }
})
```

通过发布订阅模式解决回调地狱的问题，当第一个网络请求成后`request1Success`发布消息，订阅者`request1Success`收到消息后执行请求第二个网络请求，以此类推解决回调地狱的问题。

```javascript
const pubSub = new PubSub()
request('https://www.baidu.com', function (error, response) {
  if (!error && response.statusCode == 200) {
    console.log('request1')
    // 发布请求1成功消息
    pubSub.publish('request1Success')
  }
})

pubSub.subscribe('request1Success', () => {
  request('https://www.baidu.com', function (error, response) {
    if (!error && response.statusCode == 200) {
      console.log('request2')
      // 发布请求2成功消息
      pubSub.publish('request2Success')
    }
  })
})

pubSub.subscribe('request2Success', () => {
  request('https://www.baidu.com', function (error, response) {
    if (!error && response.statusCode == 200) {
      console.log('request3')
      // 发布请求3成功消息
      pubSub.publish('request3Success')
    }
  })
})
```

## 总结

通过发布订阅模式可以解决回调地狱的问题。

发布订阅模式对模块进行了解耦，我们无需关心是否存在订阅者，只需要关心发布出来的事件。

## 最后

感谢你的阅读~

如果你有任何的疑问请关注微信公众号后台私信，我们一同探讨交流！

![关注公众号](/assets/subscription.webp)

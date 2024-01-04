---
keywords: 'Vue,Vue 3,依赖注入,组件通信,组件间通信,组件间通信方式,provide,inject'
---

# provide/inject 依赖注入

在我们日常开发的过程中，我们需要从父组件向子组件传递数据，会使用 `props`。

如果组件层级过多，使用 `props` 沿着组件链逐级传递下去，十分的麻烦。

而在 `Vue` 中使用 `provide` 和 `inject` 来帮助我们解决这一问题。

父组件可以为其所有的后代组件提供依赖，无论层级有多深。

```javascript
import { provide, inject } from 'vue'
```

## provide

`provide` 可以提供一个值，可以被后代组件注入，它是一个后代组件依赖的提供者。

```javascript
// parent.vue
import { provide } from 'vue'

provide('data', {
  name: 'Buerjia',
  age: 23,
})
```

## inject

`inject` 用于声明 `provide` 提供的依赖。

```javascript
// chlid.vue
import { inject } from 'vue'
const data = inject('data')

console.log(data)
// log
// { name: "Buerjia", age: 23 }
```

当父组件没有传入提供给我们相关依赖的情况下，我们还可以为 `inject` 设置默认值。

```javascript
// chlid.vue
import { inject } from 'vue'
const data = inject('data', {
  name: 'jack',
  age: 24,
})

console.log(data)
// log
// { name: "jack", age: 24 }
```

## 思考

在多人协作开发的项目中，我们很难确保 `provide` 提供的 `key` 保持唯一性，那么我们可以这么去解决它呢？

## 使用 Symbol 作为注入名

我们都知道 `es6` 中给我们提供了一个新的数据类型 `Symbol` ，代表着独一无二的值，我们可以将 `Symbol` 作为 `key` 值来比避免谈对协作中的命名冲突。

```typescript
// ./injectionSymbols.ts

export const dataSymbol = Symbol()
```

```javascript
// parent.vue
import { provide } from 'vue'
import { dataSymbol } from './injectionSymbols'

provide(dataSymbol, {
  name: 'Buerjia',
  age: 23,
})
```

```javascript
// child.vue
import { inject } from 'vue'
import { dataSymbol } from '../injectionSymbols'

const data = inject(dataSymbol, {
  name: 'jack',
  age: 24,
})
```

## 响应式的数据注入

`provide` 提供的数据本身就是响应式的，我们只需要修改 `provide` 提供的数即可。

```typescript
// parent.vue
import { ref, provide } from 'vue'
import { dataSymbol } from '../injectionSymbols'
import { dataRaw } from '../types/inject'

const data = ref<dataRaw>({
  name: '',
  age: 18,
})

provide(dataSymbol, data.value)

setTimeout(() => {
  data.value.name = 'Mary'
}, 3000)
```

当我在我们日常的业务场景中我们不仅仅通过父组件去更新状态，我们还需要通过子组件去更新状态。

`Vue` 的官方推荐我们在创建 `provide` 的时候暴露给 `inject` 修改的状态的的方法。

```typescript
// parent.vue
import { ref, provide } from 'vue'
import { dataSymbol } from '../injectionSymbols'
import { dataRaw } from '../types/inject'

const data = ref<dataRaw>({
  name: 'Buerjia',
  age: 18,
})

const updateData = (name: string) => {
  data.value.name = name
}

provide(dataSymbol, {
  data: data.value,
  updateData,
})
```

```typescript
// child.vue
import { inject } from 'vue'
import { dataSymbol } from '../injectionSymbols'

const { data, updateData } = inject(dataSymbol, {
  data: {
    name: 'Jack',
    age: 24,
  },
})

setTimeout(() => {
  updateData && updateData('Mary')
}, 3000)
```

当然有些时候我们并不希望我们的数据被改变，我们使用使用 `readonly()` 来包装，当我们尝试修改时将会失败。

```typescript
// parent.vue
import { ref, provide, readonly } from 'vue'
import { dataSymbol } from '../injectionSymbols'
import { dataRaw } from '../types/inject'

const data = ref<dataRaw>({
  name: 'Buerjia',
  age: 18,
})

provide(dataSymbol, readonly(data.value))
```

```typescript
// child.vue
import { inject } from 'vue'
import { dataSymbol } from '../injectionSymbols'

const data = inject(dataSymbol, {
  name: 'Jack',
  age: 24,
})

data.name = 'Mary'
// [Vue warn] Set operation on key "name" failed: target is readonly.
```

## 为 provide/inject 添加类型

`provide` 和 `inject` 通常在不同组件中运行，所以我们需要为其添加类型支持。

`Vue` 为我们提供了 `InjectionKey` 的类型接口，可以 `provide` 和 `inject` 中同步注入值的类型。

```typescript
import { InjectionKey } from 'vue'
import { dataRaw } from './types/inject'

export const dataSymbol = Symbol() as InjectionKey<dataRaw>
```

## 总结

`provide/inject` 依赖注入相比 `props`，极大的减少了依赖嵌套，使得代码更加的简洁并且利于维护，日常开发中要思考多加思考是否能够依赖注入解决问题。

## 最后

感谢你的阅读~

如果你有任何的疑问请关注微信公众号后台私信，我们一同探讨交流！

![关注公众号](/assets/subscription.webp)

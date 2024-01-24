---
keywords: 'vite,vite插件,rollup,插件,vue3,typescript'
---

# 了解 Vite 插件

众所周知 `Vite` 是基于 `Rollup` 的构建工具，`Vite` 插件为了优化、扩展项目构建系统功能的工具。

比如 `vite-plugin-eslint` 为我们提供了代码分析的功能，帮助我们在开发过程中的风格一致性。

## 简单示例

本文中的示例是基于 `Vite + Vue3.x + TypeScript` 来实现。

插件命名应该遵守社区的规则，如果你的插件不使用 `Vite` 特有的钩子，应该使用 `rollup-plugin-` 作为前缀；反之应该使用 `vite-plugin-` 作文前缀，如果插件只适用于特定的框架，应该使用 `vite-plugin-vue-` 作为前缀。

```typescript
// plugins/vite-plugin-xxx/index.ts
import type { Plugin } from 'vite'

export default (): Plugin => {
  return {
    name: 'vite-plugin-xxx',
    apply: 'serve',
  }
}
```

`apply` 默认在开发 `serve` 和构建 `build` 模式下都会调用。

## 钩子函数

`Vite` 插件的钩子函数可以帮助我们在构建流程中插入自定义的事件逻辑；

由于 `Vite` 是基于 `Rollup` 实现的，所有 `Vite` 在遵循 `Rollup` 构建时的钩子同时为我们提供了 `Vite` 独有的钩子。

## config

`config` 钩子在运行前执行，用于解析与修改 `Vite` 的默认配置。

```typescript
import type { Plugin } from 'vite'

export default (): Plugin => {
  return {
    name: 'vite-plugin-xxx',
    apply: 'serve',
    config(config, { command }) {
      if (command === 'serve') {
        config.server.port = 3000
      }
    },
  }
}
```

以上的示例中，我们对原有配置的默认端口号`5173`修改为`3000`，当然这样的修改毫无意义，因为我们可以在 `vite.config.ts` 中直接去修改端口号，而本篇文章的目的是为了理解 `config` 钩子的作用。

## configResolved

`configResolved` 钩子在解析 `Vite` 配置之后调用，用于获取最终的配置。

在以下的示例中对参数的进行校验以及插件初始化任务的执行。

```typescript
import type { Plugin } from 'vite'

export default (): Plugin => {
  return {
    name: 'vite-plugin-xxx',
    apply: 'serve',
    config(config) {
      console.log('config', config)
    },
    configResolved(resolvedConfig) {
      console.log('configResolved', resolvedConfig)

      // 判断参数是否正确
      if (!resolvedConfig.base) {
        console.error('配置错误')
        return
      }

      // 初始化任务
      // initCoustomPlugin(resolvedConfig)
    },
  }
}
```

## configureServer

`configureServer` 钩子用于配置开发服务器的钩子，我们通常在这里添加自定义的中间件。

在以下的示例中自定义了一个 `/_dev` 的接口，由此可见通过 `configureServer` 钩子可以在开发阶段与项目进行结合，可以扩展前端操作 `os` 等能力。

```typescript
import type { Plugin } from 'vite'

export default (): Plugin => {
  return {
    name: 'vite-plugin-xxx',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/_dev', async (req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end('Hello VitePlugin')
      })
    },
  }
}
```

## configurePreviewServer

`configurePreviewServer` 钩子与 `configureServer` 钩子一样，但 `configurePreviewServer` 用于预览服务器，通过 `vite preview` 命令启动。

```typescript
import type { Plugin } from 'vite'

export default (): Plugin => {
  return {
    name: 'vite-plugin-xxx',
    apply: 'serve',
    configurePreviewServer(server) {
      server.middlewares.use('/_dev', async (req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end('Hello PreviewServer')
      })
    },
  }
}
```

## transformIndexHtml

`transformIndexHtml` 钩子可以动态的修改或者注入 `HTML` 的内容，以及实现自定义的处理逻辑。

比如一下的示例中，我们在 `#app` 的节点下插入了 `loading...` 的文案，由此我们可以扩展更多的玩法，比如注入一些 `loading` 加载的动画。

```typescript
import type { Plugin } from 'vite'

export default (): Plugin => {
  return {
    name: 'vite-plugin-xxx',
    apply: 'serve',
    transformIndexHtml(html) {
      return html.replace('<div id="app">', `<div id="app">loading...`)
    },
  }
}
```

## handleHotUpdate

`handleHotUpdate` 钩子用于自定义执行 `HMR` 热更新的处理。

```typescript
import type { Plugin } from 'vite'

export default (): Plugin => {
  return {
    name: 'vite-plugin-xxx',
    apply: 'serve',
    handleHotUpdate(ctx) {
      // 热更新的文件信息
      console.log(ctx)

      // 热更新自定义事件
      ctx.server.ws.send({
        type: 'custom',
        event: 'custom',
        data: 'custom',
      })
    },
  }
}
```

页面上调用监听，并自定义处理更新的逻辑。

```typescript
if (import.meta.hot) {
  import.meta.hot.on('custom', data => {
    // 执行自定义更新
    console.log(data)
  })
}
```

## 总结

`Vite` 插件系统为开发者提供了丰富的扩展，极大提高了开发的效率以及项目构建时的扩展性。

在日常开发过程中，使用 `Vite` 的插件，编写自己的插件，通过 `Vite` 插件的系统简化工作的流程是非常棒的一件事情。

## 最后

感谢你的阅读~

如果你有任何的疑问请关注微信公众号后台私信，我们一同探讨交流！

![关注公众号](/assets/subscription.webp)

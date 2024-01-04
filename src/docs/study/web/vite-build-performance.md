# 解决前端白屏加载时长问题

据调查研究，当用户打开网页的时长大于 `300ms`，用户可以感知到白屏的存在；当时长大于 `3000ms`，用户会觉得烦躁以及可能会关掉页面。

所以减少页面加载时长是至关重要的工作，从产品角度触发，可以通过骨架屏、舒适的加载动画等行为安抚用户的情绪，那么作为开发者来说，我们可以做哪些事情可以让网页加载时长变得更短呢？

## 性能指标

我们需要查看一些指教，从而来决定我们是否应该去优化以及我们该从那些方向去优化，这很重要！

- **First Paint (FP)**

  首次绘制，从白屏到第一个像素点出现的时间。

- **First Content Paint (FCP)**

  首次内容绘制，网页首次绘制的内容的时间。

- **Speed Index**

  页面加载过程中的视觉显示速度。

- **Largest Contentful Paint (LCP)**

  最大的内容绘制完成的时间。

- **Total Blocking Time (TBT)**

  页面总阻塞的时间。

## 查看指标

- **Lighthouse**

  `Lighthouse` 是性能评测工具，支持`移动端`和`PC端`。

![Lighthouse](/assets/web/vite-build-performance1.png)

- Performance

```javascript
window.performance.timing
// PerformanceTiming{ ... }
```

`Performance` 接口可以获取到当前页面中性能相关的信息。

`Performance.timing` 返回 `PerformanceTiming` 对象，这个对象包含了页面相关的性能信息。

::: tip 参考 MDN Performance

https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceTiming

:::

- rollup-plugin-visualizer / webpack-bundle-analyzer

  打包的时候生成可视化的依赖分析，分别基于 `Rollup` 和 `Webpack`。

![Performance](/assets/web/vite-build-performance2.png)

## 如何优化

- 压缩代码

  清除代码注释、空白字符和未使用的代码等等能够有效的减少 `HTML 、CSS`和`JavaScript` 的前端加载的时间。

- 减少`HTTP`请求

  完整的 `HTTP` 请求需要经过三次握手的过程，`HTTP`请求越多，相对应的花费的时间就越多。

  比如我们可以使用 `CSS Sprites` 或者 `Base64` 来减少图片你的`HTTP`请求。

  比如说我们使用 `SSR` 渲染加快首屏渲染。

- 压缩文件

  通过 `Gzip` 来压缩 `HTML` 、`CSS` 和 `JavaScript` 文件能够有效的较少前端加载的时间。

- 延迟加载

  页面优先展示视窗内可见区内的内容，延迟加载视窗内可见区外的内容。

- `CDN`加速

  `CDN`优先为用户访问最近的`CDN`节点，可以使用户更快的获取到资源。

## 实现思路

### 压缩代码

`Vite` 中默认开启了 `Minify`，并且我们提供了 `terser` 和 `esbuild` 两种打包的方式。

默认为 `esbuild`，它比 `terser` 快 `20-40` 倍，压缩率只差 `1%-2%`。

但使用 `terser` 会被压缩的更小。

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  build: {
    minify: 'terser',
  },
})
```

### 压缩文件

目前现代浏览器都支持 `Gzip` 对数据压缩和解压，开启 `Gzip` 压缩后极大的压缩文件大小，大大缩短了页面的加载时间。

```javascript
// vite.config.ts
import viteCompression from 'vite-plugin-compression'
export default defineConfig({
  plugins: [vue(), viteCompression()],
})
```

> webpack 中可以使用 compression-webpack-plugin 进行 Gzip 压缩文件的打包。

打包出 `Gzip` 压缩后需要在服务器开启 `Gzip` 压缩。

### CDN 加速

无论是通过 `Webpack` 打包还是 `Vite` 打包，也会将我们使用的第三方的包进行打包，这样就进一步的提高了静态资源的体积，严重阻塞了页面的加载，白屏时间过长，给用户造成了非常不好的体验，那怎么样才可以解决这个问题呢？

在 `Vite` 中基于 `Rollup` 进行打包，同时我们也为我们提供了自定义 `Rollup` 的打包配置。

我们在打包的时候对第三方包进行移除，以达到减少 `chunk` 文件的体积的目的。

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['vue', 'vue-router', 'naive-ui', 'axios'],
    },
  },
})
```

移除了第三方包我们还需要通过 `CDN` 的方式引入依赖。

```html
<!-- index.html -->
<script src="https://unpkg.com/vue@3.2.25/dist/vue.global.prod.js"></script>
<script src="https://unpkg.com/vue-router@4.0.0/dist/vue-router.global.prod.js"></script>
<script src="https://unpkg.com/naive-ui@2.30.5/dist/index.js"></script>
<script src="https://unpkg.com/axios@0.27.2/dist/axios.min.js"></script>
```

当然我们在开发模式下不需要引入依赖，我们可以使用 `vite-plugin-html` 插件动态的添加依赖。

```javascript
// vite.config.ts
import { createHtmlPlugin } from 'vite-plugin-html'

let cdn = {
  js: [
    'https://unpkg.com/vue@3.2.25/dist/vue.global.prod.js',
    'https://unpkg.com/vue-router@4.0.0/dist/vue-router.global.prod.js',
    'https://unpkg.com/naive-ui@2.30.5/dist/index.js',
    'https://unpkg.com/axios@0.27.2/dist/axios.min.js',
  ],
}

export default ({ mode }) => {
  // 非生产环境不引入cdn
  if (mode === 'development') {
    cdn = {
      js: [],
    }
  }

  return defineConfig({
    plugins: [
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            injectScript: cdn.js,
          },
        },
      }),
    ],
  })
}
```

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%- title %></title>
    <!-- 循环添加CDN -->
    <% for (var i in injectScript) { %>
    <script src="<%= injectScript[i] %>"></script>
    <% } %>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

> webpack 中可以使用 htmlWebpackPlugin 来实现。

虽然我们已经通过 `CDN` 的方式进行引入，但是我们代码内是通过 `ESM` 的方式进行引入的，而我们不可能手动的去修改整个项目中的所有依赖引入方式，所以我们需要使用 `rollup-plugin-external-globals` 插件用来构建全局依赖。

```javascript
// vite.config.ts
import externalGlobals from 'rollup-plugin-external-globals'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['vue', 'vue-router', 'naive-ui', 'axios'],
      plugins: [
        externalGlobals({
          vue: 'Vue',
          'vue-router': 'VueRouter',
          'naive-ui': 'naive',
          axios: 'axios',
        }),
      ],
    },
  },
})
```

> webpack 中为我们提供了 externals 来实现。

经过以上的操作，我们已经成功的将打包体积从 `3.01MB` 缩小到 `6.78KB`。

![](https://files.mdnice.com/user/32454/67b668a3-ab9a-4bad-9780-a91a0654720f.png)

## 总结

- 对第三方依赖不打包减少代码包的体积。
- 使用 `CDN` 加载静态资源。
- 使用 `Gzip` 压缩减少静态资源的体积。
- 减少 `HTTP` 请求，比如 `CSS Sprites` `Base64` 等。
- 提升用户体验感，让用户感觉变得更快。

## 最后

感谢你的阅读~

如果你有任何的疑问请关注微信公众号后台私信，我们一同探讨交流！

![关注公众号](/assets/subscription.webp)

---
keywords: 'NPM 发布流程,NPM,开源,NodeJs,仓库,发布,npm'
---

# 如何发布 NPM 包

在日常开发过程中，我们经常使用引用一些第三方库来快速的进行项目开发，这得益于前端丰富的生态。

身为前端开发者的我们，可能也会遇到**可复用、可抽离、可封装**的模块，我们将其发布 `NPM` 包是一个很好的选择。

## 注册账号

发布 `NPM` 包，需要先注册 [`NPM` 官网](https://www.npmjs.com/) 的账号，仅需一个邮箱即可。

## 创建 NPM 项目

新建一个文件夹并打开终端初始化项目；

```shell
npm init -y
```

此时会自动生成 `package.json` 的配置文件，这里主要包含了项目名称、版本号、作者、许可证等信息，同时可以记录项目的依赖信息以及自定义的脚本。

```json
{
  "name": "项目名",
  "version": "1.0.0",
  "description": "项目简介",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "rollup -c"
  },
  "keywords": [],
  "author": "不二博客 <buerblog@163.com>",
  "license": "ISC"
}
```

`name` 定义了项目的名称，它不可与现有的 `NPM` 名称重复；

`version` 定义了当前项目的版本号，每一次版本更新需大于当前版本；

`license` 定义了项目的许可证；

`main` 项目的入口文件，即第三方库默认导入的文件；

`types` 项目的类型定义文件；

`files` 定义了发布上传时包含的目录文件；

更多的配置项可以自行查阅资料。

## 打包工具

本文中我们使用 `rollup` 作为我们的打包工具，当然你也可以使用 `vite`、`webpack`、`unbuild` 等等，你可根据个人爱好进行选择。

```shell
yarn add rollup -D
```

当然编写一个完善的 `NPM` 包，我们应该使用 `TypeScript` 来编写。

```shell
yarn add typescript @rollup/plugin-typescript tslib -D
```

## 配置 Rollup

根目录下创建 `rollup.config.js` 配置文件，添加如下配置；

```JavaScript
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: {
    name: '全局变量名称',
    file: 'dist/index.js',
    format: 'umd',
  },
  plugins: [typescript()],
}
```

在以上的配置中，`input` 定义了项目的入口文件、`output` 定义了项目的编译输出的配置；

`name` 在全局的作用域中生成当前项目的全局变量名称；

`file` 指定了输出文件的路径；

`format` 指定输入文件的格式，不同的配置作用于不同的运行环境；

- `amd` 是异步模块加载，可以在运行时按需加载和执行模块，适用于前端；

- `cjs` 将打包 `CommonJS` 规范，适用于 `Node` 环境和其他打包工具；

- `es` 将保留为 `ES` 模块文件，适用于支持 `ES` 模块的环境中直接使用；

- `iife` 将打包为一个立即执行的函数，适用于 `<script>` 标签，变量与函数将在内部作用域运行；

- `umd` 客户端与服务端通用，同时支持 `amd`，`cjs` 和 `iife`；

更多配置可查看 [Rollup 配置选项](https://cn.rollupjs.org/configuration-options/) 官方文档。

## 配置 TypeScript

根目录下创建 `tsconfig.json` 配置文件，添加如下配置；

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "ESNext",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "moduleResolution": "node",
    "declaration": true,
    "outDir": "dist"
  }
}
```

`moduleResolution` 使用 `Node.js` 作为模块解析策略；

`declaration` 用于是否生成类型声明文件 `（.d.ts 文件）`；

`outDir` 用于配置编译文件的输出目录。

## 编写库

编写自己的库，在以下的示例中我们将 `dayjs` 进行导出；

```shell
yarn add dayjs
```

```typescript
import dayjs from 'dayjs'

export default {
  dayjs,
}
```

## 打包

`rollup` 是通过 `rollup -c` 的命令进行打包的，在前面的 `package.json` 配置中已经配置脚本命令，我们只需要运行如下命令即可。

```shell
yarn build
```

此时根据 `rollup.config.js` 和 `tsconfig.json` 配置，分别在 `dist` 文件夹内产出 `index.js` 和 `index.d.ts` 文件。

## 发布流程

添加并登录 `NPM` 账户，如果是第一次登录执行如下命令，输入账号密码和邮箱进行登录；

```shell
npm login
```

如果你设置了第三方的镜像（淘宝源）的地址，此时我们需要切换为 `NPM` 官方的源；如果没有可以忽略这一步；

```shell
npm config set registry=https://registry.npmjs.org/
```

一切准备就绪后通过执行如下命令进行发布上传；

```shell
npm publish
```

等待上传成功后，我们可以在 `NPM` 里面可以查询到我们的 `NPM` 包，同时也可以引入到你的项目中使用；

```shell
npm install 项目名
```

## 总结

本文中完整的记录了 `NPM` 包发布的流程，如果你在日常开发过程中遇到能够复用、抽离与封装的功能模块，尝试将其贡献出来吧~

## 最后

感谢你的阅读~

如果你有任何的疑问请关注微信公众号后台私信，我们一同探讨交流！

![关注公众号](/assets/subscription.webp)

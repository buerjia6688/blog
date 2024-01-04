---
keywords: 'Plop,Plopjs,后台管理系统,代码模板,代码生成器'
---

# Plop 简化重复工作流

在我们日常开发的过程中经常会新建一下文件，并且页面的结构十分相符合；我们一般通过复制粘贴的形式去创建文件和结构。

为此我们是否应该将这种重复机械的工作交给工具，解放自己的双手呢？

`plop` 是一款项目模板生成器，并且它是命令式可交互的，可以通过一行代码生成我们想要的结构。

## 初体验

```shell
yarn add plop -D
```

### 添加配置

创建一个 `profile.js` 在你的项目根目录，`plop` 会根据你的 `profile.js` 的配置生成文件。

```javascript
// profile.js
module.exports = function (plop) {
  plop.setGenerator('Basics', {
    description: '创建一个基础模板',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '请输入你的姓名',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/pages/index.vue',
        templateFile: 'plop-templates/controller.hbs',
        data: {
          name: this.name,
        },
      },
    ],
  })
}
```

### 添加模板

在根目录创建 `plop-templates/controller.hbs` 的模板文件，这个文件已经被 `profile.js` 文件引用。

```html
// plop-templates/controller.hbs
<template>
  <div>Hello, {{name}}</div>
</template>
```

### 设置脚本

添加执行脚本，在 `package.json => scripts` 中添加命令

```json
// package.json
"scripts": {
  "plop": "plop"
},
```

### 运行 plop

运行命令将会根据 `profile.js` 的配置文件运行在指定的路径生成指定的模板文件。

```shell
yarn plop

# $ plop
# ? 请输入你的姓名 不二博客
# ✔  ++ \src\pages\index.vue
# Done in 11.28s.
```

```html
// /src/pages/index.vue
<template>
  <div>Hello, 不二博客</div>
</template>
```

以上就是 `plop` 的简单应用，接下来我们学习一下常用的 `api` 和属性，让 `plop` 变得更加强大！

## 创建生成器 setGenerator

`setGenerator` 用于创建生成器，用于用户交互式选择生成器，当 `plop` 只有一个生成器的情况下，直接跳过选择。

```json
// profile.js
module.exports = function (plop) {
  plop.setGenerator("Basics Page", {
    description: "创建一个页面",
    // ...
  });
  plop.setGenerator("Basics Component", {
    description: "创建一个组件",
    // ...
  });
};
```

```shell
yarn plop

# ? [PLOP] Please choose a generator. (Use arrow keys)
# > Basics Page - 创建一个页面
#   Basics Component - 创建一个组件
```

## 交互式命令配置 prompts

`prompts` 是可交互式命令的配置，通过配置我们可以输入和选择模板的配置项。

`plop` 使用 `Inquirer` 这个库来捕获用户输入，他支持 `input, number, confirm, list, rawlist, expand, checkbox, password, editor` 类型的输入。

```json
// profile.js
module.exports = function (plop) {
  plop.setGenerator("Basics Page", {
    description: "创建一个页面",
    prompts: [
      {
        type: "input",
        name: "pageName",
        message: "请输入你的页面名称",
      },
      {
        type: "confirm",
        name: "hasTs",
        message: "是否使用TypeScript",
      },
    ],
  });
};
```

```shell
yarn plop
# $ plop
# ? 请输入你的页面名称 home
# ? 是否使用TypeScript Yes
```

## 执行 actions

`plop` 会通过 `actions` 的配置项去生成对应的模板，同时也可以获取到 `prompts` 用户输入的参数。

```json
// profile.js
module.exports = function (plop) {
  plop.setGenerator("Basics Page", {
    description: "创建一个页面",
    prompts: [
      {
        type: "input",
        name: "pageName",
        message: "请输入你的页面名称",
      },
      {
        type: "confirm",
        name: "hasTs",
        message: "是否使用TypeScript",
      },
    ],
    actions: (data) => {
      // 命令行的配置
      const { pageName, hasTs } = data;
      let _options = [
        {
          type: "add",
          path: `src/pages/${pageName}.vue`,
          templateFile: "plop-templates/controller.hbs",
          // 将参数传给模板
          data: {
            name: pageName,
            hasTs,
          },
        },
      ];

      // 根据配置项动态添加需要生成的模板文件
      if (hasTs) {
        _options.push({
          type: "add",
          path: `src/pages/${pageName}.ts`,
          templateFile: "plop-templates/ts.hbs",
        });
      }

      return _options;
    },
  });
};
```

## 模板文件 hbs

在模板文件中我们可以获取到 `actions` 传递当模板的参数，并且进行进一步的处理。

```html
<template>
  <div>
    {{!-- 这里是传递的name值 --}}
    Hello, {{ name }}
  </div>
</template>

{{!-- 这里通过 if 判断动态渲染 --}}
<script{{#if hasTs}} lang="ts"{{/if}}>

</script>
```

## 总结

通过命令式交互，简化工作流程，拒绝复制粘贴，减少重复机械性的工作，同时也能统一团队代码的一致性，是前端工程化实践中值得去尝试的工具。

## 最后

感谢你的阅读~

如果你有任何的疑问请关注微信公众号后台私信，我们一同探讨交流！

![关注公众号](/assets/subscription.webp)

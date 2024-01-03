# 配置 Git Husky 代码提交约束

`Git Husky` 是一个可以管理 `Git Hooks` 的工具，它可以帮助我们在代码提交的时候运行脚本，以确保代码提交符合特定的规范和约定。

在 `Git` 中，允许在操作特定的事件时执行特定的脚本，这些事件我们称之为 `Hooks`。

`Git Husky` 利用这些 `Hooks` 实现了在代码提交前、提交信息规范校验等自动化运行脚本的功能。

## 安装

```shell
yarn add husky -D
```

首先我们需要在项目内安装 `husky`，并且初始化。

## 添加配置

```shell
npx husky install
```

执行 `npx husky install` 将会生成 `./husky` 的文件夹，在这里我们可以配置 `Git Hooks` 的脚本文件。

## 初始化

```shell
npm pkg set scripts.prepare="husky install"
```

执行 `npm pkg set scripts.prepare="husky install"` 将会设置 `prepare` 的脚本，并将该脚本的执行命令设置为 `husky install`，它将会在项目启动时初始化 `Git Husky`。

## 添加 pre-commit hook

```shell
npx husky add .husky/pre-commit
```

执行 `npx husky add .husky/pre-commit` 将会生成脚本 `./husky/pre-commit` ，它会在 `git commit` 之前执行脚本，如果脚本报错的情况下将无法提交。

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

undefined
```

## 配置执行脚本

在我们常用的场景中，我们需要在 `git commit` 之前对脚本进行代码规范的检测。

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
```

我们将命令修改以上配置，它将会在 `git commit` 之前执行 `npm run lint` 命令来执行 `eslint` 代码检测，如果检测不通过将会拒绝提交。

当然你也可以通过 `npx husky add .husky/pre-commit "npm run lint"` 命令直接生成脚本。

## 添加 commit-msg hook

```shell
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

`commit-msg hooks` 用于提交信息被保存之后运行。

## 添加 commitlint 校验

```shell
yarn add @commitlint/cli -D
```

我们通常使用 `commitlint` 工具对提交信息格式进行校验，所以我们需要安装 `@commitlint/cli` 。

## commitlint 常用配置

```shell
yarn add @commitlint/config-conventional -D
```

`@commitlint/config-conventional` 是一个符合提交信息规范的配置，我们可以直接使用。

在 `@commitlint/config-conventional` 的规范中，为我们提供了一下规则。

| 分类     | 描述               |
| -------- | ------------------ |
| feat     | 新特性             |
| fix      | 修复 bug           |
| perf     | 性能优化           |
| refactor | 代码重构           |
| build    | 外部依赖项的更改   |
| chore    | 测试文件的更改     |
| ci       | 修改构建配置或脚本 |
| docs     | 仅文档修改         |
| revert   | 撤销之前的提交     |
| test     | 添加或修正测试用例 |

新建文件 `commitlint.config.cjs` 导入 `@commitlint/config-conventional` 规则。

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
```

## 测试

```shell
git commit -m '修复了bug' // ×
git commit -m 'fix: 修复了bug' // √
```

通过分别执行以上代码我们发现，当提交的信息不符合规范时，`Git Hooks` 拒绝了我们的提交。

## 总结

`Git husky` 是一个 `Git hooks` 管理的工具，它可以帮助我们在代码提交时运行脚本，确保代码提交符合特定的规范和约定。

- 通过 `husky` 可以自动化地运行脚本，避免了手动操作的繁琐性，提高了效率。

- 在代码提交前、提交信息保存后等多个阶段进行校验和处理，保证了代码质量和规范性。

- 可以结合其他工具和规范进行使用，如 `ESLint`、`Prettier`、`commitlint` 等，增加了灵活性和可扩展性。

## 最后

感谢你的阅读~

如果你有任何的疑问请关注微信公众号后台私信，我们一同探讨交流！

![关注公众号](/assets/subscription.webp)

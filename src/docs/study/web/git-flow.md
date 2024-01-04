---
keywords: 'Git,Git Flow,工作流,版本控制,版本控制工具,版本控制系统'
---

# Git Flow 工作流

`Git flow` 是一种基于分支模型的工作流程规范，它强化了分支模型的使用。

它基于两个主要分支：`master` 和 `develop`，以及一系列支持分支，如 `feature`、`release` 和 `hotfix` 分支。

## 初始化 Git Flow

执行 `git flow init` 初始化工作流，将创建 `master`、`develop` 分支，并切换到 `develop` 分支。

```shell
git flow init
```

`master` 分支是正式对外发布的分支，只有经过了审核和测试，才会被合并到 `master` 分支。

`develop` 分支是从 `master` 分支创建出来的，所有的工作都需要合并在此分支，记录了详细的提交记录。

## 创建 feature 分支

`feature` 分支是从 `develop` 分支创建出来的，新特性都有自己的 `feature` 分支，用作开发当前特性相关的工作。

当我们开始进行新特性的开发的时候，我们需要执行以下的命令创建 `feature` 分支：

```shell
git flow feature start feature_0.0.1

# 等价于
git checkout develop
git checkout -b feature_0.0.1
```

此命令为我们创建了 `feature/feature_0.0.1` 分支，接下来我们将在此分支中进行相关特性的开发工作。

## 完成 feature 分支

在相关特性的工作完成后，执行以下命令：

```shell
git flow feature finish feature_0.0.1

# 等价于
git checkout develop
git merge feature_0.0.1
```

标志的相关特性的工作已经完成，当前的代码合并到 `develop` 分支，`feature/feature_0.0.1` 分支将会被删除。

## 创建 release 分支

`release` 分支是预发布分支，此分支一般是进行功能修复工作，不建议加入新的特性工作。

当工作完成后我们需要进行测试，我们需要创建 `release` 分支，执行以下命令：

```shell
git flow release start 0.0.1

# 等价于
git checkout develop
git checkout -b release/0.0.1
```

## 完成 release 分支

当所有的测试修复工作已完成，并且达到了交付标准的时候，执行以下命令：

```shell
git flow release finish 0.0.1

# 等价于
git checkout master
git merge release/0.0.1
git checkout develop
git merge release/0.0.1
git branch -D release/0.0.1
```

此时标志着当前特性的工作已经结束，当前的代码合并到 `develop` 分支和 `master` 分支，创建 `0.0.1` 的特性标签，`release/0.0.1` 分支将会被删除。

## 创建 hotfix 分支

`hotfix` 分支是维护生产分支，在生产环境中可能会遇到一些紧急的问题需要修复，执行以下命令来创建 `hotfix` 分支：

```shell
git flow hotfix start hotfix_branch

# 等价于
git checkout master
git checkout -b hotfix/hotfix_branch
```

## 完成 hotfix 分支

当生产修复工作已完成的时候，执行以下命令：

```shell
git flow hotfix finish hotfix_branch

# 等价于
git checkout master
git merge hotfix_branch
git checkout develop
git merge hotfix_branch
git branch -D hotfix_branch
```

此时与 `release` 分支类似，`hotfix` 分支会合并到 `master` 分支和 `develop` 分支中，创建 `hotfix_branch` 的特性标签，`hotfix/hotfix_branch` 分支将被删除。

## 总结

`Git Flow` 基于分支管理更符合工作流程中的开发、迭代和修复，同时对工作流程进行统一的规范，在项目开发过程是非常中值得尝试的。

## 最后

感谢你的阅读~

如果你有任何的疑问请关注微信公众号后台私信，我们一同探讨交流！

![关注公众号](/assets/subscription.webp)

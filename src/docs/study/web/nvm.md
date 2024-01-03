# 通过 nvm 管理 Node 版本

在我们的开发过程中我们经常会遇到不同项目对 `Node` 的版本可能不同，重新安装指定的 `Node` 版本过程比较繁琐，我们可以使用 `nvm` 来管理我们的 `Node` 版本。

`nvm` 就是一个 `Node` 版本管理器，它可以在一台机器上安装和切换多个 `Node` 的版本，本文介绍了不用环境下的 `nvm` 的安装以及 `nvm` 的运用。

## 安装环境

在 `Windows` 环境下，我们通过下载 [nvm-windows Github](https://github.com/coreybutler/nvm-windows/releases) 进行安装；

在 `Mac` 环境下我们使用 `HomeBrew` 进行安装 `nvm` ，执行以下的命令

```shell
brew install nvm
```

安装完成后需要进行一下配置，复制以下命令执行

```shell
echo "source $(brew --prefix nvm)/nvm.sh" >> .bash_profile
```

终端执行 `nvm -v` 出现版本号代表安装成功。

## 查看 nvm 已安装的版本

```shell
nvm list
# 简写 nvm ls
```

## nvm 安装 Node

```shell
# 安装最新稳定版本
nvm install stable

# 安装指定版本
# nvm install <version>
nvm install 18.0.0
```

## 切换指定 Node 版本

```shell
# nvm use <version>
nvm use 18.0.0
```

## 删除指定 Node 版本

```shell
# nvm uninstall <version>
nvm uninstall 18.0.0
```

## 显示当前的版本

```shell
nvm current
```

## 总结

`nvm` 很好的帮助我们进行了 `Node` 版本的管理，同时使用起来非常简单方便。

## 最后

感谢你的阅读~

如果你有任何的疑问请关注微信公众号后台私信，我们一同探讨交流！

![关注公众号](/assets/subscription.webp)

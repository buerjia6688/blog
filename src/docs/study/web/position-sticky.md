# 你可能真的不会 sticky

`position: sticky` 是开发中相对高频的一个用法，不过在最近的项目中竟然被我玩翻车了，设置了`sticky`尽然不生效了，于是便想一探究竟。

::: tip MDN 参考

元素根据正常文档流进行定位，然后相对它的最近滚动祖先（nearest scrolling ancestor）和 containing block（最近块级祖先 nearest block-level ancestor），包括 table-related 元素，基于 top、right、bottom 和 left 的值进行偏移。偏移值不会影响任何其他元素的位置。 该值总是创建一个新的层叠上下文（stacking context）。注意，一个 sticky 元素会“固定”在离它最近的一个拥有“滚动机制”的祖先上（当该祖先的 overflow 是 hidden、scroll、auto 或 overlay 时），即便这个祖先不是最近的真实可滚动祖先。这有效地抑制了任何“sticky”行为。

:::

## sticky 的正常效果

```vue
<div class="content-wrap">
  <div class="content">
    <div class="top">顶部区域</div>
    <div class="sticky">粘性布局</div>
    <div class="bottom">底部区域</div>
  </div>
</div>

<style>
  .top {
    height: 100px;
    text-align: center;
    background-color: gray;
  }

  .bottom {
    height: 2000px;
    background-color: paleturquoise;
  }

  .sticky {
    height: 30px;
    background-color: red;
    position: sticky;
    top: 0px;
  }
</style>
```

![position-sticky](/assets/web/position-sticky1.gif)

## 失效的原因

### sticky 设置了非滚动父元素。

```html
<div class="prent">
  <div class="sticky">粘性布局</div>
</div>
```

当我们将为`sticky`元素设置了父组件时，也就是`sticky`的父元素不为`body`根元素时，此时的`sticky`定位时相对于`prent`元素的

![position-sticky](/assets/web/position-sticky2.gif)

当然现在我们还没有办法去理解这样的一个行为，我们来给`prent`加一点高度再来看一看

```css
.prent {
  border: 2px solid yellow;
  height: 200px;
  background-color: #aaaaaa;
}
```

![position-sticky](/assets/web/position-sticky3.gif)

有趣的是，当元素滑动到`prent`时，`sticky`元素开始生效了；

当我们继续向下滑动到`bottom`时，`sticky`元素随着`prent`元素离开了页面。

那么我们就可以得出结论，`sticky`元素的定位时相对于父级元素的，并且父级元素需要为可滚动的元素

### 父元素设置 overflow

前面说道，当`sticky`脱离了文档流，使用`overflow`属性的以下`hidden`, `scroll`, `auto`, 或 `overlay`时会阻止元素的定位。

```css
.prent {
  border: 2px solid yellow;
  height: 200px;
  background-color: #aaaaaa;
  overflow: hidden;
}
```

## 总结

1、使用`sticky`是父级元素需要拥有滚动机制

2、使用`sticky`不使用`overflow`的属性

## 最后

感谢你的阅读~

如果你有任何的疑问请关注微信公众号后台私信，我们一同探讨交流！

![关注公众号](/assets/subscription.webp)

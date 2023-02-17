## 前端性能相关
### 如何分析前端性能
<img src="../asset/display/performance.webp" />

实际上的加载过程主要是三个阶段：
1. 导航阶段，该阶段主要是从网络进程接收 HTML 响应头和 HTML 响应体。
2. 解析 HTML 数据阶段，该阶段主要是将接收到的 HTML 数据转换为 DOM 和 CSSOM。
3. 生成可显示的位图阶段，该阶段主要是利用 DOM 和 CSSOM，经过计算布局、生成层树 (LayerTree)、生成绘制列表 (Paint)、完成合成等操作，生成最终的图片。

<img src="../asset/display/event.png" />

### 对性能的影响
1. 重排和重绘
一般情况下，样式的写操作之后，如果有下面这些属性的读操作，都会引发浏览器立即重新渲染。
- offsetTop/offsetLeft/offsetWidth/offsetHeight
- scrollTop/scrollLeft/scrollWidth/scrollHeight
- clientTop/clientLeft/clientWidth/clientHeight
- getComputedStyle()
比如如下的代码：
```js
div.style.color = 'blue';
// 第二步需要获取到元素的值，所以会强制重排.
var margin = parseInt(div.style.marginTop);
div.style.marginTop = (margin + 10) + 'px';
```
因此上诉的操作会导致两次重排，所以在书写的时候要尽量做到 读写分离。比如下面这种：
```js
div.style.left = div.offsetLeft + 10 + "px";
div.style.top = div.offsetTop + 10 + "px";
```
这种就是错误示范，因为浏览器自己会尽量把所有的变动集中在一起，排成一个队列，然后一次性执行，避免多次重新渲染。但是上面写法会使每一次写操作强制执行，因为里面有读操作，需要获取到当前的样式。

所以我们在使用到一些会引发重排，重绘的读操作时因该分开写。或者使用`requestAnimationFrame`将写操作推到下一帧执行
```js
function doubleHeight(element) {
  var currentHeight = element.clientHeight;
  element.style.height = (currentHeight * 2) + 'px';
}
elements.forEach(doubleHeight);
```


### will-change

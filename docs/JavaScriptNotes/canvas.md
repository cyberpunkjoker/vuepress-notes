## canvas
:::tip
1. `<canvas>` 标签只有两个属性—— width和height(默认为 300*150)
2. `</canvas>` 结束标签不可省
3. canvas起初是空白的。为了展示，首先脚本需要找到渲染上下文，然后在它的上面绘制。
:::
渲染上下文方法
```js
var canvas = document.getElementById('tutorial');
var ctx = canvas.getContext('2d');
```

### 绘制图形的方式
1. 绘制矩阵
canvas提供了三种绘制矩形的方式:
```js 
// 绘制一个填充的矩形
fillRect(x, y, width, height)
// 绘制一个矩形的边框
strokeRect(x, y, width, height)
// 清除指定矩形区域，让清除部分完全透明。
clearRect(x, y, width, height)
//Demo
ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
ctx.fillRect (0, 0, 50, 50);
ctx.clearRect(0,0,10,10)
```
2. 绘制路径
- 首先，你需要创建路径起始点。
- 然后你使用画图命令去画出路径。
- 之后你把路径封闭。
- 一旦路径生成，你就能通过描边或填充路径区域来渲染图形。

所要用到的函数:

`beginPath()`:
新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。

`closePath()`:
闭合路径之后图形绘制命令又重新指向到上下文中。

`stroke()`:
通过线条来绘制图形轮廓。

`fill()`:
通过填充路径的内容区域生成实心的图形。
:::tip
1. 调用beginPath()之后，或者canvas刚建的时候，第一条路径构造命令通常被视为是moveTo（），要在设置路径之后专门指定你的起始位置。
2. 当你调用fill()函数时，所有没有闭合的形状都会自动闭合，所以你不需要调用closePath()函数。但是调用stroke()时不会自动闭合。
:::
```js
// 绘制三角形代码 (填充三角形)
ctx.beginPath()
ctx.moveTo(75, 50)
ctx.lineTo(100, 75)
ctx.lineTo(100, 25)
ctx.fill()
// 绘制描边三角形
ctx.beginPath();
ctx.moveTo(125, 125);
ctx.lineTo(125, 45);
ctx.lineTo(45, 125);
ctx.closePath(); // 闭合曲线
ctx.stroke();
```
3. 绘制图形的一些方法
- 绘制直线，需要使用的方法是 -> `lineTo(x, y)`
- 绘制圆弧或者圆 -> `arc(x, y, radius, startAngle, endAngle, anticlockwise)`
  - （x,y）为圆心的以radius为半径的圆弧（圆），从startAngle开始到endAngle结束，按照anticlockwise给定的方向（默认为顺时针）来生成。
```js
// MDN 笑脸实例
ctx.beginPath();
ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // 绘制
ctx.moveTo(75 + Math.sqrt(35**2 - 17.5**2) , 75 + 17.5);
ctx.arc(75, 75, 35, Math.PI / 180 * 30, Math.PI / 180 * 150, false);   // 口(顺时针)
ctx.moveTo(65, 65);
ctx.arc(60, 65, 5, 0, Math.PI * 2, true);  // 左眼
ctx.moveTo(95, 65);
ctx.arc(90, 65, 5, 0, Math.PI * 2, true);  // 右眼
ctx.stroke();
```
<canvasDemo 
  type='drawSimleFace' 
  w=150 
  h=150 
  title='笑脸展示'
  id="simleCanvas"
/>

- 绘制二次贝塞尔曲线 -> `quadraticCurveTo(cp1x, cp1y, x, y)`
  - cp1x,cp1y为一个控制点，x,y为结束点。
- 绘制三次贝塞尔曲线 -> `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)`
  - cp1x,cp1y为控制点一，cp2x,cp2y为控制点二，x,y为结束点。

下例 Demo 来自MDN文档：
<canvasDemo 
  type='drawBezier' 
  w=150 
  h=150 
  title='二次贝塞尔曲线'
  id="BezierCanvas"
/>

<canvasDemo 
  type='drawCubicBezier' 
  w=150 
  h=150 
  title='三次贝塞尔曲线'
  id="CubicBezier"
/>

:::warning 注意⚠️
1. 画圆弧的规则为->角度是按照顺时针计算的，也就是说：右为0度，下为90度，左为180，上为270。 顺时针和逆时针指的是起点到终点链接是按顺时针画还是逆时针画。
2. lineTo() && moveTo() 的区别，lineTo是用来画线的，而moveTo是移动到某个位置，移动的过程不画线的。
:::

### Path2D对象
为了简化代码和提高性能，Path2D对象已可以在较新版本的浏览器中使用，**用来缓存或记录绘画命令**，这样你将能快速地回顾路径。
```js
// 使用说明
var rectangle = new Path2D();
rectangle.rect(10, 10, 50, 50);

var circle = new Path2D();
circle.moveTo(125, 35);
circle.arc(100, 35, 25, 0, 2 * Math.PI);

ctx.stroke(rectangle);
ctx.fill(circle);
```

### 使用样式和颜色
canvas 设置图形的颜色
1. 设置图形的填充色 - `fillStyle = color`
2. 设置图形的轮廓色 - `strokeStyle = color`
3. 透明色 - rgba
<canvasDemo 
  type='drawFillStyleList' 
  title='填充色'
  id="FillStyleList"
/>
<canvasDemo 
  type='drawStrokeStyleList' 
  title='轮廓色'
  id="strokeStyleList"
/>

线形样式
1. 设置线条宽度。`lineWidth = value`
2. 设置线条末端样式。`lineCap = type` (butt，round 和 square。默认是 butt。)
3. 设定线条与线条间接合处的样式。`lineJoin = type`(round, bevel 和 miter。默认是 miter。)
4. 限制当两条线相交时交接处最大长度；所谓交接处长度（斜接长度）是指线条交接处内角顶点到外角顶点的长度。`miterLimit = value`
5. 返回一个包含当前虚线样式，长度为非负偶数的数组。`getLineDash()`
6. 设置当前虚线样式。`setLineDash(segments)`
7. 设置虚线样式的起始偏移量。`lineDashOffset = value`
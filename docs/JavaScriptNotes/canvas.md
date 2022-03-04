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
#### canvas 设置图形的颜色
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

#### 线形样式
1. 设置线条宽度。`lineWidth = value`
2. 设置线条末端样式。`lineCap = type` (butt，round 和 square。默认是 butt。)
3. 设定线条与线条间接合处的样式。`lineJoin = type`(round, bevel 和 miter。默认是 miter。)
4. 限制当两条线相交时交接处最大长度；所谓交接处长度（斜接长度）是指线条交接处内角顶点到外角顶点的长度。`miterLimit = value`
5. 返回一个包含当前虚线样式，长度为非负偶数的数组。`getLineDash()`
6. 设置当前虚线样式。`setLineDash(segments)`(虚线的间隔距离)
7. 设置虚线样式的起始偏移量。`lineDashOffset = value`

<tag name="注意红圈圈出来的部分" colorType="warn"/>

<br />
<canvasDemo 
  type='drawSomeLine' 
  title='线形样式相关'
  w="520"
  id="drawSomeLine"
/>

:::tip 注意⚠️
1. miterLimit:  如上第三个所展示的上1 下1 的连接处 因为限制了最大长度是 10。所以不是完整的链接处展示方式。
2. 虚线处的动画设置：
```js
const march = () => {
  offset++;
  if (offset > 16) {
    offset = 0;
  }
  draw();
  setTimeout(march, 20);
}
```
:::

### 渐变 && 图案
`createLinearGradient(x1, y1, x2, y2)`: createLinearGradient 方法接受 4 个参数，表示渐变的起点 (x1,y1) 与终点 (x2,y2)。

`createRadialGradient(x1, y1, r1, x2, y2, r2)`: createRadialGradient 方法接受 6 个参数，前三个定义一个以 (x1,y1) 为原点，半径为 r1 的圆，后三个参数则定义另一个以 (x2,y2) 为原点，半径为 r2 的圆。

<canvasDemo 
  type='drawGradients' 
  title='渐变'
  w="320"
  id="drawGradients"
/>

**Patterns**
`createPattern(image, type)`:
该方法接受两个参数。Image 可以是一个 Image 对象的引用，或者另一个 canvas 对象。Type 必须是下面的字符串值之一：repeat，repeat-x，repeat-y 和 no-repeat。

<canvasDemo 
  type='drawPatterns' 
  title='图案样式'
  id="drawPatterns"
/>

:::tip 提示
1. **渐变** 使用姿势：先创建渐变方式 `LinearGradient || RadialGradient` 然后使用 `addColorStop(百分比，颜色)` 分段创建 渐变颜色方式。

2. **patterns:** 使用方式
```js
const img = new Image();
img.src = 'https://mdn.mozillademos.org/files/222/Canvas_createpattern.png';
img.onload = function() {
    // 创建图案
  var ptrn = ctx.createPattern(img, 'repeat');
  ctx.fillStyle = ptrn;
  ctx.fillRect(0, 0, 150, 150);
}
```
:::

### 文字相关
#### 绘制文本
`fillText(text, x, y [, maxWidth])`:
在指定的(x,y)位置填充指定的文本，绘制的最大宽度是可选的.

`strokeText(text, x, y [, maxWidth])`:
在指定的(x,y)位置绘制文本边框，绘制的最大宽度是可选的.

#### 文本样式
`font = value`:
当前我们用来绘制文本的样式. 这个字符串使用和 CSS font 属性相同的语法. 默认的字体是 10px sans-serif。

`textAlign = value`:
文本对齐选项. 可选的值包括：start, end, left, right or center. 默认值是 start。

`textBaseline = value`:
基线对齐选项. 可选的值包括：top, hanging, middle, alphabetic, ideographic, bottom。默认值是 alphabetic。

`direction = value`:
文本方向。可能的值包括：ltr, rtl, inherit。默认值是 inherit。

#### 阴影 shadows
`shadowOffsetX = float`:
shadowOffsetX 和 shadowOffsetY 用来设定阴影在 X 和 Y 轴的延伸距离，它们是不受变换矩阵所影响的。负值表示阴影会往上或左延伸，正值则表示会往下或右延伸，它们默认都为 0。

`shadowOffsetY = float`:
shadowOffsetX 和 shadowOffsetY 用来设定阴影在 X 和 Y 轴的延伸距离，它们是不受变换矩阵所影响的。负值表示阴影会往上或左延伸，正值则表示会往下或右延伸，它们默认都为 0。

`shadowBlur = float`:
shadowBlur 用于设定阴影的模糊程度，其数值并不跟像素数量挂钩，也不受变换矩阵的影响，默认为 0。

`shadowColor = color`:
shadowColor 是标准的 CSS 颜色值，用于设定阴影颜色效果，默认是全透明的黑色。

:::tip
1. 绘制文本相关
- 最大宽度会压缩文字，而不是分行。
- strokeText 是文字边框，镂空样式
2. 预测文本宽度
`ctx.measureText("foo")`
:::
<canvasDemo 
  type='drawSomeText'
  w="300"
  title='文字相关'
  id="drawSomeText"
/>

### 使用图像
**引入图像到canvas里需要以下两步基本操作：**
1. 获得一个指向HTMLImageElement的对象或者另一个canvas元素的引用作为源，也可以通过提供一个URL的方式来使用图片
2. 使用drawImage()函数将图片绘制到画布上
- `drawImage(image, x, y)`:其中 image 是 image 或者 canvas 对象，x 和 y 是其在目标 canvas 里的起始坐标。

**使用方式：**
```js
// 1. 创建一个图像
var img = new Image();   // 创建一个<img>元素
img.src = 'myImage.png'; // 设置图片源地址

// 2. 当脚本执行后，图片开始装载
img.onload = function(){
  // 执行drawImage语句
}
```

**drawImage**方法，可以传9个参数：
drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
```js
ctx.drawImage(remoteImg, 
  33,71,104,124, // 前4个参数是对原图的裁剪， 位置（x,y）=> 33，71. 原图上的大小 => 104,124.
  185,20, 87,104 // 裁剪之后的图片 位置 和 大小
)
```
<canvasDemo 
  type='drawPic'
  title='绘制图片'
  w="300"
  id="drawPic"
/>

### 变形
#### save && restore
Canvas状态存储在栈中，每当save()方法被调用后，当前的状态就被推送到栈中保存。

你可以调用任意多次 save方法。每一次调用 restore 方法，上一个保存的状态就从栈中弹出，所有设定都恢复。
```js
ctx.fillRect(0,0,150,150);
ctx.save(); 

ctx.fillStyle = '#09F'
ctx.fillRect(15,15,120,120);

ctx.save();
ctx.fillStyle = '#FFF'
ctx.globalAlpha = 0.5;
ctx.fillRect(30,30,90,90);

ctx.restore();
ctx.fillRect(45,45,60,60);

ctx.restore();
ctx.fillRect(60,60,30,30);
```
<canvasDemo 
  type='drawWithSave'
  title='save && restore'
  id="drawWithSave"
/>

#### translating
用来移动 canvas 和它的原点到一个不同的位置。

`translate(x, y)`: translate 方法接受两个参数。x 是左右偏移量，y 是上下偏移量。
```js
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    // 这里保存的是原始的 原点位置
    ctx.save();
    ctx.fillStyle = 'rgb(' + (51 * i) + ', ' + (255 - 51 * i) + ', 255)';
    ctx.translate(10 + j * 50, 10 + i * 50);
    ctx.fillRect(0, 0, 25, 25);
    ctx.restore(); // 每循环一次就回复到 0，0 开始
  }
}
```
<canvasDemo 
  type='drawTranslate'
  title='translating'
  id="drawTranslate"
/>

#### Rotating
`rotate('角度')`: 它是顺时针方向的，以弧度为单位的值。旋转的中心点始终是 canvas 的原点。可以理解成以原点为圆心，弧度为坐标轴 顺时针方向旋转角度。以此为坐标轴 绘图。
<canvasDemo 
  type='drawRotating'
  title='Rotating'
  id="drawRotating"
/>

#### 缩放
`scale(x, y)`: x 为水平缩放因子，y 为垂直缩放因子，如果比1小，会缩小图形， 如果比1大会放大图形
<canvasDemo 
  type='drawScale'
  title='Scale'
  id="drawScale"
/>

#### transforms
`transform(a, b, c, d, e, f)`： ⬇️
a(m11)：水平方向的缩放
b(m12)：竖直方向的倾斜偏移
c(m21)：水平方向的倾斜偏移
d(m22)：竖直方向的缩放
e(dx)：水平方向的移动
f(dy)：竖直方向的移动
<canvasDemo 
  type='drawTransforms'
  title='transforms'
  id="drawTransforms"
  w="300"
  h="300"
/>

### 组合 Compositing
重叠图像渲染方式
globalCompositeOperation = '覆盖方式参数'
#### 裁切路径 
clip()：感觉和 globalCompositeOperation 的 source-in 和 source-atop 差不多。
<canvasDemo 
  type='drawClip'
  title='clip'
  id="drawClip"
/>

### 动画
一定要善用 save 和 restore 存储恢复最初的坐标系状态，这样就不用手动恢复了

**一些demo联系**
<canvasDemo 
  type='drawSolar'
  title='solar'
  id="drawSolar"
  w='300'
  h='300'
/>

<canvasDemo 
  type='drawClock'
  title='clock'
  id="drawClock"
  w='300'
  h='300'
/>

### Demo


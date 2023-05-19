## webGL
[参考文章](https://nashaofu.github.io/webgl-demo/)



webGL本质是一个光栏化引擎，它在电脑里的GPU中运行



通过调用 gl.drawArrays 或 gl.drawElements 运行一个着色方法对，使得你的着色器对能够在GPU上运行。

- Attributes：
- Uniforms：
- Textures：
- Varyings：


WebGL只关心两件事：裁剪空间中的坐标值和颜色值。使用WebGL只需要给它提供这两个东西。你需要提供两个着色器来做这两件事，
1. 一个顶点着色器（Vertex Shader）提供裁剪空间坐标值
2. 一个片段着色器（Fragment Shader）提供颜色值

gl_Position变量， 这个变量就是该顶点转换到裁剪空间中的坐标值，GPU接收该值并将其保存起来。

通过给片段着色器的一个特殊变量gl_FragColor设置一个颜色值，实现自定义像素颜色。

gl_PointSize、gl_Position、gl_FragColor都是内置变量，也就是说不需要声明，这一点与多数编程语言不同，这主要是由GPU的特殊性决定


### webGl流程
接下来。我会以绘制一个简单的三角形为例。讲解使用 `webGL` 绘制一个三角形的流程步骤。

1. 创建一个canvas元素，绑定上下文为：`webgl`

2. 创建 顶点着色器 和 片段着色器( )

  **loadShader 所做的事**
 - 调用gl.createShader()创建一个新的着色器。
 - 调用gl.shaderSource()将源代码发送到着色器。
 - 一旦着色器获取到源代码，就使用gl.compileShader().进行编译。
 - 为了检查是否成功编译了着色器，将检查着色器参数 gl.COMPILE_STATUS 状态。通过调用gl.getShaderParameter()获得它的值，并指定着色器和我们想要检查的参数的名字（gl.COMPILE_STATUS）。如果返回错误，则着色器无法编译，因此通过gl.getShaderInfoLog() (en-US)从编译器中获取日志信息并 alert，然后删除着色器返回 null，表明加载着色器失败。
 - 如果着色器被加载并成功编译，则返回编译的着色器

3. 创建一个 program, 并将其与 两个 shader 相关联
  
  **initShaderProgram 所做的事**
  - 调用gl.createProgram()创建一个program
  - 将 `VERTEX_SHADER` 和 `FRAGMENT_SHADER` 资源通过 gl.attachShader(Program, Shader) 链接起来
  - 使用 gl.linkProgram() 连接

4. 修改坐标信息并渲染出来（详见下例 `setGLValue` 函数）

#### 代码展示
```js
const vsSource = `
  attribute vec4 a_position;

  void main() {
    gl_Position = a_position; // 设置顶点位置
  }
`
const fsSource = `
  precision mediump float;
  uniform vec4 u_color;

  void main() {
    gl_FragColor = u_color; // 设置片元颜色
  }
`

const createGl = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 300
  canvas.height = 300
  const gl = canvas.getContext('webgl')
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  document.body.append(canvas)
  return gl
}

const initShaderProgram = (gl, vsSource, fsSource) => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null
  }

  gl.useProgram(shaderProgram)
  return shaderProgram
}

const loadShader = (gl, type, source) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader)
    return null
  }

  return shader
}

const setGLValue = (program) => {
  // 获取设置颜色信息
  const colorLocation = gl.getUniformLocation(program, 'u_color')
  gl.uniform4f(colorLocation, 0.93, 0, 0,56, 1)

  // 获取设置坐标信息
  const positionLocation = gl.getAttribLocation(program, 'a_position')
  const positionBuffer = gl.createBuffer()

  // 对 gl.ARRAY_BUFFER 的操作都会映射到这个缓存
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 0.5,
    0.5, 0,
    -0.5, -0.5,
    0.5, 0.5,
  ]),
  gl.STATIC_DRAW
  )

  // 将顶点数据加入创建的缓存对象中
  gl.enableVertexAttribArray(positionLocation)
  // 开启 attribute 变量，使顶点着色器能访问缓冲区数据
  gl.vertexAttribPointer(
    positionLocation, // 顶点属性的索引
    2, // 组成数量，必须是1，2，3或4。我们只提供了 x 和 y
    gl.FLOAT, // 每个元素的数据类型
    false, // 是否归一化到特定的范围，对 FLOAT 类型数据设置无效
    0, // stride 步长 数组中一行长度，0 表示数据是紧密的没有空隙，让OpenGL决定具体步长
    0 // offset 字节偏移量，必须是类型的字节长度的倍数。
  )

  gl.clearColor(0, 1, 1, 1) // 设置清空颜色缓冲时的颜色值
  gl.clear(gl.COLOR_BUFFER_BIT) // 清空颜色缓冲区，也就是清空画布

  gl.drawArrays( // 从数组中绘制图元
    gl.TRIANGLES, // 渲染三角形
    0,  // 从数组中哪个点开始渲染
    4,   // 需要用到多少个点，三角形的三个顶点
  )
}

const gl = createGl()
const program = initShaderProgram(gl, vsSource, fsSource)
setGLValue(program)
```

基础功能简单了解一下之后，使用第三方库 three.js 了解一下
### Three.js


### 矩阵相关知识
https://juejin.cn/post/7217100608776224829


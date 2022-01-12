## 异或



## websocket
在`webpack`之前实现的两种方式：
1. 轮询：让浏览器每间隔几秒，就发送一次请求。
    问题：( 需要服务器有很快的处理速度和资源 )
2. long pull：采取的是阻塞模式的轮询，没收到消息就不返回，直到有消息返回才再次建立新链接。
    问题：( 需要有很高的并发，也就是说同时接待客户的能力 )


## 音频相关
#### 需求1: 需要前端校验 上传音频 是否符合 8k 16bit 的要求
<b> 补充知识：⬇️ </b>
 - 采样频率： 在一定时间内将连续的模拟信号采样多少次。一般我们说48k采样率，即为1S内采样48000个点，每2个采样点之间时间为1/48000S，即为1/48Ms，也就是1Ms内有48个点。
 
 - 采样位深： 在每次采样时，每个点的数据存储为多少bit。音频在数字信号中，振幅范围为[-1,1]，也可以把采样位深理解为将振幅[-1,1]划分为多少级。举个极端、简单的例子: 
 - - 情况①：采样精度为1时，那么采样到数据为-1,0,1。仅三级。
 - - 情况②：采样精度为0.1时，那么采样到数据为-1,-0.9,-0.8……-0.1,0,0.1……0.8,0.9,1。有21级。所以采样位深越高，所承载的信号的精度越高。

一般我们常看到音频采样位深为16Bit、24Bit。意思是2进制数16位、24位。16位2进制数所能表达的数据范围为-32767-32767。24位2进制数所能表达的数据范围为-8388607~8388607。
<hr />
<b>实际业务：⬇️</b>

业务中，我所要获取的音频源格式为 .wav 格式的音频所涉及的参数，对其位深和采样率进行校验，符合要求的才能上传。

*问题：* 如何找到它对应的存储的信息，获取到 `SampleRate & BitsPerSample`？

<tag name="关键点:" /> 
.wav格式的音频是将其存储在 head 里面的，具体存储规则：详见<a href="https://www.jianshu.com/p/b7cadd3e9c4d" target="_Blank">WAV格式详解</a>，因此如果我们将音频以流的形式读出，根据信息存储就可与你获得到对应的音频信息了。


:::details 解决流程：⬇️
- 1. 将文件以 数据流 的形式读出来。
```js
// File 对象是特殊类型的 Blob，且可以用在任意的 Blob 类型的 context 中。（from ---> MDN）
const buffer = await file.arrayBuffer();
// **** 同理还可以使用 Blob 对象的其它方法 *****
const stream = await file.stream();
```
- 2. 根据信息储存位置读出 所需的信息。
```js {8,14,20}
const head = new WavHead(buffer);
class WavHead {
    constructor(buffer) {
        this.buffer = buffer.slice(0, 80)
    }

    get simpleRate() {
        const rate = new Int32Array(this.buffer.slice(24, 28)).join('');
        console.log('rate:', rate);
        return parseInt(rate);
    }

    get bitsPerSample() {
        const bits = new Int16Array(this.buffer.slice(34, 36)).join('');
        console.log('bits:', bits);
        return parseInt(bits);
    }

    get formType() {
        const type = String.fromCharCode.apply(null, new Uint8Array(this.buffer.slice(8, 12)))
        console.log('type: ', type)
        return type
    }
}
```
:::

<tag name="Demo⬇️" colorType="info"/> 获取 .wav格式音频信息！

⚠️注意：只对wav格式音频起效哦～
<upload />

##### 需求2: 怎么获取视频中的音频源
首先需要明确一点，不同的视频格式文件的存储信息的位置是不同的，要去读文件还要依照文件的存储机制去读写才行。

<tag name="遗留问题" colorType="red"></tag>
校验方式：涉及知识点 => buffer 怎么转换成 audio 可以识别的录音


## ArrayBuffer 对象
<knowledgeLine>
<template #content_0>
 原始设计目的，与 WebGL（指浏览器与显卡之间的通信接口）项目有关。为了满足 JavaScript 与显卡之间大量的、实时的数据交换，它们之间的数据通信必须是二进制的。这时要是存在一种机制，直接操作字节，将 4 个字节的 32 位整数，以二进制形式原封不动地送入显卡，脚本的性能就会大幅提升。" 
</template>

<template #content_1>
<strong>ArrayBuffer对象：</strong>
代表内存之中的一段二进制数据，可以通过“视图”进行操作。“视图”部署了数组接口，这意味着，可以用数组的方法操作内存。它不能直接读写，只能通过视图（TypedArray视图和DataView视图)来读写，视图的作用是以指定格式解读二进制数据。

```js
const buf = new ArrayBuffer(32)
```
</template>
 
 <template #content_2>
 <a href='https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer'>ArrayBuffer-MDN文档链接:</a>
 
 1. **ArrayBuffer.prototype.byteLength** -> byteLength属性，返回所分配的内存区域的字节长度
 2. **ArrayBuffer.prototype.slice()** -> slice方法，允许将内存区域的一部分，拷贝生成一个新的ArrayBuffer对象。
 3. **ArrayBuffer.slice()** -> 静态方法isView，返回一个布尔值，表示参数是否为ArrayBuffer的视图实例。

 ```js
 const buffer = new ArrayBuffer(32);
 buffer.byteLength // 32
 const newBuffer = buffer.slice(0, 10); //截取0-10的位数
 ArrayBuffer.isView(buffer) // false
 ArrayBuffer.isView(new Int32Array(buffer)) // true -> 视图实例
 ```
 
 **小结：** -> ArrayBuffer的基础方法只能截取字节长度，想要将其展示成可以看懂的还要使用，TypedArray视图和DataView视图来读写
</template>

<template #content_3>
 ArrayBuffer有两种视图，一种是TypedArray视图，另一种是DataView视图。前者的数组成员都是同一个数据类型，后者的数组成员可以是不同的数据类型

 [TypedArray 视图](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray'): -> 描述了一个底层的二进制数据缓冲区的一个类数组视图（。事实上，没有名为 TypedArray 的全局属性，也没有一个名为 TypedArray 的构造函数。

 [DataView 视图](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView'): -> 视图是一个可以从 二进制ArrayBuffer 对象中读写多种数值类型的底层接口，使用它时，不用考虑不同平台的字节序问题。

 字节序是是吗？后面要补充一下。
</template>
</knowledgeLine>

### 利用视图读取ArrayBuffer
#### TypedArray
TypedArray 视图共有 9 种类型:
- Int8Array：8 位有符号整数，长度 1 个字节。
- Uint8Array：8 位无符号整数，长度 1 个字节。
- Uint8ClampedArray：8 位无符号整数，长度 1 个字节，溢出处理不同。
- Int16Array：16 位有符号整数，长度 2 个字节。
- Uint16Array：16 位无符号整数，长度 2 个字节。
- Int32Array：32 位有符号整数，长度 4 个字节。
- Uint32Array：32 位无符号整数，长度 4 个字节。
- Float32Array：32 位浮点数，长度 4 个字节。
- Float64Array：64 位浮点数，长度 8 个字节。

<tag name="注意点"/>

1. 它们很像普通数组，都有length属性，都能用方括号运算符（[]）获取单个元素，所有数组的方法，在它们上面都能使用
2. TypedArray 数组只是一层视图，本身不储存数据，它的数据都储存在底层的ArrayBuffer对象之中，要获取底层对象必须使用buffer属性。
3. TypedArray 数组没有concat方法
4. Uint8ClampedArray 的视图类型是一种针对 Canvas 元素的专有类型(专门针对颜色)。

#### DataView
1. 先将其转化成为 DataView 视图格式
```js
const buffer = new ArrayBuffer(24);
const dv = new DataView(buffer);
```
2. `DataView` 实例提供 8 个方法读取(写入)内存。
- get(set)Int8：读取(写入) 1 个字节，返回一个 8 位整数。
- get(set)Uint8：读取(写入) 1 个字节，返回一个无符号的 8 位整数。
- get(set)Int16：读取(写入) 2 个字节，返回一个 16 位整数。
- get(set)Uint16：读取(写入) 2 个字节，返回一个无符号的 16 位整数。
- get(set)Int32：读取(写入) 4 个字节，返回一个 32 位整数。
- get(set)Uint32：读取(写入) 4 个字节，返回一个无符号的 32 位整数。
- get(set)Float32：读取(写入) 4 个字节，返回一个 32 位浮点数。
- get(set)Float64：读取(写入) 8 个字节，返回一个 64 位浮点数。

### 操作实例
1. 如何以 arrayBuffer 的形式获取远端文件：
```js
const { data } = await axios('远端地址xxxx', { responseType: 'blob'})
const buffer = await data.arrayBuffer()
```
2. 当远端的 txt 文件出现乱码时：
出现乱码的原因可能是因为：文件的编码方式不是 utf-8，所以要按照 utf-8 的形式读取文件。
```js
const res = await fetch('远端地址xxx')
const blob = await res.blob()
const reader = new FileReader()
reader.onload = function(evt) {
    console.log('解析后的值', evt.target.result);
};
reader.readAsText(blob)
```
3. 利用canvas来压缩图片 ！！

起因：之前遇到过一个需求，上传图片要 前端 压缩至 xx kb以下。

但是：前端如何实现图片压缩呢？查阅资料后发现可以使用 canvas 进行压缩

:::details 实现详情如下
1. 将上传的图片 以 base64 的形式读出来，赋值给 img 的 src 属性
```ts
// 方案一： 是有FileReader API 读文件
const reader = new FileReader()
reader.readAsDataURL(file)
reader.onload = function(e: any) {
    img.src = e.target.result as string
}

// 方案二: 自己转图片信息为 base64
// arrayBuffer 转 Base64 的算法
const arrayBufferToBase64Img = (buffer: ArrayBuffer):string => {
  const str = String.fromCharCode(...new Uint8Array(buffer))
  return `data:image/jpeg;base64,${window.btoa(str)}`
}
const buffer: ArrayBuffer = await file.arrayBuffer()
img.src = arrayBufferToBase64Img(buffer)
```
2. 在图片加载完成后 获取图片信息，并使用 drawImage() 方法压缩
```ts
// 这里要注意一点，要把onload 事件封装成同步事件 ，否则获取不到压缩完成后的 blob
const imgLoaded = (img: HTMLImageElement):Promise<Blob> => {
    return new Promise((resolve, reject) => {
        img.onload = () => {
            const originWidth = img.width
            const originHeight = img.height
            let targetWidth = Math.round(originWidth / 2),
                targetHeight = Math.round(originHeight / 2);
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            ctx.clearRect(0, 0, targetWidth, targetWidth);
            // 图片压缩
            ctx.drawImage(img, 0, 0, targetWidth, targetWidth);
            canvas.toBlob((blob) => {
            resolve(blob)
            }, file.type || 'image/png')
        }
    })
}
```
3. 上诉两部其实已经完成了对图片的压缩功能，因为需求是 “压缩至20kb“，所以需要加入递归判断，图片小于 20kb就行。
```ts
interface ICompressProps {
  file: File | Blob,
  maxSize: number, //单位kb
}
// 压缩图片 函数 如下：⬇️
const compressImg = async(props: ICompressProps) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // 递归压缩
  const loop = async (props: ICompressProps) => {
    const {file, maxSize } = props
    const outCondition = maxSize * 1024
    if (file.size <= outCondition) return file
    const img = new Image()
    const buffer: ArrayBuffer = await file.arrayBuffer()
    img.src = arrayBufferToBase64Img(buffer)
 
    const imgLoaded = (img: HTMLImageElement):Promise<Blob> => {
      return new Promise((resolve, reject) => {
        img.onload = () => {
          const originWidth = img.width
          const originHeight = img.height
          let targetWidth = Math.round(originWidth / 2),
              targetHeight = Math.round(originHeight / 2);
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          // 清除画布
          ctx.clearRect(0, 0, targetWidth, targetWidth);
          // 图片压缩
          ctx.drawImage(img, 0, 0, targetWidth, targetWidth);
          // toBlob 函数这里有第二个参数要注意以下
            // 如果没有文件类型，可能导致转化成了其它类型图片导致第一次压缩 文件反而变大
          canvas.toBlob((blob) => {
            resolve(blob)
          }, file.type || 'image/png') 
        }
      })
    }

    const compressedBlob = await imgLoaded(img)
    const params: ICompressProps = { file: compressedBlob, maxSize }
    if (compressedBlob.size > outCondition) return loop(params)
    return compressedBlob
  }
  
  // 获取压缩后的 最终 Blob 对象
  const blob = await loop(props)
  // 获取压缩后的 最终 ArrayBuffer 对象
  const bf = await blob.arrayBuffer()
}
```
:::



⬇️下例 Demo 会将 图片压缩至 20kb 及以下
该方法 参考了 [张鑫旭大佬的博客](https://www.zhangxinxu.com/study/201707/js-compress-image-before-upload.html)
<bufferDemo/>

### TypedArray && DataView 区别
ArrayBuffer对象的各种TypedArray视图，是用来向网卡、声卡之类的本机设备传送数据，所以使用本机的字节序就可以了；而DataView视图的设计目的，是用来处理网络设备传来的数据，所以大端字节序或小端字节序是可以自行设定的。

## webpack
**关于 process**

**起因：** 在设计权限控制的时候，想要设置一个开关，在本地开发的时候放开所有的权限。

**开始的做法：** 在CLI中设置 NO_AUTH 值，为 true 时放开权限。

**遇到的问题：** 在实现上诉功能的时候，发现 业务代码中 会报 `process is not define` 的错误，
原因很简单process是 node.js中设置的，浏览器中自然是没有的。但是 查看其它项目时发现有使用 `process.env.NO_AUTH`进行判断的。

**怎么设置呢？** 
在package.json文件中控制变量
```json
"start-na": "NODE_ENV=development NO_AUTH=true node ./server/index.js"
```
在webpack -> plugins里面设置
```js
new webpack.DefinePlugin({
    'process.env.NO_AUTH': !!process.env.NO_AUTH,
})
```

:::tip 注意点
猜测 process.env.NO_AUTH 是以字符串的形式 储存的固定值
所以使用的时候要对整个 process.env.NO_AUTH 使用，只是打印 process 是会报错的
:::
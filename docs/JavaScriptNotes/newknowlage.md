---
sidebarDepth: 2
---
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


## ArrayBuffer 对象
<knowledgeLine>
<template #content_0>
 原始设计目的，与 WebGL（指浏览器与显卡之间的通信接口）项目有关。为了满足 JavaScript 与显卡之间大量的、实时的数据交换，它们之间的数据通信必须是二进制的。这时要是存在一种机制，直接操作字节，将 4 个字节的 32 位整数，以二进制形式原封不动地送入显卡，脚本的性能就会大幅提升。" 
</template>

<template #content_1>
<strong>ArrayBuffer对象：</strong>
代表内存之中的一段二进制数据，可以通过“视图”进行操作。“视图”部署了数组接口，这意味着，可以用数组的方法操作内存。它不能直接读写，只能通过视图（TypedArray视图和DataView视图)来读写，视图的作用是以指定格式解读二进制数据。
</template>
 
 <template #content_2>
 <a href='https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer'>ArrayBuffer-MDN文档链接:</a>
 
 1. **ArrayBuffer.prototype.byteLength** -> byteLength属性，返回所分配的内存区域的字节长度
 2. **ArrayBuffer.prototype.slice()** -> slice方法，允许将内存区域的一部分，拷贝生成一个新的ArrayBuffer对象。
 3. **ArrayBuffer.slice()** -> 静态方法isView，返回一个布尔值，表示参数是否为ArrayBuffer的视图实例。
 
 **小结：** -> ArrayBuffer的基础方法只能截取字节长度，想要将其展示成可以看懂的还要使用，TypedArray视图和DataView视图来读写 -->
</template>

<template #content_3>
 ArrayBuffer有两种视图，一种是TypedArray视图，另一种是DataView视图。前者的数组成员都是同一个数据类型，后者的数组成员可以是不同的数据类型

 [TypedArray 视图](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray'): -> 描述了一个底层的二进制数据缓冲区的一个类数组视图（。事实上，没有名为 TypedArray 的全局属性，也没有一个名为 TypedArray 的构造函数。

 [DataView 视图](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView'): -> 视图是一个可以从 二进制ArrayBuffer 对象中读写多种数值类型的底层接口，使用它时，不用考虑不同平台的字节序问题。
</template>

</knowledgeLine>


TypedArray && DataView 区别

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
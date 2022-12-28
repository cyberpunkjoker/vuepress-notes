## Web Audio Api
[参考文章](https://www.cnblogs.com/hanshuai/p/13620908.html)
### 加载音频资源
<br />

- `AudioContext` 用来管理和播放所有声音，可以通过任意数量的中间 `AudioNodes` 来作为音频信号的处理模块。
- **获取：** 使用`AudioBuffer`来播放很短或者适中的声音，一般使用 `XMLHttpRequest` 获取文件时，设置 `request.responseType = 'arraybuffer'`
- **解析：** 收到了解码的音频文件数据后，可以用`AudioContext` 的`decodeAudioData()`方法来正确的解码
- 
```js
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext(); //创建管理音频

// 如下：请求和 FileReader 时的 onload 都可以去解码数据
// reader.onload
request.onload = function() {
  context.decodeAudioData(request.response, function(buffer) {
    dogBarkingBuffer = buffer;
  }, onError);
}
```

### 播放声音
加载完成音频资源之后，就可以建立 source 和 destination 之间的关联。
- `AudioContext`的 `destination` 属性返回一个 `AudioDestinationNode`，表示 `context` 中所有音频的最终目标节点，一般是音频渲染设备，比如扬声器。
- `AudioBuffer`对象可以通过`AudioContext.createBuffer` 来创建或者通过 `AudioContext.decodeAudioData`成功解码音轨后获取。
```js
var context = new AudioContext();

function playSound(buffer) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
}
```

### 修改视频源
**这里有一些修改及获取参数的方法，具体可见[AudioParam](https://developer.mozilla.org/zh-CN/docs/Web/API/AudioParam)**

1. <tag name="音量修改" colorType="info"/>
通过`GainNode`将我们的声音源路由到目的地来操纵音量
```js
var gainNode = context.createGain();
source.connect(gainNode);
gainNode.connect(context.destination);
gainNode.gain.value = 0.5;
```

2. <tag name="淡入淡出" colorType="info" />
AudioParam： `linearRampToValueAtTime(value, endTime)`
```js
gainNode.gain.linearRampToValueAtTime(1, currTime + duration-ctx.FADE_TIME);
gainNode.gain.linearRampToValueAtTime(0, currTime + duration);
```

3. <tag name="过滤效果" colorType="info" />
在声音源和目标之间放置BiquadFilterNodes。这种类型的音频节点可以执行各种低阶过滤器，可用于构建图形均衡器甚至更复杂的效果。
过滤器支持的类型：
- Low pass filter
- High pass filter
- Band pass filter
- Low shelf filter
- High shelf filter
- Peaking filter
- Notch filter
- All pass filter
```js
var filter = context.createBiquadFilter();
source.connect(filter);
filter.connect(context.destination);
filter.type = 'lowpass'; 
filter.frequency.value = 440; 
source.start(0);
```

### OfflineAudioContext()
OfflineAudioContext() 构造函数（Web Audio API的一部分），返回一个新的 OfflineAudioContext 对象实例，然后可以使用该实例将音频渲染到 AudioBuffer 而不是音频输出设备

**OfflineAudioContext.startRendering():**

- 开始渲染音频，考虑当前连接和当前计划的修改。这个页面涵盖基于事件的和基于 Promise 的版本。
- 一般和`AudioContext.decodeAudioData()`方法一起使用。该方法用于异步解码音频文件中的 ArrayBuffer

```js
new OfflineAudioContext(numberOfChannels, length, sampleRate);

// Demo
const offlineCtx = new OfflineAudioContext({
  numberOfChannels: 2,
  length: 44100 * 40,
  sampleRate: 44100,
});
const source = offlineCtx.createBufferSource();

// MDN 上的 Demo
request.onload = function() {
  var audioData = request.response;  // 这里视频源也可以使用
  audioCtx.decodeAudioData(audioData, function(buffer) { 
    myBuffer = buffer;
    source.buffer = myBuffer;
    source.connect(offlineCtx.destination);
    source.start();
    offlineCtx.startRendering().then(function(renderedBuffer) {
      console.log('渲染完全成功');
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var song = audioCtx.createBufferSource();
      song.buffer = renderedBuffer;

      song.connect(audioCtx.destination);

      play.onclick = function() {
        song.start();
      }
    }).catch(function(err) {
        console.log('渲染失败：' + err);
        // 注意：当 OfflineAudioContext 上 startRendering 被立刻调用，Promise 应该被 reject
    });
  });
}

```
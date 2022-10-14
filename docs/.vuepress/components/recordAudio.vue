<template>
  <button @click="toRecord">录音</button>
  <button @click="stopRecord">停止录音</button>

  <audio controls :src="state.audioUrl"></audio>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue'
  interface OPermissionModal {
    code: 0|1|2;   // 0:浏览器不支持， 1:授权成功， 2:授权失败。
    message: string;
    stream?: MediaStream;
  }

  const RECORD_STS = {
    RECORDING: 'recording', //录制中
    PAUSED: 'paused',       //暂停
    INACTIVE: 'inactive',   //空闲状态
  }

  const streamRef = ref<MediaStream>(null)
  const jsNodeRef = ref(null)
  const mediaNodeRef = ref(null)
  const leftDataList = ref<any[]>([])
  const rightDataList = ref<any[]>([])

  const state = reactive({
    audioUrl: ''
  })
  
  const getPermission = ():Promise<OPermissionModal> => {
    return new Promise((resolve, reject) => {
      
      if (navigator?.mediaDevices?.getUserMedia) {
        const constraints = { audio: true }

        navigator.mediaDevices.getUserMedia(constraints).then(
          stream => {
            console.log(stream);
            resolve({ code: 1, message: '授权成功', stream })
          },
          (err) => {
            console.log(err);
            resolve({ code: 2, message: JSON.stringify(err)})
          }
        )
      } else {
        reject({ code: 0, message: '浏览器不支持' })
        console.error("浏览器不支持")
      }
    })
  }

  // 创建一个 javascriptProcessorNode 实例
  const createJSNode = (audioContext) => {
    const BUFFER_SIZE = 4096
    const INPUT_CHANNEL_COUNT = 2
    const OUTPUT_CHANNEL_COUNT = 2

    let creator = audioContext.createScriptProcessor || audioContext.createJavaScriptNode
    creator = creator.bind(audioContext)
    
    return creator(BUFFER_SIZE, INPUT_CHANNEL_COUNT, OUTPUT_CHANNEL_COUNT)
  }

  const onAudioProcess = (event) => {
    const audioBuffer = event.inputBuffer,
          leftChannelData = audioBuffer.getChannelData(0),
          rightChannelData = audioBuffer.getChannelData(1);

    leftDataList.value.push(leftChannelData.slice(0))
    rightDataList.value.push(rightChannelData.slice(0))
  }

  const startRecord = (stream: MediaStream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)
    const mediaNode = audioContext.createMediaStreamSource(stream)
    
    const jsNode = createJSNode(audioContext)

    jsNodeRef.value = jsNode
    mediaNodeRef.value = mediaNode

    jsNode.connect(audioContext.destination)
    jsNode.onaudioprocess = onAudioProcess

    mediaNode.connect(jsNode)
  }

  const mergeArray = (list): Float32Array => {
    let length = list.length * list[0].length
    let data = new Float32Array(length),
        offset = 0;
    for (let i = 0; i < list.length; i++) {
        data.set(list[i], offset)
        offset += list[i].length
    }
    return data
  }

  const stopRecord = () => {
    streamRef.value.getAudioTracks()[0].stop()
    jsNodeRef.value.disconnect()
    mediaNodeRef.value.disconnect()

    const leftData = mergeArray(leftDataList.value)
    const rightData = mergeArray(rightDataList.value)

    const wavfile = createWavfile(combineLeftAndRight(leftData, rightData))

    saveFileToAudio(wavfile)
  }

  const combineLeftAndRight = (left:Float32Array, right: Float32Array) => {
    const totalLen = left.length + right.length
    const data = new Float32Array(totalLen)
    for (let i = 0; i < left.length; i++) {
      const k = i * 2
      data[k] = left[i]
      data[k + 1] = right[i]
    }
    return data as Float32Array
  }

  const writeUTFBytes = (view: DataView, offset: number, str: string) => {
    const len = str.length
    for (let i = 0; i < len; i++) {
      // UTF-16 编码
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  const createWavfile = (audioData: Float32Array) => {
    const WAV_HEAD_SIZE = 44;
    const buffer = new ArrayBuffer(audioData.length * 2 + WAV_HEAD_SIZE),
          view = new DataView(buffer);
    
    // WAV HEAD
    // RIFF chunk descriptor
    writeUTFBytes(view, 0, 'RIFF')
    // RIFF chunk length
    view.setUint32(4, 44 + audioData.length * 2, true)
    // RIFF type
    writeUTFBytes(view, 8, 'WAVE')
    // FMT sub-chunk
    writeUTFBytes(view, 12, 'fmt ')
    // format chunk length
    view.setUint32(16, 16, true)
    // sample format
    view.setUint16(20, 1, true)
    // stereo (2 channels)
    view.setUint16(22, 2, true)
    // sample rate
    view.setUint32(24, 44100, true)
    // byte rate
    view.setUint32(28, 44100*2, true)
    // block align
    view.setUint16(32, 2*2, true)
    // bits per sample
    view.setUint16(34, 16, true)
    // data chunk indentifier
    writeUTFBytes(view, 36, 'data')
    // data chunk length
    view.setUint32(40, audioData.length * 2, true)


    // PCM DATA
    let len = audioData.length,
        index = 44,
        volume = 1;
    for (let i = 0; i < len; i++) {
      view.setInt16(index, audioData[i] * (0x7FFF * volume), true);
      index += 2;
    }

    return buffer
  }

  const saveFileToAudio = (buffer: ArrayBuffer) => {
    const blob = new Blob([new Uint8Array(buffer)])
    const blobUrl = URL.createObjectURL(blob)
    state.audioUrl = blobUrl
  }

  const toRecord = async () => {
    // 1. 获取权限
    const res = await getPermission()
    const { code, stream } = res || {}  
    if (code === 1) {
      // 2. 创建录音实例
      startRecord(stream)
      streamRef.value = stream
    }
  }

</script>

<style lang="less" scoped>
</style>
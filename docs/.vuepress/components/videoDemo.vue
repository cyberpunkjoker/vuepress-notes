<template>
  <input type="file" placeholder="上传" id="input" @change="changeFile">
  <div :style="{margin: '10px 0'}">
    解析之后的音频文件（点击试听):
    <audio id="videoDemoAudio" controls :src="url"></audio>
  </div>

</template>

<script lang="ts" setup>
import { ref } from "vue"
import toWav from 'audiobuffer-to-wav'

const url = ref('')

const changeFile = (e: InputEvent) => {
  const offlineAudioContext = new OfflineAudioContext(2, 44100 * 100, 44100);
  const soundSource = offlineAudioContext.createBufferSource();

  const audioContext = new(window.AudioContext || window.webkitAudioContext)();
  const reader = new FileReader();

  const blob = new Blob([e.target.files[0]]);

  reader.readAsArrayBuffer(blob); // video file
  reader.onload = function () {
    const videoFileAsBuffer = reader.result; // arraybuffer
    
    audioContext.decodeAudioData(videoFileAsBuffer).then(function (decodedAudioData) {
      let myBuffer = decodedAudioData;
      soundSource.buffer = myBuffer;
      soundSource.connect(offlineAudioContext.destination);
      soundSource.start();
      
      offlineAudioContext.startRendering().then(function (renderedBuffer) {
        const wav = toWav(renderedBuffer)
        url.value = URL.createObjectURL(new Blob([new Uint8Array(wav)]))

      }).catch(function (err) {
        console.log('Rendering failed: ' + err);
      });
    });
  };
}


</script>

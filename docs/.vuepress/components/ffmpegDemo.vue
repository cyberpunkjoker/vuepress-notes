<template>
   <video
    :src="video"
    controls
  />
  <br>
  <input type="file" @change="transcode">
  <p>{{ message }}</p>
</template>

<script lang="ts" setup>
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { ref } from 'vue'

// app state

const message = ref('Click Start to Transcode');
let video = ref(null);

// methods
async function transcode({ target: { files } }) {
  const ffmpeg = createFFmpeg({
    corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
    log: true,
  });

  message.value = 'Loading ffmeg-core.js';
  const { name } = files[0];
  
  await ffmpeg.load();

  message.value = 'Start transcoding';
  ffmpeg.FS('writeFile', name, await fetchFile(files[0]));
  await ffmpeg.run('-i', name, 'test.mp4');
  message.value = 'Complete transcoding';
  const data = ffmpeg.FS('readFile', 'test.mp4');
  video.value = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
}
</script>

<style>

</style>
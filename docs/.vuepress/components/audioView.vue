<template>
  <div>音频可视化展示</div>
  <audio 
    id="audio" 
    controls 
    src="//m8.music.126.net/21180815163607/04976f67866d4b4d11575ab418904467/ymusic/515a/5508/520b/f0cf47930abbbb0562c9ea61707c4c0b.mp3?infoId=92001"
    crossOrigin="anonymous"
  ></audio>
  <a @click="playAudio">播放</a>
  <canvas id="audioView"></canvas>
</template>

<script setup lang="ts">

const playAudio = () => {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    audio.play();
    onLoadAudio();
};

const onLoadAudio = () => {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    const context = new(window.AudioContext || window.webkitAudioContext)() as AudioContext;
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    let source = context.createMediaElementSource(audio);
    
    source.connect(analyser);
    analyser.connect(context.destination);

    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    const canvas: HTMLCanvasElement = document.getElementById("audioView") as HTMLCanvasElement;
    canvas.width = 350
    canvas.height = 300

    const ctx = canvas.getContext("2d");
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const barWidth = WIDTH / bufferLength * 1.5;
    let barHeight;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      // analyser.getByteFrequencyData(dataArray);
      analyser.getByteTimeDomainData(dataArray);
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      for (let i = 0, x = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        let r = barHeight + 25 * (i / bufferLength);
        let g = 250 * (i / bufferLength);
        let b = 50;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        x += barWidth + 2;
      }
    }

    renderFrame();
    // setInterval(renderFrame, 44);
}
</script>
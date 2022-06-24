<template>
  <div ref="resizeWrap" class="resize-container">
    <div ref="resizeContent">
      <slot name="content"></slot>
    </div>
    <div 
      @pointerdown="beginSliding"
      @pointerup="stopSliding"
      class="resize-icon" 
      ref="resizeIcon"
    />
  </div>
  
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const resizeIcon = ref(null)
  const resizeWrap = ref(null)
  const resizeContent = ref(null)
  
  const beginSliding = (e: PointerEvent) => {
    resizeIcon.value.onpointermove = slideMove
    resizeIcon.value.setPointerCapture(e.pointerId)
  }

  const stopSliding = (e: PointerEvent) => {
    resizeIcon.value.onpointermove = null
    resizeIcon.value.releasePointerCapture(e.pointerId)
  }

  const slideMove = (e: PointerEvent) => {
    const boxW = resizeWrap.value.clientWidth
    const boxH = resizeWrap.value.clientHeight
    const pointX = e.offsetX
    const pointY = e.offsetY

    resizeWrap.value.style.height = boxH + pointY + 'px'
    resizeWrap.value.style.width = boxW + pointX + 'px'
    
    zoomCtx(boxW)
  }

  const zoomCtx = (w: number) => {
    const ratio = w / 100
    // 缩放字体大小功能
    // resizeContent.value.style.fontSize = `${ratio * 14}px`
    resizeContent.value.style.zoom = ratio
  }
</script>

<style lang="less" scoped>
  .to-center {
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
  }

  .resize-container {
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
    overflow: hidden;
    .resize-icon {
      position: absolute;
      bottom: -8px;
      right: -8px;
      width: 15px;
      height: 15px;
      border-left:1px solid #000;
      transform: rotate(45deg);
      cursor: nwse-resize;
      &::after {
        content: '';
        width: 12px;
        height: 12px;
        border-left: 1px solid #000;
        .to-center()
      }
      &::before {
        content: '';
        width: 7px;
        height: 7px;
        border-left: 1px solid #000;
        .to-center()
      }
    }
  }

</style>
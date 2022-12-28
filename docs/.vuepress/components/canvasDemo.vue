<template>
  <div class="canvas-box">
    <div class="canvas-title">{{state.title}}-Demo: </div>
    <canvas :id="state.id" :height="state.h" :width="state.w"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import canvasFn from './canvasFunc/index'

type FncTypes = keyof typeof canvasFn

const props = defineProps<{
  type: FncTypes
  w?: string | number
  h?: string | number
  id?: string
  title: string
}>()

onMounted(() => {
  draw()
})

const { type: FuncType, h = 150, w = 150, title, id = 'myCanvas' } = props
const state = reactive({
  h, w, title, id
})

const draw = () => {
  const canvas:HTMLCanvasElement = document.getElementById(id) as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')
  canvasFn[FuncType](ctx)
}
  
</script>

<style lang="less" scoped>
.canvas-box {
  display: inline-block;
  border: 1px solid #f0f0f0;
  box-shadow: 5px 5px 5px #999;
  margin: 20px 10px;
  .canvas-title {
    padding: 5px;
    font-size: 18px;
    font-weight: 700;
    text-shadow: 2px 3px 3px skyblue;
  }
}
</style>
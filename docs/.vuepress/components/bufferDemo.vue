<template>
  <div class="buffer-demo-name">图片压缩-Demo</div>
  <input 
    :style="{display: 'block'}"
    type="file" 
    placeholder="上传" 
    id="fileInput" 
    @change="changeFile"
  >
  <img :src="state.base64Img" alt=""/>
  <div class="buffer-demo-panel">
    <div>原始文件大小：{{translateToKb(state.originSize)}}</div>
    <div>压缩后文件大小：{{translateToKb(state.size)}}</div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { arrayBufferToBase64Img } from './utils/index'
interface ICompressProps {
  file: File | Blob,
  maxSize: number, //单位kb
}

const inputType = {
  compress: { name: '压缩图片', method: 'compressImg' }
}

const state = reactive({
  base64Img: '',
  originSize: 0,
  size: 0,
})

const compressImg = async(props: ICompressProps) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  const loop = async (props: ICompressProps) => {
    const {file, maxSize } = props
    const outCondition = maxSize * 1024
    if (file.size <= outCondition) return file
    const img = new Image()
    // 方案一： 是有FileReader API 读文件
    // const reader = new FileReader()
    // reader.readAsDataURL(file)
    // reader.onload = function(e: any) {
    //   img.src = e.target.result as string
    // }

    // 方案二: 自己转图片信息为 base64
    const buffer: ArrayBuffer = await file.arrayBuffer()
    img.src = arrayBufferToBase64Img(buffer)
    
    // ----- 将图片的 onload 事件包装成 promise -> 同步操作 ---------------------
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

    const compressedBlob = await imgLoaded(img)
    const params: ICompressProps = { file: compressedBlob, maxSize }
    if (compressedBlob.size > outCondition) return loop(params)
    return compressedBlob
  }
  
  const blob = await loop(props)
  const bf = await blob.arrayBuffer()
  state.base64Img = arrayBufferToBase64Img(bf)
  state.size = blob.size
}

const translateToKb = (num: number) => {
  return Math.round(num / 1024) + 'kb'
}

const changeFile = async (e) => {
 const file: File = e.target.files[0]
 state.originSize = file.size

 compressImg({file, maxSize: 20})
}
</script>

<style lang="less">
.buffer-demo-name {
  display: inline-block;
  margin-bottom: 10px;
  padding: 5px 8px;

  font-size: 18px;
  font-weight: 500;

  border-radius: 20px;
  background: tan;
}
.buffer-demo-panel {
  margin-top: 10px;
  font-size: 16px;
}
</style>
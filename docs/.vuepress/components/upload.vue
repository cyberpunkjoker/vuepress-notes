<template>
  <div :style="{marginTop: '15px'}">
    <input type="file" placeholder="上传" id="input" @change="changeFile">
    <div class="data-panel">
      <div :key="item.name" v-for="item in dataList" class="data-panel-item">
        <span>{{item.label}}({{item.name}})：</span>
        <span :style="{fontWeight: '700'}">{{item.value}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { WavHead } from './utils'
import { WavParams } from './enum'
interface IlistItem {
  name: string;
  value: string;
  label: string;
}

const list:Array<IlistItem | void> = []
for (const key in WavParams) {
  list.push( {name: key, label: WavParams[key], value: ''} )
}

export default {
 data() {
   return {
     dataList: list
   }
 },

 methods: {
  async changeFile(e: any) {
    const file = e.target.files[0];
    const buffer = await file.arrayBuffer()
    const head = new WavHead(buffer);
    this.dataList = list.map((i:IlistItem) => {
      i.value = head[i.name]
      return i
    })
  }
 },

}
</script>

<style>
  .data-panel {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #000;
    border-radius: 5px;
  }
  .data-panel-item {
    margin-top: 5px;
  }
</style>
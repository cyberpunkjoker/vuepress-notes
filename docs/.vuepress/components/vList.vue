<template>
  <div> ------- v-list：定高，定行高简易版本 ------ </div>
  <div 
    class="v-list-container"
    @scroll="onListScroll"
  >
    <div class="v-list-warp">
      <div 
        class="v-list-item" 
        :key="i.id" 
        v-for="(i) in state.showList"
        :style="{top: i.id * rowHeight + 'px'}"
      >
        <div>{{i.value}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue'
  import { makeMockData } from './utils'
  
  const state = reactive({
    dataList: [],
    showList: [],
    scrollTop: 0,
    dataCount: 10000,
    height: 200,
    rowHeight: 40,
    bufferSize: 5,
  })

  const { dataCount, height, rowHeight, bufferSize } = state
  const limit = Math.ceil(height / rowHeight);
  let originStartIdx = 0
  let startIndex = Math.max(originStartIdx - bufferSize, 0)
  let endIndex = Math.min(
    startIndex + limit + bufferSize,
    dataCount - 1
  );

  onMounted(() => {
    getListData()
    calcCurrList()
  })

  const getListData = () => {
    state.dataList = makeMockData(dataCount)
  }

  const calcCurrList = () => {
    let data = []
    for (let i = startIndex; i <= endIndex; ++i) {
      data.push(state.dataList[i])
    }
    state.showList = data
  }

  const onListScroll = (e: any) => {
    const { scrollTop } = e.target
    const currIndex = Math.floor(scrollTop / rowHeight)
    if (startIndex !== currIndex) {
      startIndex = Math.max(currIndex - bufferSize, 0)
      endIndex = Math.min(currIndex + limit + bufferSize, dataCount - 1)
      state.scrollTop = scrollTop
    }
    
    calcCurrList()
  }

</script>

<style lang="less" scoped>
  .v-list-container {
    height: v-bind('height + "px"');
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    .v-list-warp {
      position: relative;
      height: v-bind('dataCount * rowHeight + "px"');
      .v-list-item {
        height: v-bind('rowHeight - 1 + "px"');
        line-height: v-bind('rowHeight + "px"');
        position: absolute;
        width: 100%;
        padding: 5px 10px;
        border-bottom: 1px dashed skyblue;
      }
    }
  }

 
</style>
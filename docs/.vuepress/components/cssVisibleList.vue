<template>
  <div> ------- css属性 content-visibility 版本 ------ </div>
    <div class="list-warp">
      <div 
        class="v-list-item" 
        :key="i.id" 
        v-for="(i) in state.dataList"
      >
        {{i.value}}
      </div>
    </div>
   
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue'
  import { makeMockData } from './utils'
  
  interface stateProps {
    dataList: any[]
  }

  const dataCount = 10000

  const state = reactive<stateProps>({
    dataList: [],
  })

  onMounted(() => {
    getListData()
  })

  const getListData = () => {
    state.dataList = makeMockData(dataCount)
  }

</script>

<style lang="less" scoped>
  .list-warp {
    height: 300px;
    border: 1px solid #ccc;
    overflow-y: auto;
  }
  .v-list-item {
    content-visibility: auto;
    contain-intrinsic-size: 19px;
  }
 
</style>
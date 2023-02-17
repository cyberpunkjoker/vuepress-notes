<template>
  <div class="ObListWarp">
    <div
      class="listItem"
      :id="item.id"
      v-for="(item, idx) in showList" 
      :key="item.id"
    >{{item.value}}</div>
    <div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, nextTick, reactive } from "vue"
  import { makeMockData } from './utils'

  const DATA_COUNT = 200 //所有数据数量
  const pageSize = 15    //默认首页数量
  const bufferSize = 2   //每次加载的默认数量
  let dataList: any[] = []     //总量数组

  const showList = ref<{value: string, id: number}[]>([])
  
  const listInfo = {
    start: 0,
    end: pageSize,
    startId: 0,
    endId: pageSize - 1,
  }

  const clacShowList = () => {
    const { start, end } = listInfo
    const arr: any[] = []
    for (let i = start; i <= end; i++) {
      arr.push(dataList[i])
      if (i === start) listInfo.startId = dataList[i].id
      if (i === end) listInfo.endId = dataList[i].id
    }
    showList.value = arr

    bindObserver()
    
  }

  const inObserveList = () => {
    const obList = document.querySelector('.ObListWarp')
    return obList.offsetTop
  }

  const callback = (entries) => {
    // 保证该内容到达可视区再进行操作
    if (document.documentElement.scrollTop + 900 < inObserveList()) return
    
    entries.forEach(async entry => {
      const { startId, endId } = listInfo
      const { isIntersecting, target } = entry
      
      if (isIntersecting && target.id == endId) { //表示进入可视区
        listInfo.end = Math.min(listInfo.end + bufferSize, dataList.length - 1)
        clacShowList()
      } 

      if (!isIntersecting && target.id == startId) { //表示离开可视区
        listInfo.start += 1
        clacShowList()
      }

      console.log(isIntersecting && target.id == startId);
      
      if (isIntersecting && target.id == startId) {
        listInfo.start = Math.max(listInfo.start - bufferSize + bufferSize, 0)
        clacShowList()
      }
    })
  }
  const observer = new IntersectionObserver(callback);

  onMounted(() => {
    dataList = makeMockData(DATA_COUNT)
    clacShowList()
  })

  const bindObserver = async () => {
    await nextTick()
    const doms = document.querySelectorAll('.ObListWarp .listItem')
    
    doms.forEach((item) => {
      observer.observe(item)
    })
  }

</script>

<style lang="less">
  .ObListWarp {
    height: 200px;
    padding: 5px 5px;
    border: 1px solid #eee;
    border-radius: 10px;
    overflow-y: auto;
    .listItem {
      padding: 5px 0;
    }
  }
</style>
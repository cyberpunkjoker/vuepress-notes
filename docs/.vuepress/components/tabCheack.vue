<template>
  <!-- 此方案是为检测所有loading状态，但依然会有数据不对等的情况出现 -->
  <div :style="{position: 'relative'}">
    <div class="cardList">
      <div>
        <div 
          class="card" 
          :key="item" 
          v-for="item in rect.cardList"
          @click="() => changCard(item)"
          :style="{background: item === rect.curId? 'pink': '#fff'}"
        >{{item}}</div>
      </div>
      <div class="content">{{rect.cacheInfo[rect.curId]?.content}}</div>
    </div>
    <div v-if="calcLoading()" class="loading">loading。。。</div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
const rect = reactive({
  cardList: [1,2,3,4,5,6],
  curId: undefined,
  cacheInfo: {},
})


const calcLoading = () => {
  if ( !rect.cacheInfo[rect.curId] ) return false
  return rect.cacheInfo[rect.curId].loadingList.some(i => i === true)
}

const fetch = (timeout: number, num: number):Promise<string> => {
  return new Promise((resovle) => {
    setTimeout(() => {
      resovle(`${num}---这是延时${timeout}的消息${Math.random()}`)
    }, timeout);
  })
}

const changCard = (i:number) => {
  const mapping = {
    1: 2000,
    2: 3000,
    3: 1000,
    4: 100,
    5: 6000,
    6: 50
  }
  rect.curId = i

  if (!rect?.cacheInfo[i]) rect.cacheInfo[i] = { loadingList: [], content: '' }
  rect.cacheInfo[i].loadingList.push(true)
  const idx = rect.cacheInfo[i].loadingList.length - 1

  fetch(mapping[i], i).then(res => {
    rect.cacheInfo[i].content = res
    rect.cacheInfo[i].loadingList[idx] = false
  })
}
</script>

<style lang="less">
  .cardList {
    display: flex;
    .card {
      padding: 5px;
      margin: 10px 0;
      border: 1px solid #000;
      cursor: pointer;
    }
    .content {
      width: 400px;
      border: 1px solid #333;
    }
  }
  .loading {
    position: absolute;
    width: 400px;
    top: 0;
    bottom: 0;
    left: 20px;
    text-align: center;
    line-height: 190px;
    background: rgba(255,255,255,.9);
  }

</style>
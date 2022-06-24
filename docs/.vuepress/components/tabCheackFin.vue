<template>
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
  return rect.cacheInfo[rect.curId].loading === true
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
  if (rect?.cacheInfo[i]?.loading) return console.log('请求未完成，请稍等一下～')
 
  if (!rect?.cacheInfo[i]) { // 第一次时初始化状态
    rect.cacheInfo[i] = { loading: true, content: '' }
  }

  rect.cacheInfo[i].loading = true

  fetch(mapping[i], i).then(res => {
    rect.cacheInfo[i].content = res
    rect.cacheInfo[i].loading = false
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
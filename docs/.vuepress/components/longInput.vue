<template>
  <div class="input-warpper">
    <div class="txt">{{rect.outTxt}}</div>
  </div>
  <button 
    class="btns"
    :key="i"
    v-for="i in rect.numList"
    @click="() => selectNum(i)"
  >{{i}}</button>

</template>

<script setup lang='ts'>
import { reactive } from 'vue'
const rect = reactive({
  numList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '#'],
  outTxt: ''
})

const selectNum = (i) => {
  rect.outTxt += i
}

</script>

<style lang="less" scoped>
.input-warpper {
  position: relative;
  width: 100px;
  height: 32px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 2px;
  overflow: hidden;
  
  .txt {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    min-width: 100%;
  }
}
</style>
<template>
  <div class="know-line">
    <div class="desc">
      <div>知识梳理模版</div>
    </div>
    <div class="line-item" :key="i.label" v-for="(i, idx) in lineList">
      <div :style="{minWidth: '65px'}">
        <span class="line-item-head" :style="{background: i.color}"></span>
        <span class="line-item-label">{{i.label}}：</span>
        <div class="linebar"></div>
      </div>
      <div class="line-item-content">
        <slot :name="`content_${idx}`"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { BaseColorType } from './enum/index'

type ColorType = keyof typeof BaseColorType;
type LineListItem = { lalbel: string, content: string, color?: ColorType }
interface ILineProps {
  /** 自定义模版时 传入 */
  lineList?: LineListItem[],
  /** 使用默认模版时 传入 */
  define?: string,
  reason?: string,
  todo?: string,
  extend?: string,
  boxColor?: ColorType,
}

export default defineComponent({
  props: ['lineList', 'define', 'reason', 'todo', 'extend', 'boxColor'],
  setup(props: ILineProps) {
    const { lineList, define, reason, todo, extend, boxColor='purple'} = props
    const state = reactive({
      lineList: [],
      boxColor: BaseColorType[boxColor],
    })

    // 颜色翻译函数
    const calcColor = (val: ColorType) => {
      return val ? BaseColorType[val] : BaseColorType.blue
    }

    if (lineList) { // 自定义分支
      state.lineList = lineList
    } else {  //默认模版分支
      const defaultLine = [
        { label: '原因', content: reason, color: 'yellow' },
        { label: '定义', content: define, color: 'blue' },
        { label: '使用', content: todo, color: 'green' },
        { label: '扩展', content: extend, color: 'red'}
      ]
      state.lineList = defaultLine
    }
    
    state.lineList =  state.lineList.map(i => {
      i.color = calcColor(i.color)
      return i
    })
    
    return {
      ...toRefs(state),
      calcColor,
    }
    
  },
})
</script>

<style lang="less">
.know-line {
  // title 盒子颜色：
  --title-box-color: v-bind(boxColor);
  --box-size: 8px;
  --negative-box-size: -5px;

  position: relative;
  margin-top: 30px;
  padding: 20px 10px;
  border: 2px solid var(--title-box-color);
  border-radius: 10px;
  .desc {
    position: absolute;
    left: 20px;
    top: -16px;
    display: inline-block;
    font-weight: 700;
    font-size: 18px;
    background: var(--title-box-color);
    transform: skewX(-37deg);
  }
  .desc>div {
    padding:0 10px;
    color: #fff;
    transform: skewX(37deg);
  }
  .line-item {
    display: flex;
    &-head {
      display: inline-block;
      margin-right: 5px;
      width: var(--box-size);
      height: var(--box-size);
      border-radius: 50%;
    }
    &-label {
      font-size: 16px;
      font-weight: 600;
    }
   
    &-content {
      font-size: 14px;
    }
  }
  .line-item:not(:last-child) {
     .linebar {
      height: calc(100% - var(--box-size));
      width: 2px;
      background: #f0f0f0;
      margin-right: 4px;
      transform: translate(3px, var(--negative-box-size));
    }
    .line-item-content {
      padding-bottom: 8px;
      margin-bottom: 3px;
      border-bottom: 1px solid #f0f0f0;
    }
  }
}
</style>

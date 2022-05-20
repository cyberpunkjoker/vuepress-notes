<template>
  <div class="v-list-view" @scroll="onScroll">
    <!-- 占高区域 -->
    <div class="v-height"></div>
    <div class="v-list" ref="vListRef">
      <div
        :key="i.id"
        :id="`item-${i.id}`"
        v-for="(i) in showList"
        class="v-list-item"
      >
        <div>item-{{i.id}}</div>
        {{i.value}}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue'
  import { makeMockData, binarySearch, CompareResult } from './utils'

  const props = {
    height: 400,
    estimatedRowHeight: 55,  //假设的每行高度
    total: 100000,
    bufferSize: 5,
    undateCount: 100
  }
  const rect = reactive({
    scrollTop: 0,
    dataList: [],
    cachedPositions: [],
    startIndex: 0,
    endIndex: 0
  })

  const { height, estimatedRowHeight, total, bufferSize, undateCount } = props
  
  const updateRate = Math.max(total / undateCount, 1)

  let limit = Math.ceil(height / estimatedRowHeight)
  let originStartIdx = 0
  rect.endIndex = Math.min(
    originStartIdx + limit + bufferSize,
    total - 1
  )

  const vListRef = ref(null)
  
  const viewHeight = computed(() => {
    return height + 'px'
  })
  const virtualHeight = computed(() => {
    const cachedPositionsLen = rect.cachedPositions.length
    const height = rect.cachedPositions[cachedPositionsLen - 1]?.bottom || 0
    return height + 'px'
  })
  const getTransform = computed(() => {
    return `translate3d(0,${
      rect.startIndex >= 1
        ? rect.cachedPositions[rect.startIndex - 1].bottom
        : 0
    }px,0)`})

  const showList = computed(() => {
    const { dataList } = rect
    if (dataList.length > 0) {
      let list = []
      for (let i = rect.startIndex; i <= rect.endIndex; ++i) {
        list.push(dataList[i])
      }
      return list
    } else {
      return []
    }
  })

  onMounted(() => {
    getDataList()
    if (vListRef && total > 0) {
      initCachedPositions()
    }
  })

  const getDataList = () => {
    rect.dataList = makeMockData(total, 'hard')
  }

  const initCachedPositions = () => {
    rect.cachedPositions = [];
    for (let i = 0; i < total; ++i) {
      rect.cachedPositions[i] = {
        index: i,
        height: estimatedRowHeight,
        top: i * estimatedRowHeight,
        bottom: (i + 1) * estimatedRowHeight,
        dValue: 0
      };
    }
  };

  const updateCachedPositions = () => {
    const nodes: NodeListOf<any> = vListRef.value.childNodes;
    const start = nodes[1] // 去掉第一个 text 节点

    nodes.forEach((node: HTMLDivElement) => {
      if (!node) return
      if (node.nodeType === 1) {
        const nodeHeight = node.getBoundingClientRect().height
        const index = Number(node.id.split("-")[1]);
        const oldHeigth = rect.cachedPositions[index].height
        const dValue = oldHeigth - nodeHeight

        if (dValue) {
          rect.cachedPositions[index].bottom -= dValue
          rect.cachedPositions[index].height = nodeHeight
          rect.cachedPositions[index].dValue = dValue
        }
      }
    })
    // 限制一下更新数组
    if ( Number(start.id.split("-")[1]) % updateRate === 0) {
      updateListBottom(start)
    }
  }

  const updateListBottom = (start) => {
    let startIdx = 0
    if (start) {
      startIdx = Number(start.id.split("-")[1])
    }
    let cumulativeDiffHeight = rect.cachedPositions[startIdx].dValue; //猜测高度与真实高度之间的差值
    rect.cachedPositions[startIdx].dValue = 0
    
    const cachedPositionsLen = rect.cachedPositions.length

    for (let i =  startIdx + 1; i < cachedPositionsLen; ++i) {
      const item = rect.cachedPositions[i]
      rect.cachedPositions[i].top = rect.cachedPositions[i - 1].bottom;
      rect.cachedPositions[i].bottom = rect.cachedPositions[i].bottom - cumulativeDiffHeight; //以下的每一个变化的都只是差值
    
      if (item.dValue !== 0) {
        cumulativeDiffHeight += item.dValue;
        item.dValue = 0;
      }
    }
  }

  // 采用二分法 快速查找
  const getStartIndex = (scrollTop = 0) => {
    let idx = binarySearch(
      rect.cachedPositions, 
      scrollTop,
      (currentValue: any, targetValue: number) => {
        const currentCompareValue = currentValue.bottom;
        if (currentCompareValue === targetValue) {
          return CompareResult.eq;
        }
        if (currentCompareValue < targetValue) {
          return CompareResult.lt;
        }
        return CompareResult.gt;
      }
    );
    return idx
  }

  const onScroll = (e: any) => {
    const { scrollTop } = e.target
    updateCachedPositions()
    const currentStartIndex = getStartIndex(scrollTop);
    if (currentStartIndex !== originStartIdx) {
      originStartIdx = currentStartIndex
      rect.startIndex = Math.max(originStartIdx - bufferSize, 0)
      rect.endIndex = Math.min(
        originStartIdx + limit + bufferSize,
        total - 1
      )
      rect.scrollTop = scrollTop
    }
  }
</script>

<style lang="less">
  .v-list-view {
    position: relative;  
    overflow-y: auto;
    overflow-x: hidden;
    height: v-bind(viewHeight);
    border: 1px solid #ccc;
    .v-height {
      height: v-bind(virtualHeight);
    }
    .v-list {
      width: 100%;
      position: absolute;
      top: 0;
      transform: v-bind(getTransform);
      .v-list-item {
        padding: 4px 10px;
      }
    }
  }
</style>
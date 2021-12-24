<template>
  <div 
    class="tag" 
    :style="{background: colorMap[colorType]}"
  >
    {{name}}
  </div>
</template>

<script lang="ts">

export default {
  props: {
    name: {
      type: String,
      default: null
    },
    colorType: {
      type: String,
      default: 'default'
    },
  },

  data() {
    return {
      colorMap: {
        default: 'var(--c-text-accent)',
        warn: 'var(--c-warning)',
        error: 'var(--c-danger)',
        info: 'var(--c-text-lightest)',
      }
    }
  }


}
</script>

<style lang="css">
  .tag {
    display: inline-block;
    margin-right: 5px;
    border-radius: 8px;
    padding: 1px 5px;
    text-align: center;
    font-weight: 700;
  }
</style>
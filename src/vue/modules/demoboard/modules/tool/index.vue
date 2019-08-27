<template>
  <div
    class="demo_tool_item"
    :style="{background: data.background}">
    <div class="left">
      <div v-html="data.html()"></div>
    </div>
    <div class="right">
      <i
        :class="`jeicon ${data.icon}`"
        :style="{color: data.color}"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    data: {
      type: Object,
      default: () => {},
    }
  },
}
</script>

<style lang="scss">
  .demo_tool_item {
    position: relative;
    padding: 15px 20px;
    height: 100%;
    border-radius: 6px;
    .left {
      float: left;
      position: relative;
      width: 70%;
      height: 100%;
      > div {
        width:100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding-left: 35px;
        p {
          font-size: 14px;
          color: #777777;
          &:not(:first-child) {
            margin-top: 7px;
          }
          .count {
            color: #444444;
            font-size: 22px;
            font-weight: bold;
          }
        }
      }
    }
    .right {
      float: right;
      position: relative;
      width: 30%;
      height: 100%;
      > i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 48px;
      }
    }
    &:after {
      content: '';
      display: table;
      clear: both;
    }
  }
</style>

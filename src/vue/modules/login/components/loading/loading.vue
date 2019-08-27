<template>
  <div
    v-show="show"
    class="loading"
  >
    <div class="content">
      <img src="./../../assets/loading.gif">
    </div>
  </div>
</template>
<script>
export default {
  name: 'Loading',
  data() {
    return {}
  }
}
</script>
<style scoped lang="scss">
.loading {
  position: absolute;
  width: 100%;
  background-size: 100% 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 999999;
  > .content {
    width: 434px;
    z-index: 999999;
    height: 520px;
    margin-left: auto;
    margin-right: auto;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -217px;
    margin-top: -260px;
    z-index: 99999;
    background-color: hsla(0,0%,100%,.4);
    transition: height .3s ease .15s;
    box-sizing: border-box;
    border-radius: 12px;
    img {
      margin-left: auto;
      margin-right: auto;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -25px;
      margin-top: -25px;
      width: 50px;
      z-index: 99999999;
      height: 50px;
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" >
.pro-gzq-home-log{
  background: #ffffff;
  .content-box{
    .day-box{
      border-width:0;
    }
      // border: 1px solid #e4e4e4;
  }
}
</style>
<template>
    <div class="pro-gzq-home-log">
        <div class="empty-box" v-show="!visible"  @click="setVisible(true)">
            <i class="jeicon jeicon-signing"></i> 
            提交日志...
        </div>
        <div class="content-box" v-show="visible">
          <log-record></log-record>
        </div>
    </div>
</template>

<script>
import LogRecord from '../log/record.vue'
export default {
  components:{LogRecord},
  props:{
      visible:{
          type:Boolean,
          default:false
      }
  },
  data() {
    return {
      visible:this.visible
    };
  },
  mounted() {
  },
  methods: {
    setVisible(visible){
      this.$emit('setVisible',visible);
    }
  }
};
</script>


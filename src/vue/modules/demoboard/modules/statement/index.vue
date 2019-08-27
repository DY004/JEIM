<template>
  <div>
    <div id="echarts" ref="echarts" style="width: 591px; height: 320px;"></div>
  </div>
</template>

<script>
export default {
  name: 'index',
  mounted() {
    this.initEcharts();
  },
  methods: {
    initEcharts() {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById('echarts'),'macarons');
      // 绘制图表
      this.myChart.setOption({
        backgroundColor: '#ffffff',
        tooltip: {
          trigger: 'axis'
        },
        color: ["rgb(0, 143, 255)", "rgb(255, 91, 91)", "rgb(45, 197, 91)"],
        legend: {
          data:['请假人天','加班人天','出差人天']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name:'请假人天',
            type:'line',
            data:[120, 132, 101, 134, 90, 230, 210, 220, 182, 191, 234, 290]
          },
          {
            name:'加班人天',
            type:'line',
            data:[220, 182, 191, 234, 290, 330, 310, 150, 232, 201, 154, 190]
          },
          {
            name:'出差人天',
            type:'line',
            data:[150, 232, 201, 154, 190, 330, 410, 120, 132, 101, 134, 90]
          },
        ]
      });
    },
  },
}
</script>

<style lang="scss" scoped>

</style>

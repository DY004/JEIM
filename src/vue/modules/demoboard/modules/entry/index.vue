<template>
  <div>
    <ul class="saleTools">
      <li
        v-for="(item, index) in entryList"
        :key="index"
        class="item name"
      >
        <div class="icon_wrp" :style="{background: item.color}">
          <i :class="`jeicon ${item.icon}`" :style="{color: item.color}"></i>
        </div>
        <div class="value">{{ item.label }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      entryList: [
        {
          label: '请假申请',
          color: 'rgb(254, 212, 91)',
          icon: 'jeicon-qjsq',
        },
        {
          label: '加班申请',
          color: 'rgb(32, 104, 225)',
          icon: 'jeicon-jbsq',
        },
        {
          label: '外出申请',
          color: 'rgb(253, 148, 119)',
          icon: 'jeicon-wcsq',
        },
        {
          label: '出差申请',
          color: 'rgb(53, 190, 227)',
          icon: 'jeicon-ccsq',
        },
        {
          label: '借款申请',
          color: 'rgb(89, 222, 179)',
          icon: 'jeicon-jksq',
        },
        {
          label: '用车申请',
          color: 'rgb(248, 104, 137)',
          icon: 'jeicon-ycsq',
        },
        {
          label: '酒店申请',
          color: 'rgb(59, 154, 208)',
          icon: 'jeicon-building1',
        },
        {
          label: '招待申请',
          color: 'rgb(59, 121, 250)',
          icon: 'jeicon-zdsq',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
  .saleTools {
    width: 80%;
    margin-left: 10%;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    cursor: pointer;
    justify-content: center;
    margin-top: 0;
    .item {
      list-style-type: none;
      width: 25%;
      text-align: center;
      padding-bottom: 3px;
      font-size: 14px;
      color: #333333;
      font-weight: 200;
      padding: 30px 0;
    }
    .icon_wrp {
      width: 58px;
      height: 58px;
      border-radius: 12px;
      position: relative;
      margin: 0 auto;
      > i {
        line-height: 40px;
        text-align: center;
        background: #fff;
        border-radius: 100%;
        font-size: 24px;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        margin-left: -20px;
        margin-top: -20px;
      }
    }
    .value {
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
      color: #333333;
      line-height: 24px;
    }
  }
</style>

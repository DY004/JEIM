<!--
 * @Author: Qinyonglian
 * @Date: 2019-08-19 10:15:52
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-26 11:37:47
 -->
<style rel="stylesheet/scss" lang="scss" scoped>
.ip-colleague {
  padding-top: 6px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .select-list {
    position: absolute;
    width: 100%;
    height: 300px;
    padding-left: 25px;
    background: #e9e9e9;
    z-index: 10000000;
    overflow: scroll;
    p {
      line-height: 30px;
      color: #333;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
</style>
<template>
  <div class="ip-colleague">
    <div
      v-if="flag&&!treeNode.length"
      class="list-no-data"
    >
      <i class="jeicon jeicon-Page" />
      <p>暂无数据</p>
    </div>
    <Tree
      :child-list="treeNode"
      v-else
    />
  </div>
</template>
<script>
import Tree from '../../components/tree';
import Organ from '../../controller/Organ';
import User from '../../controller/User';

export default {
  name: 'Colleague',
  components: {
    Tree,
  },
  data() {
    return {
      treeNode: [],
      Organ: new Organ(this),
      flag: false, // 暂无数据默认不显示
    };
  },
  mounted() {
    this.treeNodeList();
  },
  methods: {
    // 初始化组织树
    async treeNodeList() {
      this.treeNode = await this.Organ.getUserInfoByUserId(User.getUserId());
      !this.treeNode.length ? this.flag = true : this.flag = false;
    },
  },
};
</script>

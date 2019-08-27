<!--
 * @Author: Qinyonglian
 * @Date: 2019-08-16 09:28:18
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-26 11:34:15
 -->
<style>
.je-user-photo-parent {
  float: left;
  margin-top: 5px !important;
  margin-right: 5px !important;
}
.je-user-photo-parent .je-user-photo.photo-text,
.je-user-photo-parent .je-user-photo.photo-img {
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "./../styles/common.scss";
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
.tree {
  .tree-node-user {
    height: 40px;
    line-height: 40px;
    color: $font-color;
    font-size: 14px;
    @include common-hover;
  }
  .name-circle {
    width: 30px;
    height: 30px;
    display: inline-block;
    background: rgba(252, 179, 63, 1);
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    font-size: 12px;
    color: #fff;
  }
  .tree-node-div {
    position: relative;
    padding-left: 15px;
    cursor: pointer;
    .node-parent-close {
      transform: rotate(270deg);
      width: 7px;
      height: 3px;
      position: absolute;
      top: 13px;
    }
    .node-parent-open {
      width: 7px;
      height: 3px;
      position: absolute;
      top: 13px;
    }
    .tree-node-parent {
      color: $font-color;
      font-size: 14px;
      line-height: 29px;
      @include common-hover;
    }
    .icon-folder-open-1 {
      color: rgba(252, 179, 63, 1);
    }
    .icon-folder,
    .icon-folder-open-1 {
      margin-left: 12px;
    }
    .icon-folder {
      font-size: 12px;
      color: #dad8d8;
    }
  }
  .tree-node-active {
    background: #ededed;
  }
  .tree-node-dept-li {
    .avatar {
      width: 30px;
      height: 30px;
      vertical-align: middle;
      border-radius: 30px;
    }
  }
}

[v-cloak] {
  display: none !important;
}
</style>
<template>
  <ul class="tree">
    <li
      v-for="(item,index) of list"
      :key="index"
      :class="[isParent(item)?'tree-node-dept-li':'tree-node-user-li']"
    >
      <div
        v-cloak
        :class="[isParent(item)?'tree-parent':'','tree-node-div',(nodeId===item.id)?'tree-node-active':'']"
        @click.stop="handleToggle(item)"
        @dblclick="handleDB(item)"
      >
        <template v-if="isParent(item)">
          <img
            v-if="isParent(item)"
            :class="[item.open?'node-parent-open':'node-parent-close']"
            src="./../assets/tree-node.png"
          >
          <span
            v-if="isParent(item)"
            :class="[item.open?'fe icon-folder-open-1':'fe icon-folder']"
          />
        </template>
        <template v-else>
          <div
            v-html="item.photo"
            class="je-user-photo-parent"
          />
        </template>
        <span :class="[!isParent(item)?'tree-node-user':'tree-node-parent']">{{ item.text }}</span>
      </div>

      <template v-show="item.open && item.children.length > 0">
        <Tree
          :style="{paddingLeft:15+'px'}"
          v-show="item.open && item.children.length > 0"
          :child-list="item.children"
        />
      </template>
    </li>
  </ul>
</template>
<script>

import { EventBus } from '../common/eventBus';
import { EVENT_TYPE } from '../common/params';
import Organ from '../controller/Organ';
import Dialog from '../controller/Dialog';
import User from '../controller/User';
import { getItem } from '../common/util';

export default {
  name: 'Tree',
  props: {
    childList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      nodeId: '',
      allData: [],
      icon: `this.src="${require('./../assets/user-circle.png')}"`,
      Organ: new Organ(),
      Dialog: new Dialog(),
    };
  },
  computed: {
    list() {
      return this.childList;
    },
  },
  mounted() {
    EventBus.$on(EVENT_TYPE.TREE_NODE_ID, (target) => {
      this.nodeId = target;
    });
  },
  beforeDestroy() {
    EventBus.$off(EVENT_TYPE.TREE_NODE_ID);
  },
  methods: {
    // 是否是父节点
    isParent(item) {
      return !(item.type > 0);
    },
    // 点击
    handleToggle(item) {
      if (item.type <= 0) {
        item.open = !item.open;
      }
      item.isParent = this.isParent(item);
      EventBus.$emit(EVENT_TYPE.TREE_NODE_ID, item.id);

      const otherInfo = getItem('userid', item.id, window._im_people_list);
      EventBus.$emit(EVENT_TYPE.NOW_OBJ, { ...item, otherInfo });
    },
    async handleDB(item) {
      if (!item.isParent) {
        const newItem = await this.Dialog.createSingleChat(User.getUserId(), item.id);
        EventBus.$emit(EVENT_TYPE.CREATE_SINGLE_CHAT, newItem);
      }
    },
  },
};
</script>

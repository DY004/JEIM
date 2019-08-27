<style>
    .user-info-img,.user-info-img .photo-img,.user-info-img .photo-text{
        width:71px;
        height: 71px;
        line-height: 71px;
        font-size: 18px;
        cursor:inherit!important;
    }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/common.scss";
@import "../../styles/rightView/infoBoard.scss";
</style>
<template>
  <div class="ip-card">
    <!-- 部门 -->
    <div
      @click="goBack"
      class="back-chat-edit"
    >
      <i class="jeicon jeicon-angle-left" />
      返回
    </div>
    <div
      v-if="info.isParent"
      class="card-dept"
    >
      <div>
        <img
          src="../.././assets/user-circle.png"
        >
        <p class="dept-name">
          {{ info.name }}
        </p>
        <p class="dept-people">
          共{{ info.num }}人
        </p>
        <p class="dept-people">
          负责人：{{ info.chargeusername || '暂无' }}
        </p>
      </div>
    </div>

    <!-- 员工 -->
    <div
      v-else
      class="card-emp"
    >
      <div class="card-emp-headers">
        <div class="card-emp-header">
          <p class="card-emp-name">
            {{ info.otherInfo.name }}
          </p>
          <p class="card-emp-dept">
            {{ info.otherInfo.deptname }}
          </p>

          <img
            v-if="info.otherInfo.gender==='MAN'"
            src="../../assets/man.png"
            class="card-emp-sex"
          >
          <img
            v-else
            src="../../assets/woman.png"
            class="card-emp-sex"
          >
        </div>
        <div
          v-html="getUserPhoto"
          class="user-info-img"
        />
      </div>
      <div class="card-emp-content">
        <p class="card-emp-post">
          <span class="card-emp-key">职位</span><span class="card-emp-val">{{ info.otherInfo.sentrynames || '暂无' }}</span>
        </p>
        <p class="card-emp-phone">
          <span class="card-emp-key">手机</span><span class="card-emp-val">{{ info.otherInfo.usercode || '暂无' }}</span>
        </p>
        <p class="card-emp-tel">
          <span class="card-emp-key">座机</span><span class="card-emp-val">{{ info.otherInfo.zuoji || '暂无' }}</span>
        </p>
        <p class="card-emp-email">
          <span class="card-emp-key">邮箱</span><span class="card-emp-val">{{ info.otherInfo.companyemail || '暂无' }}</span>
        </p>
        <p class="card-emp-leader">
          <span class="card-emp-key">直接领导</span><span class="card-emp-val">{{ info.otherInfo.zsldname || '暂无' }}</span>
        </p>
        <p class="card-emp-register">
          <span class="card-emp-key">入职日期</span><span class="card-emp-val">{{ info.otherInfo.createtime || '暂无' }}</span>
        </p>
        <button @click="sendMessage(info)">
          发捷信
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { EVENT_TYPE } from '../../common/params';
import { EventBus } from '../../common/eventBus';
import Dialog from '../../controller/Dialog';
import User from '../../controller/User';

export default {
  name: 'InfoBoard',
  data() {
    return {
      info: {
        otherInfo: {
          sentrynames: '',
          usercode: '',
          zuoji: '',
          companyemail: '',
          zsldname: '',
          createtime: '',
        },

      },
      dialog: new Dialog(),
    };
  },
  computed: {
    getUserPhoto() {
      return JE.getUserPhoto(this.info.id, true);
    },
  },
  mounted() {
    EventBus.$on(EVENT_TYPE.NOW_OBJ, (target) => {
      this.info = target;
    });
  },
  beforeDestroy() {
    EventBus.$off(EVENT_TYPE.NOW_OBJ);
  },
  methods: {
    async sendMessage(item) {
      const newItem = await this.dialog.createSingleChat(User.getUserId(), item.id);
      EventBus.$emit(EVENT_TYPE.CREATE_SINGLE_CHAT, newItem);
    },
    goBack() {
      EventBus.$emit(EVENT_TYPE.HANDLEBACK);
    },
  },
};
</script>

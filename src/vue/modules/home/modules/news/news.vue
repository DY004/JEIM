<!-- 首页新闻 -->
<style lang="scss">
    .pro-crm-home-news{
        background: #ffffff;
        padding: 0 20px;
        position: relative;
        .news-edit{
            position: absolute;
            top: 12px;
            right: 30px;
            cursor: pointer;
            color: #cccccc;
            &:hover{
                color: #2f6bcf;
            }
        }
        .el-tabs__header{
            margin: 0;
        }
        .news-list{
            padding-bottom: 0;
            .je-vue-listview{
                padding-bottom:5px;
            }
        }
        .bottom{
            position: absolute;
            bottom:0;
            left:0;
            width:100%;
            height:50px;
            background: #f4f7fd;
        }
    }
</style>
<template>
    <div class="pro-crm-home-news">
        <div class="bottom"></div>
        <el-tabs v-model="activeTab" >
            <!-- 循环新闻模块 -->
            <el-tab-pane
                v-for="(item,index) in items" :key="index"
                :label="item.text"
                :name="item.code"
                lazy>
                <news-list :ref="'list-'+item.code" :type="item.code" autoload></news-list>    
            </el-tab-pane>
        </el-tabs>
        <i class="jeicon jeicon-edit news-edit" v-if="isSaasAdmin" @click="editFunc"></i>
  </div>
</template>
<script>
    import NewsList from './news_list.vue';

    export default {
      name:'home-news',
      components:{NewsList},
      data() {
          return {};
      },
      computed:{
          activeTab(){//初始化项
              return this.items[0].code;
          },
          items(){//根据新闻类型字典获得子项
              return JE.getDicItems('JE_SYS_NOTICETYPE');
          },
          isSaasAdmin(){//是否是管理员
              return JE.isSaasAdmin();
          }
      },
      methods: {
        /**
         * 编辑功能
         */
        editFunc() {
            JE.showFunc('JE_SYS_NOTICE',{funcPerm:false})
        }
      }
    };
</script>



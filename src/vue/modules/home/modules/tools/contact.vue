<style rel="stylesheet/scss" lang="scss" >
.pro-gzq-home-contact{
    background: #f5f7fe;
    .content-box{
        .searchbar{
            padding: 10px 20px 0 20px;
            color: #6a7794;
            font-size: 14px;
            line-height: 30px;
            .jeicon-user-department{
                font-size: 14px;
            }
            .dept-input{
                cursor: pointer;
                margin-right:10px;
                input{
                    cursor: pointer;
                }
            }
            .search{
                color:#2f6bcf;
                cursor: pointer;
                margin-left: 10px;
            }
        }
        .list-item{
            padding: 8px;
            border-radius: 8px;
            margin-bottom: 10px;
            background: #fff;
            border: 1px solid #f2f2f2;
            padding-left: 70px;
            position: relative;
            .info{
                line-height:24px;
                color:#666666;
                &>span{
                    margin-right:30px;
                    i{
                        color:#ababab;
                    }
                }

            }
            .photo{
                position: absolute;
                top: 12px;
                left: 10px;
                border-radius: 100%;
                .je-user-photo{
                    cursor: auto;
                }
            }
        }
    }
}
</style>
<template>
    <div class="pro-gzq-home-contact">
        <div class="empty-box" v-show="!visible"  @click="setVisible(true)">
            <i class="jeicon jeicon-signing"></i>
            提交通讯录...
        </div>
        <div class="content-box" v-show="visible">
            <div class="searchbar">
                部门：<el-input
                    ref="dept"
                    class="dept-input"
                    v-model="dept.text"
                    size="mini"
                    style="width:200px;"
                    suffix-icon="jeicon jeicon-user-department"
                    @clear="load"
                    @focus="handleDept"
                    clearable
                >
                </el-input>
                姓名：<el-input
                    ref="user"
                    v-model="keyword"
                    size="mini"
                    style="width:200px;"
                    @keyup.enter.native="load"
                    @clear="load"
                    clearable
                >
                </el-input>
                <span class="search" @click="load">查询</span>
            </div>
            <!-- 列表 -->
            <je-listview ref="list" v-loading="loading"
                :total-count="totalCount"
                :page-size="5"
                :empty-height="180"
                :item-height="77"
                @buildData="buildData"
                >
                <div slot="listitem" class="list-item" v-for="(item,index) of data" :key="index">
                        <div v-html="getUserPhoto(item)" class="photo"></div>
                        <div class="info">
                            <span v-html="formatKeyword(item.USERNAME) || '未知'"></span>
                            <span>{{item.DEPTNAME || '未知'}}</span>
                            <span>{{item.EXECUTIVENAME || '未知'}}</span>
                        </div>
                        <div class="info">
                           <span> <i class="jeicon jeicon-mobile"></i>
                            {{item.USERCODE || '未知'}}</span>
                            <span><i class="jeicon jeicon-telephone-circle-o"></i>
                            {{item.ZUOJI || '未知'}}</span>
                            <span><i class="jeicon jeicon-envelope-o"></i>
                            {{item.COMPANYEMAIL || '未知'}}</span>
                        </div>
                </div>
            </je-listview>
        </div>
    </div>
</template>

<script>
import ListView from '../../../../components/listview/listview';
import Util from '../../util/util.js'

export default {
  name: "contact",
  components:{'je-listview':ListView},
  props:{
      visible:{
          type:Boolean,
          default:false
      }
  },
  data() {
    return {
      totalCount: 0,
      visible:this.visible,
      loading:true,
      user:'',
      keyword:'',
      dept:{},
      data:[]
    }
  },
  mounted() {
        this.load();
  },
  methods: {
    setVisible:function(visible){
      this.$emit('setVisible',visible);
    },
    formatKeyword:function(text){
        var keyword = this.user;
        return Util.formatKeyword(text,keyword);
    },
    // 选择部门
    handleDept() {
        var me = this;
        if(me.loading){return;}
        JE.selectWin({
            title: '部门',
            configInfo: 'JE_RBAC_DEPARTMENT,,,S',
            type: 'tree',
            valueType:'id',
            value:me.dept.id,
            callback: (sels,oldVal,sswin) => {
                var dept = sels[0];
                if(dept){
                    me.dept = {
                        ids:[],
                        text:dept.get('text')
                    };
                    var node = sswin.down('jetreeview').store.getById(dept.get('id'));
                    node.cascadeBy(function(n){
                        me.dept.ids.push(n.get('id'));
                    });
                }else{
                    me.dept = {};
                }
                me.load();
            }
        })
    },
    /**
     * 获得分页信息
     */
    getList:function(){
        return this.$refs.list;
    },
    /**
     * 查询参数
     */
    getParams:function(){
        var pageInfo = this.getList().getPageInfo();
        var params = {
            tableCode:'JE_CORE_ENDUSER',
            start: pageInfo.start,
            limit: pageInfo.limit,
            // whereSql :"AND ZHID='"+JE.USER.zhId+"' "
            whereSql :'',
        };
        if(JE.isNotEmpty(this.dept.text)){
            params.whereSql += " AND DEPTID in ('"+this.dept.ids.join("','")+"')";
        }else{
            this.dept = {};
        }
        if(JE.isNotEmpty(this.user)){
            params.whereSql += " AND USERNAME LIKE '%"+this.user+"%'";
        }
        return params;
    },
    load:function(){
        this.user = this.keyword;
        this.getList().load();
    },
    buildData:function(){
        var me = this;
        me.loading = true;
        JE.ajax({
            url:'/je/portal/homePortal/loadUserAddress',
            params:me.getParams(),
            async : true,
            success: function(response){
                var data = JE.getAjaxData(response);
                me.data = data.rows;
                me.totalCount = data.totalCount;
                me.loading = false;
                setTimeout(function(){
                    me.$refs.dept.blur();
                    me.$refs.user.blur();
                },10);
            }
        });
    },
    // 用户头像
    getUserPhoto(item){
      return JE.getUserPhoto(item.USERID,true)
    }
  }
};
</script>


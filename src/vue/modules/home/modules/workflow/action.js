export default {
    methods:{
        /**
         * 加星
         */
        doStar(item, index) {
            var me = this;
            JE.ajax({
                url:'/je/jbpm/taskInfo/updateTaskPriority',
                params:{
                    taskId: item.taskId,
                    isNandY:this.isNandY,
                    priority: item.priority == '1'?'0':'1'
                },
                async:true,
                success:function(){
                    me.refresh();
                }
            });
        },
        /**
         * 延迟
         */
        doDelay(item, index) {
            var me = this,delay = item.delay;
            JE.ajax({
                url:'/je/jbpm/taskInfo/updateTaskDelay',
                params:{
                    taskId: item.taskId,
                    delay: delay == '1'?'0':'1'
                },
                async:true,
                success:function(){
                    me.refresh();
                    me.$emit('refreshItem',item.delay == '1'?'PREAPPROV':'DELAY');
                }
            });
        },
        /**
         * 查询参数
         */
        getParams:function(){
            var type = this.type,pageInfo = this.getList().getPageInfo();
            var params = {
                start: pageInfo.start,
                limit: pageInfo.limit,
                page: pageInfo.page,
                queryType:'PI_'+type,
                searchName:this.keyword,
                startDate:this.startDate,
                endDate:this.endDate,
                batchType:0,//批量
                isNandY:this.isNandY,//是否完结
                wfKeys:'',//流程类型
                whereSql:''
            };
            //获得流程类型节点的数据
            var node = this.getSelectNode();
            if(node){
                var wfKeys = [];
                var nodes = node.nodeInfo == 'PROCESS'?[node]:node.children;
                Ext.each(nodes,function(n){
                    n.nodeInfo == 'PROCESS' && wfKeys.push(n.code);
                });
                params.wfKeys = wfKeys.join(',');
                if(wfKeys.length>0){
                    params.whereSql = 
                        "AND EXECUTION_ID_ IN (SELECT ID_ FROM JBPM4_EXECUTION WHERE PROCDEFID_ in (SELECT PROCESSINFO_PROCESSDEFINIT_ID FROM JE_CORE_PROCESSINFO WHERE PROCESSINFO_LASTVERSION!='none' AND PROCESSINFO_DEPLOYSTATUS='1' AND PROCESSINFO_ENABLED='1' AND PROCESSINFO_PROCESSKEY IN ('" +
                        wfKeys.join("','") +
                        "')))";
                }
            }
            return params;
        },
        /**
         * 加载数据
         */
        buildData:function(node){
            var me = this;
            me.loading = true;
            JE.ajax({
                url:'/je/jbpm/taskInfo/getCurrentTask',
                params:me.getParams(node),
                async : true,
                success: function(response){
                    var data = JE.getAjaxData(response);
                    me.data = data.rows;
                    me.totalCount = data.totalCount;
                    me.loading = false;
                    me.$emit('refreshBadge',data,me.type);
                }
            });
        },
        refresh:function(){
            this.getList().refresh();
        },
        /**
         * 查看表单
         */
        itemClick:function(item,index){
            var me = this;
            item.priority = '0';
            me.$set(me.data,index,item);
            var obj=JE.ajax({
                url: JE.getUrlMaps("je.core.getInfoById"), //获得数据的地址
                params : {
                    tableCode: item.tableCode,
                    pkValue: item.pkValue
                }
            });
            if(obj.success != false){
                JE.showFunc(
                    item.funcCode,
                    //写死,
                    {
                        useChild: true,
                        values: obj,
                        height: JE.getBodyHeight() - 50,
                        width: JE.getBodyWidth() - 50,
                        readOnly: false,
                        type: "form",
                        callback: function (panel) {
                            var win = panel.up("window");
                            win.on("close", function (win) {
                                var SY_PREAPPROVUSERS = panel.form.findField(
                                    "SY_PREAPPROVUSERS"
                                );
                                var wfInfo = panel.wfInfo;
                                if (!SY_PREAPPROVUSERS) {
                                    return;
                                }
                                var preapprovUser = SY_PREAPPROVUSERS.getValue();
                                var flag = true;
                                //如果待审批人有多个   则也刷新表格   因为会签操作和传阅操作可能有多个  也执行了。
                                if (
                                    !Ext.isEmpty(preapprovUser) &&
                                    preapprovUser.split(",").indexOf(JE.currentUser.userId) != -1
                                ) {
                                    flag = false;
                                    if (wfInfo && wfInfo.btns.indexOf("wfSubmitBtn") == -1) {
                                        flag = true;
                                    }
                                }

                                //如果是会签   则判断当前表单如果含有改签则代表已处理会签。 刷新表格
                                if (wfInfo && wfInfo.btns.indexOf("wfChangePassBtn") != -1) {
                                    flag = true;
                                }
                                if (flag) {
                                    //加表格刷新
                                    me.refresh();
                                }
                            });
                        }
                    }
                );
            }
        }
    }
}
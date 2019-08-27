export default {
    methods:{
        /**
         * 查看详情
         */
        itemClick:function(item){
            var me = this,type = this.type == 'task'?'do':this.type;
            JE.showTransaction(item, type,function(){
                me.refresh();
            });
        },
        // 编辑
        handleEdit(itemObj) {
            let record = {
                data: itemObj
            };
            JE.sendTransaction({
                type: "edit",
                callback: function () { },
                showFn: function (win) {
                    var form = win.getCmp(0);
                    var data = record.data;
                    data.TASK_RWKSSJ2 = data.TASK_RWKSSJ;
                    data.TASK_YQJTHWC = data.TASK_YQJTHWC < 1 ? 1 : data.TASK_YQJTHWC;
                    data.TASK_JGTS = data.TASK_JGTS < 1 ? 1 : data.TASK_JGTS;
                    form.form.findField("TASK_TASKFS_CODE").setReadOnly(true);
                    Ext.each(["once", "repeat"], function (itemId) {
                    var item = form.getCmp(itemId);
                    Ext.each(item.query("[isFormField]"), function (field) {
                        field.setReadOnly(true);
                    });
                    });
                    form.form.setValues(data);
                    if (data.TASK_TASKFS_CODE == "repeat") {
                    form
                        .getDockedCmp("buttons")
                        .getCmp("again")
                        .show();
                    }
                }
            });
        },
        // 启用任务
        handleStart(item) {
            var me = this;
            JE.ajax({
                url:'je/job/job/startTask',
                params:{
                    JE_SYS_TASK_ID: item.JE_SYS_TASK_ID
                },
                async:true,
                success:function(){
                    me.refresh();//刷新数据
                }
            });
        },
        // 停用任务
        handleStop(item) {
            var me = this;
            JE.ajax({
                url:'je/job/job/startTask',
                params:{
                    JE_SYS_TASK_ID: item.JE_SYS_TASK_ID
                },
                async:true,
                success:function(){
                    me.refresh();//刷新数据
                }
            });
        },
        // 删除任务
        handleDeleteTask(item,index) {
            var me = this;
            var tip = me.$refs['tooltip-remove'][index];
            JE.confirm('是否删除', function (btn) {
                if (btn == 'ok') {
                    JE.ajax({
                        url:'je/job/job/deleteTask',
                        params:{
                            JE_SYS_TASK_ID: item.JE_SYS_TASK_ID,
                            TASK_TASKFS_CODE: item.TASK_TASKFS_CODE
                        },
                        async:true,
                        success:function(){
                            me.refresh();//刷新数据
                        }
                    });
                }
                setTimeout(() => {
                    tip.hide();
                }, 500)
            })
        },
        // 领取任务
        handleReceiveTask(item) {
            var me = this;
            JE.ajax({
                url:'/je/job/job/receiveTask',
                params:{
                    JE_SYS_JOB_ID: item.JE_SYS_JOB_ID,
                    JOB_RWFQRID: item.JOB_RWFQRID,
                    TASK_TASKFS_CODE: item.TASK_TASKFS_CODE,
                    JE_SYS_TASK_ID: item.JE_SYS_TASK_ID
                },
                async:true,
                success:function(){
                    me.refresh();//刷新数据
                }
            });
        },
        // 完成任务
        handleCompleteTask(item) {
            var me = this;
            JE.ajax({
                url:'je/job/job/finishTask',
                params:{
                    JE_SYS_JOB_ID: item.JE_SYS_JOB_ID,
                    JOB_RWFQRID: item.JOB_RWFQRID,
                    TASK_TASKFS_CODE: item.TASK_TASKFS_CODE,
                    JE_SYS_TASK_ID: item.JE_SYS_TASK_ID
                },
                async:true,
                success:function(){
                    me.refresh();//刷新数据
                }
            });
        },
        // 标记历史
        handleSignHistory(item) {
            var me = this;
            JE.ajax({
                url:'/je/job/job/setHistory',
                params:{
                    JE_SYS_JOB_ID: item.JE_SYS_JOB_ID
                },
                async:true,
                success:function(){
                    me.refresh();//刷新数据
                }
            });
        },
        // 批注
        handleAnnotation(item) {
            if (this.type === 'send') {
                var obj=JE.ajax({
                    url: '/je/selectOne', //获得数据的地址
                    params : {
                        tableCode: 'JE_SYS_JOB',
                        whereSql: "AND JE_SYS_TASK_ID ='"+item.JE_SYS_TASK_ID+"'"
                    }
                });
                if(obj.success){
                    this.showpz(obj.obj)
                }
            } else {
                this.showpz(item)
            }
        },
        showpz(item) {
            JE.CoreUtil.showPostil({
                funcCode: "JE_SYS_JOB",
                pkValue: item.JE_SYS_JOB_ID,
                userId: item.SY_CREATEUSERID,
                userName: item.SY_CREATEUSERNAME,
                openForm:true
            });
        },
        // 加星/取消加星
        handleCollection(item) {
            var me = this;
            JE.ajax({
                url:'/je/job/job/'+(item.JOBMX_JX=='1'?'cancelStar':'addStar'),
                params:{
                    JE_SYS_JOB_ID: item.JE_SYS_JOB_ID
                },
                async:true,
                success:function(){
                    me.refresh();//刷新数据
                }
            });
        }
    }
}
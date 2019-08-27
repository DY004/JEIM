<!-- 公司情况 -->
<style rel="stylesheet/scss" lang="scss" >
    .pro-crm-home-company{
        background: #ffffff;
        padding:0 20px;
        position: relative;
        .el-tabs.el-tabs--top{
            height:100%;
        }
        .content-box{
            margin-bottom: 10px;
            overflow: auto;
            position: relative;

            .empty-text{
                background-image: url(../../assets/images/je-nodata.png);
                background-size: 100% 100%;
                width: 120px;
                height: 130px;
                position: absolute;
                left: 50%;
                top: 50%;
                margin-top: -60px;
                margin-left: -65px;
            }
        }

        .files-box{
            .file{
                display: inline-block;
                width:70px;
                margin: 5px;
                text-align: center;
                cursor: pointer;
                padding: 5px;
                position: relative;
                &:hover{
                    background: #efefef;
                }
                .icon{
                    display: inline-block;
                    width: 42px;
                    height: 42px;
                    margin-bottom: 4px;
                    .jeicon{
                        width:100%;
                        height:100%;
                    }
                }
                .text{
                    height: 36px;
                    padding-top: 4px;
                    text-align: center;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
                }
                .download {
                    font-size: 12px;
                    padding: 2px 8px;
                    color: #000000;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    border: 1px solid #000000;
                    border-radius: 4px;
                    background: #fff;
                }
            }
        }
        .company-edit{
            position: absolute;
            top: 12px;
            right: 30px;
            cursor: pointer;
            color: #cccccc;
            &:hover{
                color: #2f6bcf;
            }
        }
    }
</style>
<template>
<div class="pro-crm-home-company">
    <el-tabs v-model="activeName" ref='tabs'>
    <el-tab-pane label="公司概况" name="YH_GSGK">
        <div class="content-box" :style="{height:minHeight+'px'}" v-html="getHTML('YH_GSGK')"></div>
    </el-tab-pane>
    <el-tab-pane label="开票信息" name="YH_FPXX">
        <div class="content-box" :style="{height:minHeight+'px'}" v-html="getHTML('YH_FPXX')"></div>
    </el-tab-pane>
    <el-tab-pane label="付款信息" name="YH_FKXX">
        <div class="content-box" :style="{height:minHeight+'px'}" v-html="getHTML('YH_FKXX')"></div>
    </el-tab-pane>
    <el-tab-pane label="常用文件" name="YH_CYWJ">
        <div class="content-box files-box" :style="{height:minHeight+'px'}">
            <div class="file"
            v-for="(file,index) of files" :key="index"
            :title="file.name"
            @click="openFile(file)"
            v-on:mouseenter="showDownload(index)"
            @mouseleave="showDownloadBtn = null">
                <div class="icon" :class="file.icon" :style="{color:file.color?file.color:'#ccc'}" style="font-size:40px;"><!--v-html="file.icon"-->
                </div>
                <div class="text" v-html="ellipsis(file.name)" ></div>
                <div class="download" @click="downloadImg($event, file)" v-show="showDownloadBtn == index">下载</div>
            </div>
            <div class="empty-text" v-show="files.length==0"></div>
        </div>
    </el-tab-pane>
    <el-tab-pane label="产品概述" name="YH_CPGK">
        <div class="content-box" :style="{height:minHeight+'px'}" v-html="getHTML('YH_CPGK')"></div>
    </el-tab-pane>
    </el-tabs>
    <i class="jeicon jeicon-edit company-edit" v-if="isSaasAdmin" @click="editInfo"></i>
</div>
</template>

<script>
export default {
  name: "company",
  data() {
    return {
      data: {},
      minHeight:380,
      activeName:'YH_GSGK',
      showDownloadBtn: null,
    };
  },
  computed:{
    files:function(){
        var files = JE.decode(Ext.value(this.data.YH_CYWJ,'[]'));
        Ext.each(files,function(file){
            var iconInfo = JE.getFileIcon(file.path);
            file.type = iconInfo.type;
            file.icon = iconInfo.icon;
            file.color = iconInfo.color;
        });
        return files;
    },
    isSaasAdmin(){//是否是管理员
        return JE.isSaasAdmin();
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
        changeHeight:function(height){
            var me = this,newHeight = height>me.minHeight?height:me.minHeight;
            Ext.each(me.$el.querySelectorAll('.content-box'),function(dom){
                dom.style.height = newHeight+'px';
            });
        },
        /**
         * 格式化html
         */
        getHTML:function(field){
            var html = this.data[field];
            return JE.isEmpty(html)?'<div class="empty-text"></div>':Ext.htmlDecode(html);
        },
        /**
         * 加载公司信息
         */
        loadData:function(){
            var obj=JE.ajax({
                url:'/je/saas/saasYh/getInfoById', //JE.getUrlMaps("je.core.getInfoById"), //获得数据的地址
                params : {
                    tableCode: 'JE_SAAS_YH',
                    pkValue: JE.currentUser.zhId
                }
            });
            //this.data = obj.success != false?obj:{};
            this.data=this.setDataNull(obj);
        },
        /**
         * 如果租户的公司信息为空则使用模板
         */
        setDataNull:function(obj){
            //公司概况
            var YH_GSGK = "&lt;p style=&quot;text-align: center;&quot;&gt;&lt;span style=&quot;font-size: 16px; text-align: center;&quot;&gt;&amp;nbsp;&lt;/span&gt;&lt;span style=&quot;text-align: center; color: rgb(63, 63, 63); font-family: 黑体, SimHei; font-size: 24px;&quot;&gt;XXXXXX公司&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;white-space: normal; font-size: 14px; color: #2f6bcf; border-color: #2f6bcf;&quot;&gt;&lt;span style=&quot;color: rgb(63, 63, 63); font-family: 黑体, SimHei; font-size: 24px;&quot;&gt;&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;white-space: normal; font-size: 14px; text-align: center;&quot;&gt;&lt;span style=&quot;font-size: 16px;&quot;&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;white-space: normal; font-size: 14px; text-align: center;&quot;&gt;&lt;span style=&quot;font-size: 16px;&quot;&gt;本公司LOGO图标&lt;/span&gt;&lt;/p&gt;&lt;section class=&quot;wwei-editor&quot;&gt;&lt;section&gt;&lt;section style=&quot;display: inline-block; min-width: 1em; height: 40px; background-color: #2f6bcf; line-height: 40px; vertical-align: middle; padding: 0px 10px; color: rgb(255, 255, 255);&quot;&gt;&lt;section style=&quot;min-width: 1em; height: 40px; font-size: 20px; line-height: 40px;&quot;&gt;&lt;span microsoft=&quot;&quot;&gt;&lt;strong style=&quot;font-size: 16px; white-space: normal;&quot;&gt;公司简介&lt;/strong&gt;&lt;/span&gt;&lt;strong style=&quot;font-size: 16px; white-space: normal;&quot;&gt;&lt;/strong&gt;&lt;strong style=&quot;font-size: 16px; white-space: normal;&quot;&gt;&lt;/strong&gt;&lt;/section&gt;&lt;/section&gt;&lt;span style=&quot;display: inline-block; width: 0px; height: 0px; border-width: 20px; border-style: solid; border-color: transparent transparent transparent #2f6bcf; border-image: initial; vertical-align: middle; font-size: 20px;&quot;&gt;&lt;/span&gt;&lt;/section&gt;&lt;section style=&quot;margin-left: 30px; border-top: 2px dashed #2f6bcf; border-right: 2px dashed #2f6bcf; border-bottom: 2px dashed #2f6bcf; border-image: initial; border-left: none; padding: 20px 0px; margin-top: -21px;&quot;&gt;&lt;section class=&quot;add&quot; style=&quot;margin-left: -20px;&quot;&gt;&lt;p style=&quot;white-space: normal; font-size: 14px;&quot;&gt;&lt;span style=&quot;font-size: 16px;&quot;&gt;&lt;br/&gt;&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;white-space: normal; font-size: 14px;&quot;&gt;&lt;span style=&quot;font-size: 16px;&quot;&gt;&amp;nbsp; &amp;nbsp; 请维护贵公司的简介信息..&lt;span style=&quot;font-size: 16px;&quot;&gt;.&lt;/span&gt;&lt;/span&gt;&lt;/p&gt;&lt;p class=&quot;active brush&quot; style=&quot;color: rgb(6, 6, 6);&quot;&gt;&lt;span microsoft=&quot;&quot; style=&quot;font-size: 14px;&quot;&gt;&lt;/span&gt;&lt;br/&gt;&lt;/p&gt;&lt;/section&gt;&lt;/section&gt;&lt;/section&gt;&lt;p&gt;&lt;span style=&quot;font-size: 16px;&quot;&gt;&lt;/span&gt;&lt;/p&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;&lt;section class=&quot;wwei-editor&quot;&gt;&lt;p style=&quot;white-space: normal;&quot;&gt;&lt;br/&gt;&lt;/p&gt;&lt;/section&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;";
            if(JE.isEmpty(obj.YH_GSGK)){
                obj.YH_GSGK=YH_GSGK;
            }
            //发票信息
            var YH_FPXX = "&lt;section class=&quot;wwei-editor&quot;&gt;&lt;section&gt;&lt;section style=&quot;display: inline-block; min-width: 1em; height: 40px; background-color: #2f6bcf; line-height: 40px; vertical-align: middle; padding: 0px 10px; color: rgb(255, 255, 255);&quot;&gt;&lt;section style=&quot;min-width: 1em; height: 40px; font-size: 20px; line-height: 40px;&quot;&gt;&lt;span microsoft=&quot;&quot;&gt;&lt;strong style=&quot;font-size: 16px; white-space: normal;&quot;&gt;XXXXXX公司开票信息&lt;/strong&gt;&lt;/span&gt;&lt;strong style=&quot;font-size: 16px; white-space: normal;&quot;&gt;&lt;/strong&gt;&lt;strong style=&quot;font-size: 16px; white-space: normal;&quot;&gt;&lt;/strong&gt;&lt;/section&gt;&lt;/section&gt;&lt;span style=&quot;display: inline-block; width: 0px; height: 0px; border-width: 20px; border-style: solid; border-color: transparent transparent transparent #2f6bcf; border-image: initial; vertical-align: middle; font-size: 20px;&quot;&gt;&lt;/span&gt;&lt;/section&gt;&lt;section style=&quot;margin-left: 30px; border-top: 2px dashed #2f6bcf; border-right: 2px dashed #2f6bcf; border-bottom: 2px dashed #2f6bcf; border-image: initial; border-left: none; padding: 20px 0px; margin-top: -21px;&quot;&gt;&lt;section class=&quot;add&quot; style=&quot;margin-left: -20px;&quot;&gt;&lt;p class=&quot;active brush&quot; style=&quot;color: rgb(6, 6, 6);&quot;&gt;&lt;span style=&quot;font-size: 20px; margin-right: 10px;&quot;&gt;⊙&lt;/span&gt;&lt;span microsoft=&quot;&quot; style=&quot;margin-right: 10px; font-size: 14px;&quot;&gt;单位名称：&lt;/span&gt;&lt;/p&gt;&lt;p class=&quot;active brush&quot; style=&quot;color: rgb(6, 6, 6);&quot;&gt;&lt;span style=&quot;font-size: 20px; margin-right: 10px;&quot;&gt;⊙&lt;/span&gt;&lt;span microsoft=&quot;&quot; style=&quot;font-size: 14px;&quot;&gt;单位地址：&lt;/span&gt;&lt;/p&gt;&lt;p class=&quot;active brush&quot; style=&quot;color: rgb(6, 6, 6);&quot;&gt;&lt;span style=&quot;font-size: 20px; margin-right: 10px;&quot;&gt;⊙&lt;/span&gt;&lt;span microsoft=&quot;&quot; style=&quot;font-size: 14px;&quot;&gt;开户银行：&lt;/span&gt;&lt;/p&gt;&lt;p class=&quot;active brush&quot; style=&quot;color: rgb(6, 6, 6);&quot;&gt;&lt;span style=&quot;font-size: 20px; margin-right: 10px;&quot;&gt;⊙&lt;/span&gt;&lt;span microsoft=&quot;&quot; style=&quot;font-size: 14px;&quot;&gt;账&amp;nbsp; &amp;nbsp; &amp;nbsp; 号：&lt;/span&gt;&lt;/p&gt;&lt;p class=&quot;active brush&quot; style=&quot;color: rgb(6, 6, 6);&quot;&gt;&lt;span style=&quot;font-size: 20px; margin-right: 10px;&quot;&gt;⊙&lt;/span&gt;&lt;span microsoft=&quot;&quot; style=&quot;font-size: 14px;&quot;&gt;税&amp;nbsp; &amp;nbsp; &amp;nbsp; 号：&lt;/span&gt;&lt;/p&gt;&lt;p class=&quot;active brush&quot; style=&quot;color: rgb(6, 6, 6);&quot;&gt;&lt;span style=&quot;margin-right: 10px; font-size: 20px;&quot;&gt;⊙&lt;/span&gt;&lt;span microsoft=&quot;&quot; style=&quot;font-size: 14px;&quot;&gt;电&amp;nbsp; &amp;nbsp; &amp;nbsp; 话：&lt;/span&gt;&lt;/p&gt;&lt;/section&gt;&lt;/section&gt;&lt;/section&gt;&lt;p&gt;&lt;span style=&quot;font-size: 16px;&quot;&gt;&lt;/span&gt;&lt;/p&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;&lt;section class=&quot;wwei-editor&quot;&gt;&lt;p style=&quot;white-space: normal;&quot;&gt;&lt;br/&gt;&lt;/p&gt;&lt;/section&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;";
            if(JE.isEmpty(obj.YH_FPXX)){
                obj.YH_FPXX=YH_FPXX;
            }
            //付款信息
            var YH_FKXX = "&lt;section class=&quot;wwei-editor&quot; style=&quot;white-space: normal;&quot;&gt;&lt;section&gt;&lt;section style=&quot;display: inline-block; min-width: 1em; height: 40px; background-color: #2f6bcf; line-height: 40px; vertical-align: middle; padding: 0px 10px; color: rgb(255, 255, 255);&quot;&gt;&lt;section style=&quot;min-width: 1em; height: 40px; font-size: 20px; line-height: 40px;&quot;&gt;&lt;span style=&quot;font-size: 16px;&quot;&gt;&lt;strong&gt;公司付款账号信息&lt;/strong&gt;&lt;/span&gt;&lt;/section&gt;&lt;/section&gt;&lt;span style=&quot;display: inline-block; width: 0px; height: 0px; border-width: 20px; border-style: solid; border-color: transparent transparent transparent #2f6bcf; border-image: initial; vertical-align: middle;&quot;&gt;&lt;/span&gt;&lt;/section&gt;&lt;section style=&quot;margin-left: 30px; border-top: 2px dashed #2f6bcf; border-right: 2px dashed #2f6bcf; border-bottom: 2px dashed #2f6bcf; border-image: initial; border-left: none; padding: 20px 0px; margin-top: -21px;&quot;&gt;&lt;section class=&quot;add&quot; style=&quot;margin-left: -20px;&quot;&gt;&lt;p class=&quot;active brush&quot; style=&quot;color: rgb(6, 6, 6);&quot;&gt;&lt;span style=&quot;font-size: 20px; margin-right: 10px;&quot;&gt;&lt;br/&gt;&lt;/span&gt;&lt;/p&gt;&lt;p class=&quot;active brush&quot; style=&quot;color: rgb(6, 6, 6);&quot;&gt;&lt;span style=&quot;font-size: 20px; margin-right: 10px;&quot;&gt;⊙&lt;/span&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;&lt;span style=&quot;font-family: 微软雅黑, sans-serif; letter-spacing: 3px; text-align: justify; background-color: rgb(255, 255, 255);&quot;&gt;银行开户行：&lt;/span&gt;&lt;/span&gt;&lt;/p&gt;&lt;p class=&quot;active brush&quot; style=&quot;color: rgb(6, 6, 6);&quot;&gt;&lt;span style=&quot;font-size: 20px; margin-right: 10px;&quot;&gt;⊙&lt;/span&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;&lt;span style=&quot;font-family: 微软雅黑, sans-serif; letter-spacing: 3px; text-align: justify; background-color: rgb(255, 255, 255);&quot;&gt;开户行账号：&lt;/span&gt;&lt;/span&gt;&lt;/p&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;&lt;span style=&quot;font-family: 微软雅黑, sans-serif; letter-spacing: 3px; text-align: justify; background-color: rgb(255, 255, 255);&quot;&gt;&lt;br/&gt;&lt;/span&gt;&lt;/span&gt;&lt;/section&gt;&lt;/section&gt;&lt;/section&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;";
            if(JE.isEmpty(obj.YH_FKXX)){
                obj.YH_FKXX=YH_FKXX;
            }
            //产品概况
            var YH_CPGK = "&lt;p style=&quot;white-space: normal; font-size: 14px; color: #2f6bcf; text-align: center; border-color: #2f6bcf;&quot;&gt;&lt;span style=&quot;color: rgb(63, 63, 63); font-family: 黑体, SimHei; font-size: 24px;&quot;&gt;XXXXXX产品简介&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;white-space: normal;&quot;&gt;&lt;br/&gt;&lt;/p&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;&lt;section class=&quot;wwei-editor&quot; style=&quot;white-space: normal;&quot;&gt;&lt;section&gt;&lt;section style=&quot;display: inline-block; min-width: 1em; height: 40px; background-color: #2f6bcf; line-height: 40px; vertical-align: middle; padding: 0px 10px; color: rgb(255, 255, 255);&quot;&gt;&lt;section style=&quot;min-width: 1em; height: 40px; font-size: 20px; line-height: 40px;&quot;&gt;&lt;span microsoft=&quot;&quot;&gt;&lt;strong style=&quot;font-size: 16px;&quot;&gt;产品简介&lt;/strong&gt;&lt;/span&gt;&lt;strong style=&quot;font-size: 16px;&quot;&gt;&lt;/strong&gt;&lt;/section&gt;&lt;/section&gt;&lt;span style=&quot;display: inline-block; width: 0px; height: 0px; border-width: 20px; border-style: solid; border-color: transparent transparent transparent #2f6bcf; border-image: initial; vertical-align: middle; font-size: 20px;&quot;&gt;&lt;/span&gt;&lt;/section&gt;&lt;section style=&quot;margin-left: 30px; border-top: 2px dashed #2f6bcf; border-right: 2px dashed #2f6bcf; border-bottom: 2px dashed #2f6bcf; border-image: initial; border-left: none; padding: 20px 0px; margin-top: -21px;&quot;&gt;&lt;section class=&quot;add&quot; style=&quot;margin-left: -20px;&quot;&gt;&lt;p class=&quot;active brush&quot; style=&quot;color: rgb(6, 6, 6);&quot;&gt;&lt;span style=&quot;font-size: 20px; margin-right: 10px;&quot;&gt;&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;font-size: 14px;&quot;&gt;&lt;span style=&quot;font-size: 16px;&quot;&gt;&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;font-size: 14px; background-color: rgb(254, 254, 254); line-height: 1.75em;&quot;&gt;&lt;span style=&quot;font-size: 16px;&quot;&gt;&lt;span style=&quot;font-size: 16px;&quot;&gt;&amp;nbsp; &amp;nbsp; &amp;nbsp;&amp;nbsp;&lt;/span&gt;&lt;/span&gt;&lt;span style=&quot;font-size: 16px;&quot;&gt;请维护贵公司产品的简介信息...&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;font-size: 14px; background-color: rgb(254, 254, 254);&quot;&gt;&lt;br/&gt;&lt;/p&gt;&lt;p style=&quot;font-size: 14px;&quot;&gt;&lt;span style=&quot;font-size: 16px;&quot;&gt;&lt;/span&gt;&lt;/p&gt;&lt;/section&gt;&lt;/section&gt;&lt;/section&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;&lt;p style=&quot;white-space: normal;&quot;&gt;&lt;br/&gt;&lt;/p&gt;&lt;p style=&quot;white-space: normal;&quot;&gt;&lt;br/&gt;&lt;/p&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;&lt;section class=&quot;wwei-editor&quot; style=&quot;white-space: normal;&quot;&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;&lt;/section&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;&lt;p style=&quot;white-space: normal;&quot;&gt;&lt;br/&gt;&lt;/p&gt;&lt;p style=&quot;white-space: normal;&quot;&gt;&lt;br/&gt;&lt;/p&gt;&lt;p style=&quot;white-space: normal;&quot;&gt;&lt;br/&gt;&lt;/p&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;";
            if(JE.isEmpty(obj.YH_CPGK)){
                obj.YH_CPGK=YH_CPGK;
            }

            return obj;
        },
        /**
         * 修改详情
         */
        editInfo:function(){
            var me= this,title = '',value = me.data[me.activeName];
            //获得标题
            Ext.each(me.$refs.tabs.panes,function(panel){
                if(panel.name == me.activeName){
                    title = panel.label;
                }
            });
            JE.win({
                title:title,
                autoShow:true,
                items:{
                    xtype:me.activeName == 'YH_CYWJ'?'uxfilesfield':'ueditor',
                    fileSizeLimit:50,
                    value:value
                },
                buttonAlign:'center',
                buttons:[{
                    text:'确定',
                    cls:'JEPLUS_B_L10',
                    handler:function(btn){
                        var win = btn.up('window');
                        value = win.getCmp(0).getValue();
                        var params = {
                            tableCode: 'JE_SAAS_YH',
                            JE_SAAS_YH_ID: me.data.JE_SAAS_YH_ID
                        };
                        params[me.activeName] = value;
                        //修改数据
                        JE.ajax({
                            url: params.JE_SAAS_YH_ID?'/je/saas/saasYh/doUpdate':'/je/saas/saasYh/doSave',//JE.getUrlMaps("je.core.update"), //获得数据的地址
                            params : params,
                            async : true,
                            success: function(response){
                                var data = JE.getAjaxData(response);
                                if(data.success){
                                    //更新数据
                                    me.$set(me.data,me.activeName,value);
                                    JE.msg('修改成功！');
                                }else{
                                    JE.error(data.message);
                                }
                            }
                        });
                        win.close();
                    }
                },{
                    text:'取消',
                    handler:function(btn){
                        btn.up('window').close();
                    }
                }]
            });
        },
        /**
         * 打开文件
         */
        openFile:function(file){
            if(file.type == 'image'){
                JE.File.openFileByPath(file.path,file.name,false,this.files);
            }else{
                window.open(JE.getFileUrl(file.path));
            }
        },
        /**
         * 格式化文件名
         */
        ellipsis:function(name){
            return name.length>14?name.substring(0,10)+'...':name;
        },
        /**
         * 常用文件-图片下载
         */
        downloadImg(e, file) {
            e.stopPropagation();
            let $a = document.createElement("a");
            const path = JE.getFileUrl(file.path);
            $a.setAttribute("href", path);
            $a.setAttribute("download", file.name)
            $a.click()
        },
        showDownload(index) {
            this.showDownloadBtn = index;
        },
  }
};
</script>


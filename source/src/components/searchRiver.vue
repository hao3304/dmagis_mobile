<template>
    <div>
        <div class='header'>
            <span class="title">河流流域查询</span>
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <div  class='search-river' v-loading.body='loading'>
            <div style="text-align:center;padding:5px 0">
                <el-button-group>
                    <el-button size='small' @click='onChange("first")' :type='activeName=="first"?"primary":"default"'>河流流域</el-button>
                    <el-button  size='small' @click='onChange("second")' :type='activeName=="second"?"primary":"default"'>自定义剖面</el-button>
                </el-button-group>
            </div>
            <div :style="{height:height +'px'}">
                <el-tree v-show='activeName == "first"' style='min-width:440px' :expand-on-click-node='false' :render-content="renderContent" :data='filterData'  highlight-current accordion   :props="props" >
                </el-tree>
                <x-section v-if='activeName == "second"'></x-section>
            </div>


            <el-dialog :title='form.name' size='small' v-model='customDialog'>

                <div v-loading.body='customLoading' style="padding:0 20px;">
                    <el-checkbox-group v-model="form.damIds" v-if='selectList.length>0'>
                        <div>请选择</div>
                        <div v-for='s in selectList'>
                            <el-checkbox :label="s.dbid">{{s.dbmc}}</el-checkbox>
                        </div>
                    </el-checkbox-group>
                    <p v-else>
                        没有相关大坝
                    </p>
                </div>

                <span slot='footer'>
                    <el-button type='success' @click='onShow'>预览</el-button>
                    <el-button type='primary' @click='onAddCustom'>确定</el-button>
                    <el-button @click='customDialog = false'>取消</el-button>
                </span>
            </el-dialog>

        </div>


    </div>
</template>
<style lang='less'>
    .search-river{
        overflow-x:auto;
        .el-tree-node__content{
            .fa{
                display: none;
                color:#0099cc;
                margin:0 3px;
            }
            &:hover{
                .fa{
                    display: inline;
                    color: #2e8ded;
                }
            }
        }
    }
</style>
<script>
    import {  getRivers,querySubRiverIDs,addSection,queryHaveDamRiverList } from '../modules/service.js';
    import xSection from './section.vue';
    import 'babel-polyfill';
    import { Toast } from 'mint-ui';
    export default{
        store:['container','rightSpan','dam','_map'],
        data(){
            return{
                treeData:[],
                props:{
                    label: 'name',
                    children: 'children'
                },
                query:'',
                loading:true,
                dialog:false,
                customDialog:false,
                ids:'',
                title:'',
                activeName:'first',
                height:document.documentElement.clientHeight - 100,
                form:{
                    name:'',
                    damIds: []
                },
                selectList:[]
            }
        },
        computed:{
            icons(){
                return this.query?'close':'search';
            },
            filterData(){
                return this.treeData;
            }
        },
        methods:{
            onClose(){
                this.$emit('close');
            },
            onCloseDialog() {
                this.dialog = false;
            },
            render(){

                Promise.all([queryHaveDamRiverList(),getRivers()]).then(([a,b])=>{
                    this.damRiver = a.objInfo.dataList;
                    this.list = JSON.parse(b);
                    this.treeData = this.transData(this.list.filter(l=>{
                        return this.damRiver.find(d=>{
                            return d.RIVERID == l.id;
                        })
                    }));
                    this.dam.rivers = this.treeData;

                    if(this.loading) {
                        this.loading = false;
                    }
                })
                /* getRivers().then((rep)=>{
                     this.treeData = this.transData(JSON.parse(rep));
                     this.dam.rivers = this.treeData;
                     if(this.loading) {
                         this.loading = false;
                     }
                 })*/
            },
            hasDam() {

            },
            transData(data) {
                let list = [];
                var getById = function(d){
                    let r = [];
                    for(var i in data) {
                        if(data[i].pId == d.id) {
                            r.push(data[i]);
                        }

                    }
                    if(r.length > 0 ){
                        d.children = r;
                        for(var i in r){
                            getById(r[i]);
                        }
                    }
                }

                for(var i in data){
                    if(data[i].pId == 0){
                        data[i].children = [];
                        list.push(data[i]);
                        getById(data[i]);
                    }
                }
                return list;
            },
            onAddCustom() {
                if(this.form.damIds.length < 2) {

                    return Toast({
                        message:'请至少选择选择大坝',
                        position:'bottom',
                        duration:3000
                    })


                }
                this.customDialog = false;
                addSection({
                    name:this.form.name,
                    damIds: this.form.damIds.join(',')
                }).then(rep=>{

                    this.$message({
                        showClose: true,
                        message: '提交成功',
                        type: 'success'
                    })
                })
            },
            onCustomClick(node){

                this.form.name = node.name;
                this.selectList = [];
                this.customLoading = true;
                this.customDialog = true;
                querySubRiverIDs({riverId:node.id}).then(rep=>{
                    let ll = rep.objInfo.dataList.map(d=>String(d.RIVERID));
                    ll.push(node.id);
                    if(ll.length>0) {
                        this.selectList = this.dam.list.filter(d=>{
                            return ll.indexOf(d.riverid)>-1;
                        });
                    }
                    this.form.damIds = this.selectList.map(s=>s.dbid);
                    this.customLoading = false;
                })
            },
            getSubRiver(node){
                let ids = [node.id];

                let loop = function(items){
                    items.forEach(item=>{
                        ids.push(item.id);

                        if(item.children&&item.children.length>0) {
                            loop(item.children);
                        }
                    });
                }
                if(node.children&&node.children.length>0) {
                    loop(node.children);
                }

                return ids;

            },
            onNodeClick(node,type){
                let list = [],pm = [];
                this.rightSpan.list = [];
                this.container.right = false;
                let ll = this.getSubRiver(node);
                if(ll.length>0){
                    this.dam.all.forEach(d=>{
                        if(ll.indexOf(d.riverid)>-1){
                            list.push(d);
                        }

                        if(d.riverid == node.id) {
                            pm.push(d);
                        }
                    });
                    if(type == 'section' && pm.length <=2) {
                        return Toast({
                            message:'相关大坝数量少于2个，无法绘制剖面，请选择其他流域查看！',
                            position:'bottom',
                            duration:3000
                        })
                    }

                    if(list.length>0){

                        if(type == 'section') {
                            this.ids = pm.map(l=>l.dbid).join(',');
                            this.title = node.name;
                            // this.dialog = true;
//                            layer.open({
//                                type:2,
//                                title:this.title,
//                                shadeClose: true,
//                                shade: false,
//                                maxmin: true, //开启最大化最小化按钮
//                                area: ['100%', '100%'],
//                                content: `./profile.html?sort=1&ids=${this.ids} `
//                            })

                            var webview = mui.openWindow({
                                url:`./profile.html?sort=1&ids=${this.ids} `
                            });

                        }else{
                            this.rightSpan.list = list;
                            this.rightSpan.name = node.name;
                            this.container.right = true;

                            this.dam.source = list;
                            this.dam.list = list;
                        }


                    }else{
                        return Toast({
                            message:'该流域下没有大坝数据',
                            position:'bottom',
                            duration:3000
                        })
                    }
                }


            },
            onShow(){
                this.ids = this.form.damIds.join(',');
                this.title = this.form.name;
                //this.dialog = true;
                layer.open({
                    type:2,
                    title:this.title,
                    shadeClose: true,
                    shade: false,
                    maxmin: true, //开启最大化最小化按钮
                    area: ['893px', '500px'],
                    content: `./profile.html?sort=1&ids=${this.ids} `
                })

            },
            onChange(type){
                this.activeName = type;
            },
            onIconClick(){this.query =''},
            renderContent(h, { node, data, store }){
                var self = this;
                return h('span',{

                },[
                    h('span',{},[
                        h('span',{
                            domProps:{
                                innerHTML:data.name
                            },
                            style: {
                                fontSize:'14px'
                            },
                            on:{
                                click(e){
                                    e.stopPropagation();
                                }
                            }
                        }),
                        h('i',{
                            class:{
                                'fa':true,
                                'fa-search':true
                            },
                            style: {
                                fontSize:'12px'
                            },
                            domProps:{
                                innerHTML:'查看'
                            },
                            on:{
                                click(e){
                                    e.stopPropagation();
                                    self.onNodeClick(data);
                                }
                            }
                        }),
                        h('i',{
                            class:{
                                'fa':true,
                                'fa-bar-chart':true
                            },
                            style: {
                                fontSize:'12px'
                            },
                            domProps:{
                                innerHTML:'剖面'
                            },
                            on:{
                                click(e){
                                    e.stopPropagation();
                                    self.onNodeClick(data,'section');
                                }
                            }
                        })
                    ])
                ])
            }
        },
        components:{
            xSection
        },
        mounted(){
            $('.search-river').height(document.documentElement.clientHeight - 85);
            this.render();
        }
    }
</script>

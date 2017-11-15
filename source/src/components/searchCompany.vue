<template>
    <div>
        <div class='header'>
            <!--<el-input-->
            <!--:icon='icons'-->
            <!--:on-icon-click='onIconClick'-->
            <!--size='small' placeholder='主管名称查询' v-model='query' style='width:80%;' ></el-input>-->
            主管单位
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <div  class='search-company'>
            <el-tree :data='treeData' style='min-width:440px' :render-content="renderContent"  highlight-current accordion @node-click='onNodeClick'   :props="props" >
            </el-tree>
        </div>
    </div>
</template>
<style lang='less'>
    .search-company{
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
    import {getDma,getZGDWList} from '../modules/service.js';

    export default{
        store:['container','rightSpan','dam'],
        data(){
            return{
                treeData:[],
                props:{
                    label: 'name',
                    children: 'children'
                },
                query:''
            }
        },
        computed:{
            icons(){
                return this.query?'close':'search';
            },
            filterData(){
                if(this.query){
                    return this.treeData.filter((t)=>{
                        return t.itemName.indexOf(this.query)>-1;
                    })
                }else{
                    return this.treeData;
                }
            }
        },
        methods:{
            onClose(){
                this.$emit('close');
            },
            render(){
                getZGDWList().then((rep)=>{
                    let result = JSON.parse(rep);
                    this.treeData = this.transTree(result)
                })
            },
            transTree(data){

                let top = data.filter(d=>d.isTop == 1);
                top.forEach(t=>{
                    data.forEach(d=>{
                        if(d.pId == t.id) {
                            if(!t.children) {
                                t.children = [];
                            }
                            if(d.isTop !='1') {
                                t.children.push(d);
                            }
                        }
                    })

                });
                return top;

            },
            loadNode(node,resolve){
                if(node.data.isTop == '1') {
                    node.data.children.forEach(c=>{
                        delete c.children;
                    })
                    return resolve(node.data.children.filter(c=>c.isTop !='1'));
                }else{
                    return resolve([]);
                }
//
//                if(node.id != 0){
//                    if(node.data.name){
//                        getDma({zgdw:node.data.name}).then((rep)=>{
//                            resolve(rep.map((r)=>{
//                                r.name = r.dbmc;
//                                r.children = [];
//                                return r;
//                            }))
//                        })
//                    }else{
//                        return resolve([]);
//                    }
//                }
            },
            onNodeClick(node){
                let params = node.isTop =="1"?{ssgs:node.name}:{zgdw:node.name};
                getDma(params).then((rep)=>{
                    if(rep.length == 0) {
                        this.$message('该节点下没有大坝。');
                    }else{
                        this.dam.list = rep;
                        this.dam.source = rep;

                        this.rightSpan.list = rep;
                        this.rightSpan.name = '大坝列表';
                        this.container.right = true;
                    }
                })
//                if(node.dbid){
//                    this.$emit('node-click',node);
//                }
            },
            onIconClick(){this.query =''},
            renderContent(h, { node, data, store }){
                let self = this;
                return h('span',{

                },[
                    h('span',{
                        on:{
                            click(e){
                                e.stopPropagation();
                            }
                        }
                    },[
                        h('span',{
                            domProps:{
                                innerHTML:data.name
                            },
                            style: {
                                fontSize:'12px'
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
                        })
                    ])
                ])
            }
        },
        mounted(){
//            $('.search-company').slimScroll({ height: document.documentElement.clientHeight - 37 });
//            $(window).resize(function(){
//                $('.search-company').slimScroll({ height: document.documentElement.clientHeight - 37 });
//            });
            $('.search-company').height(document.documentElement.clientHeight - 85);
            this.render();
        }
    }
</script>

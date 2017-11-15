<template>
    <div class="slider " style="z-index:1000">
        <!--<div class='collapse-side' v-show='collapse'>-->
            <!--<ul>-->
                <!--<li v-for='(n,$index) in navs'  class='parent-menu'>-->
                <!--<el-tooltip v-if='n.children.length == 0' class="item" effect="dark" :content="n.name" placement="right">-->
                    <!--<a href='javascript:;' @click='onSelect(n.url)'><i :class='n.icon'></i></a>-->
                <!--</el-tooltip>-->
                <!--<a v-else href='javascript:;' @click='onSelect(n.url)'><i :class='n.icon'></i></a>-->
                    <!--<ul class='children-menu' v-if='n.children.length>0'>-->
                        <!--<li class='children-menu-header'>-->
                                <!--<a>{{n.name}} <i class="el-submenu__icon-arrow el-icon-arrow-right"></i></a>-->
                        <!--</li>-->
                        <!--<li v-for='c in n.children' :class="{'active':active==c.url}">-->
                            <!--<a href='javascript:;' @click.stop='onSelect(c.url,$event)'> <i :class='c.icon'></i>&nbsp;&nbsp;{{c.name}}</a>-->
                        <!--</li>-->
                    <!--</ul>-->
                <!--</li>-->
            <!--</ul>-->
        <!--</div>-->

        <div>
            <el-menu
                    theme="dark"
                    @select="onSelect"
                    :default-openeds='["0"]'
                    >

                <template v-for="n in navs" v-if="n.children.length>0">
                    <el-submenu :index="n.url" >
                        <template slot="title">
                            <i :class="n.icon"></i>
                            <span>{{n.name}}</span>
                        </template>
                        <el-menu-item v-for="c in n.children" :index="c.url">{{c.name}}</el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="n.url">
                        <i :class="n.icon"></i>
                        <span>{{n.name}}</span>
                    </el-menu-item>
                </template>

            </el-menu>
        </div>

    </div>


</template>
<style lang='less'>


</style>
<script>
    export default{
        store:['container'],
        props:{
            name:''
        },
        data(){
            return {
                active:'',
                url:'',
                d:'',
                navs:[],
                collapse:true
            }
        },
        methods:{
            onSelect:function (v,e) {
                this.container.left = v;
                $(".sidebar-mini").addClass('sidebar-collapse');
            }
        },
        watch:{
            navs:function () {
                this.$nextTick(function () {
                    $('#slider-menus').slimScroll({height:document.documentElement.clientHeight - 48});
                });

                $(window).resize(function(){
                    $('#slider-menus').slimScroll({height:document.documentElement.clientHeight - 48});
                })
            },
            'container.left'(left){
                if(!left){
                    this.index = '';
                }
            }
        },
        mounted:function () {
            this.navs = [
                {
                    id:'1',
                    name:'综合查询',
                    icon:'fa fa-search fa-size',
                    url:'search',
                    children:[
                    ]
                },
                {
                    id:'2',
                    name:'分类查询',
                    icon:'fa fa-cubes fa-size',
                    url:'0',
                    children:[
                        {
                            id:'2-1',
                            name:'主管单位',
                            children:[],
                            icon:'fa fa-bars',
                            url:'company',
                        },
                        {
                            id:'2-2',
                            name:'省市区域',
                            children:[],
                            icon:'fa fa-file-text',
                            url:'region',
                        },
                        {
                            id:'2-3',
                            name:'流域分类',
                            children:[],
                            icon:'fa fa-envelope ',
                            url:'river',
                        }
                    ]
                },{
                    id:'3',
                    name:'综合分析',
                    icon:'fa fa-pie-chart',
                    url:'0',
                    children:[
                        {
                            id:'3-1',
                            name:'流域分布',
                           icon:'fa fa-bandcamp',
                            url:'river-region'
                        },
                        {
                            id:'3-2',
                            name:'应急管理',
                            icon:'fa fa-ambulance',
                            url:'emergency'
                        },
                        {
                            id:'3-3',
                            name:'降雨分析',
                            icon:'fa fa-tint',
                            url:'rainfall'
                        },
                        {
                            id:'3-4',
                            name:'专题分析',
                            icon:'fa fa-photo',
                            url:'theme'
                        }
                    ]
                },{
                    id:'3',
                    name:'工具栏',
                    icon:'fa fa-pencil',
                    url:'tool',
                    children:[]
                }
            ]

        }
    }
</script>

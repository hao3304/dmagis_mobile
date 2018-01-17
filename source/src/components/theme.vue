<template>
    <div>
        <div class='header'>
            <span class='title'>专题图</span>
            <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onClose' type="text" icon='circle-close'></el-button>
        </div>
        <div  class='theme' v-loading.body='loading'>

            <el-table :data=data  @expand='onExpand' row-key='ID'>
                <el-table-column type="expand">
                    <template scope="props">
                        <table>
                            <tr  v-for='c in props.row.children'>
                                <td>
                                    {{c.ISOSURFACE_NAME}}
                                </td>
                                <td>
                                    <span :style="{backgroundColor:c.ISOSURFACE_COLOR}"></span>

                                    <a @click='onShowChild(c.children,c.ISOSURFACE_NAME,props.row.NAME)' v-show='c.children.length>0' href="javascript:;">[{{c.children.length}}]</a>
                                </td>
                                <!--<td>-->
                                    <!--&lt;!&ndash;<el-button type='text' @click='onEditArea(c,props.row)' icon='edit'>&ndash;&gt;-->
                                    <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
                                    <!--&lt;!&ndash;<el-button type='text' icon='delete' @click='onDelArea(c,props.row)'>&ndash;&gt;-->
                                    <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
                                <!--</td>-->
                            </tr>
                        </table>
                    </template>
                </el-table-column>
                <el-table-column prop='NAME' label='名称'></el-table-column>
                <el-table-column label='操作' inline-template width='140px' >
                    <div>
                        <el-button type='text' icon='search' @click='onShowTheme(row)'>
                        </el-button>
                        <!--<el-button type='text' icon='edit' @click='onEditTheme(row)'>-->
                        <!--</el-button>-->
                        <!--<el-button type='text' @click='onDelTheme(row)' icon='delete'>-->
                        <!--</el-button>-->
                        <!--<el-button type='text' @click='onAddArea(row.ID)'>-->
                            <!--<el-tooltip class="item" effect="dark" content="添加等值面" placement="right">-->
                                <!--<i class="el-icon-plus"></i>-->
                            <!--</el-tooltip>-->
                        <!--</el-button>-->
                    </div>
                </el-table-column>
            </el-table>
            <!--<div style="padding:5px;">-->
                <!--<el-button icon='plus' @click='onAddTheme' type='primary' size='small' style='width:100%;'>新增</el-button>-->
            <!--</div>-->
        </div>

        <el-dialog :title='title' :visible.sync='faceDialog' :before-close="handleClose">
            <el-form :model="form" label-width='80px'  :rules="rules" ref='form'>
                <el-form-item label="名称" prop='ISOSURFACE_NAME'>
                    <el-input v-model="form.ISOSURFACE_NAME" placeholder='请输入等值面名称'></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="颜色">
                            <el-color-picker v-model="form.ISOSURFACE_COLOR"></el-color-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="排序">
                            <el-input-number v-model="form.SORT" :min="1" :max="99"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label='范围' prop='GIS_AREAS'>
                    <el-input v-model="form.GIS_AREAS"  placeholder='请输入geojson或者wkt格式范围数据'   type="textarea" :rows="5"></el-input>
                    <el-button size='small' @click='onShowDraw' type='primary' icon='edit'>手动绘制范围</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="faceDialog = false">取 消</el-button>
                <el-button type="primary" @click="onAreaSubmit">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog  title='专题图管理' :visible.sync='themeDialog' :before-close="handleClose">
            <el-form :model="theme" label-width='80px'  :rules="rules" ref='themeForm'>
                <el-form-item label="名称" prop='NAME'>
                    <el-input v-model="theme.NAME" placeholder='请输入专题图名称'></el-input>
                </el-form-item>
                <el-form-item label="应急事件">
                    <el-select style="width:400px" v-model="theme.EMERGENCY_ID" placeholder="请选择">
                        <el-option v-for="item in items" :label=" item[1] +' ('+item[0]+')'" :value="item[item.length-1]"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="themeDialog = false">取 消</el-button>
                <el-button type="primary" @click="onSubmitTheme">确 定</el-button>
            </div>
        </el-dialog>

        <draw-map @close='onCloseDraw' @select='onSelectDraw' v-if='drawDialog' :area='form.GIS_AREAS' :visible='drawDialog'></draw-map>

    </div>
</template>
<style lang='less'>
    .theme{
        .el-table__expanded-cell{
            padding:0;
            table{
                padding:0;
                margin-left:25px;
                tr{
                    padding:0 20px;
                    span{
                        display: inline-block;
                        height: 18px;
                        margin: 0 15px;
                        vertical-align:middle;
                        width: 40px;
                    }
                }
            }
        }
    }
</style>
<script>
    const jsts = require('jsts');
    import { getThemeList,getEmergency,addIsosurface,addTheme,deleteTheme,getIsosurface,editIsosurface,editTheme,delIsosurface } from '../modules/service.js';
    import drawMap from './drawMap.vue';
    const model = ()=>{
        return {
            ID:undefined,
            MAP_ID:'',
            GIS_AREAS:'',
            ISOSURFACE_NAME:'',
            ISOSURFACE_COLOR:'',
            SORT:'',
            DAM_IDS:''
        }
    }

    export default{
        store:['container','rightSpan','dam'],
        data(){
            return{
                data:[],
                form:model(),
                theme:{
                    NAME:'',
                    ID:'',
                    EMERGENCY_ID:''
                },
                current:[],
                faceDialog:false,
                themeDialog:false,
                loading:false,
                drawDialog:false,
                items:[],
                rules:{
                    'ISOSURFACE_NAME':[
                        {required:true, message: '请输入等值面名称', trigger: 'blur' }
                    ],
                    'GIS_AREAS':[
                        {required:true, message: '请输入等值面范围', trigger: 'blur' }
                    ],
                    'NAME':[
                        {required:true, message: '请输入专题图名称', trigger: 'blur' }
                    ]
                },
                title:'新增等值面'
            }
        },
        methods:{
            render() {
                this.loading = true;
                this.data = [];
                getThemeList().then(rep=>{
                    rep = JSON.parse(rep);
                    this.data = rep.map(r=>{
                        return {...r,...{children:[]}}
                    });
                    this.loading = false;
                })

            },
            getList(type) {
                getEmergency().then(rep=>{
                    rep=JSON.parse(rep);
                    this.items =  rep.tabList[0].infos;
                })
            },
            onClose() {
                this.$emit('close');
            },
            onAddTheme() {
                this.themeDialog = true;
                this.theme.NAME = '';
                this.theme.ID = '';
                this.theme.EMERGENCY_ID = '';
            },
            onEditTheme(row) {
                this.themeDialog = true;
                this.theme.NAME = row.NAME;
                this.theme.ID = row.ID;
                this.theme.EMERGENCY_ID = row.EMERGENCY_ID;
            },
            onAddArea(id) {
                this.faceDialog = true;
                this.form = model();
                this.form.MAP_ID = id;
                this.title = '新增等值面';
            },
            handleClose() {
                this.faceDialog = false;
                this.themeDialog = false;
            },
            onAreaSubmit() {
                this.$refs.form.validate(valid=>{
                    if(valid) {
                        this.faceDialog = false;
                        if(this.form.ID) {
                            let form = JSON.parse(JSON.stringify(this.form));
                            delete form['children'];
                            if(form.GIS_AREAS.indexOf('feature') > -1) {
                                let area = JSON.parse(form.GIS_AREAS);
                                form.GIS_AREAS = 'MULTIPOLYGON(((' + area.features[0].geometry.coordinates[0].map((c)=>{return c[0] +' ' + c[1]}).join(',') + ')))';
                            }

                            let result = this.getCount([JSON.parse(JSON.stringify(form))]);
                            form.DAM_IDS = result[0].children.map(c=>c.dbid).join(',');
                            editIsosurface(form).then(rep=>{
                                this.$message({
                                    type: 'success',
                                    message: '更新图层成功!'
                                });
                                this.render();
                            })

                        }else {
                            let form = JSON.parse(JSON.stringify(this.form));
                            if(form.GIS_AREAS.indexOf('feature') > -1) {
                                let area = JSON.parse(form.GIS_AREAS);
                                form.GIS_AREAS = 'MULTIPOLYGON(((' + area.features[0].geometry.coordinates[0].map((c)=>{return c[0] +' ' + c[1]}).join(',') + ')))';
                            }
                            let result = this.getCount([JSON.parse(JSON.stringify(form))]);
                            form.DAM_IDS = result[0].children.map(c=>c.dbid).join(',');
                            addIsosurface(form).then(rep=>{
                                this.$message({
                                    type: 'success',
                                    message: '新增图层成功!'
                                });
                                this.render();
                            })
                        }

                    }

                })
            },
            onSubmitTheme() {
                this.$refs.themeForm.validate(valid => {
                    if(valid) {
                        this.themeDialog = false;

                        if(this.theme.ID) {

                            editTheme({NAME:this.theme.NAME,ID:this.theme.ID,EMERGENCY_ID:this.theme.EMERGENCY_ID}).then(rep=>{
                                this.$message({
                                    type: 'success',
                                    message: '更新成功!'
                                });
                                this.render();
                            })
                        }else{
                            addTheme({NAME:this.theme.NAME,EMERGENCY_ID:this.theme.EMERGENCY_ID}).then(rep=>{
                                this.$message({
                                    type: 'success',
                                    message: '新增成功!'
                                });
                                this.render();
                            })
                        }


                    }

                })
            },
            onDelTheme(row) {
                this.$confirm('此操作将永久删除该专题图, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteTheme({ID:row.ID}).then(rep=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.render();
                    })
                }).catch(() => {

                });
            },
            onExpand(row,expand) {
                if(expand == undefined && row.children.length>0) {
                    return this.onShowChild(row.children[0].children,row.children[0].ISOSURFACE_NAME,row.NAME)
                }else if( expand == false || row.children.length > 0) {
                    return;
                }
                row.children = [];
                getIsosurface({MAP_ID:row.ID}).then(rep=>{
                    rep = JSON.parse(rep);
                    row.children = this.getCount(rep);
                    if(expand == undefined) {
                        this.onShowChild(row.children[0].children,row.children[0].ISOSURFACE_NAME,row.NAME);
                    }
                })
            },
            getCount(rep) {
                var reader = new jsts.io.WKTReader();
                rep.forEach(r=>{
                    let area = reader.read(r.GIS_AREAS);
                    r.children = [];
                    this.dam.list.forEach((l,index)=>{
                        if(l.longitude&&l.latitude){
                            let point = reader.read(`POINT (${l.longitude} ${l.latitude})`);
                            if(area.contains(point)) {
                                r.children.push(l);
                            }
                        }
                    })
                })

                return rep;

            },
            onEditArea(data,row) {
                this.form = {...data};
                this.form.MAP_ID = row.ID;
                this.faceDialog = true;
                this.title = '编辑等值面';
            },
            onShowTheme(row) {
                this.loading = true;

                getIsosurface({MAP_ID:row.ID}).then(rep=>{
                    rep = JSON.parse(rep);
                    let data = this.trans(rep);
                    this.$emit('search',data);
                    this.loading = false;
                    this.onExpand(row);
                })
            },
            trans(data) {
                return data.map(d=>{
                    return {
                        color:d.ISOSURFACE_COLOR,
                        area: this.getArea(d.GIS_AREAS),
                        name:d.ISOSURFACE_NAME,
                        str:d.GIS_AREAS
                    }
                })
            },
            getArea(str) {
                if(!str)return '';
                str = str.replace('MULTIPOLYGON(((','').replace(')))','');
                let ll = str.split(',');
                return ll.map(l=>{
                    let latlng = l.split(' ');
                    return [parseFloat(latlng[1]),parseFloat(latlng[0])]
                })
            },
            onDelArea(row,data) {
                this.$confirm('此操作将永久删除该图层, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delIsosurface({ID:row.ID}).then(rep=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.render();
                    })
                }).catch(() => {

                });
            },
            onShowDraw() {
                this.drawDialog = true;
            },
            onCloseDraw() {
                this.drawDialog = false;
            },
            onSelectDraw(geo) {
                this.form.GIS_AREAS = geo;
            },
            onShowChild(data,name,pname) {
                this.rightSpan.list = data;
                this.dam.source = data;
                this.dam.list = data;

                this.rightSpan.name = pname + '-' + name;
                this.container.right = true;
                this.$emit('filter',data);
            }

        },
        watch:{
            'theme.TYPE'(){
                this.getList();
            }
        },
        components:{
            drawMap
        },
        mounted(){
            $(this.$el).find('.theme').slimScroll({ height: document.documentElement.clientHeight - 37 });
            this.render();
            this.getList();
        }
    }
</script>

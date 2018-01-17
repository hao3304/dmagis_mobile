<template>
    <el-row style="height: 100%" :class="{'show-tip':tooltip&&zoom>=8,'small-icon':zoom<8&&zoom>6,'mini-icon':zoom<=6}"  >
        <el-col :span='24' class='main-wrap' v-show='container.left&&!container.right'  >
            <emergency @click='onEmergencyClick' @close='onCloseLeft' v-if='container.left == "emergency"' ></emergency>
            <rain  @close='onCloseLeft' @search='onSearchRainFall' v-if='container.left == "rainfall"' ></rain>
            <theme @close='onCloseLeft'  @search='onSearchRainFall' @filter='onThemeFilter'   v-if='container.left == "theme"' ></theme>
            <x-section @close='onCloseLeft'  v-if='container.left == "section"' ></x-section>
            <search-form @close='onCloseLeft' v-show='container.left =="search"'></search-form>
            <search-company @close='onCloseLeft' @node-click='flyTo' v-show='container.left =="company"'></search-company>
            <search-river @close='onCloseLeft' v-if='container.left =="river"'></search-river>
            <search-region @close='onCloseLeft' @select='onRegionSelect' v-if='container.left =="region"'></search-region>
            <river-region ref='region' @close='onCloseRiverRegion' @check='onRegionCheck' v-show='container.left =="river-region"'></river-region>
            <toolbar @toolbar-click="onToolbarClick" @close='onCloseLeft' v-show='container.left =="tool"' class='toolbar'></toolbar>
        </el-col>
        <el-col :span="24" class='main-wrap'  v-show='!container.left&&!container.right'  style="height: 100%;position:relative">
            <div id="map"  style="height: 100%"></div>
            <clegend :type='legend' @change='filterDam' @area-change='onAreaChange'  style="position: absolute;z-index: 1000;right: 10px;top:50px;"></clegend>
            <layers ref='layers' @change='onLayerChange' ></layers>
            <search @show="popup = true"></search>

            <div v-show="rightSpan.list&&rightSpan.list.length>0" @click="onCloseRiverRegion" style="display:none;position: absolute; z-index: 900; left: 40px; top: 50px;">
                <span class="legend-button"><img src="./static/images/clear.png" alt="" style="width: 25px; margin-top: 4px;">
                </span>
            </div>
            <pos @get-position='onGetPos'></pos>
            <!--<control @tooltip-change='onTooltipChange'></control>-->
            <!--<cheader style='position:absolute;z-index:1000;right:10px;top:0;'></cheader>-->
        </el-col>
        <el-col :span='24'  v-show='container.right' class='main-wrap' >
            <div class='header'>
                <span class='title'>{{rightSpan.name}}</span>
                <el-button style='float:right;color:#20a0ff;margin-top:2px;' @click='onCloseRight' type="text" icon='circle-close'></el-button>
                <el-button @click='mapView' style='float:right;color:#20a0ff;margin-top:2px;margin-right:20px;' type="text">
                    查看地图
                </el-button>
            </div>
            <el-table :height="height - 80"
                      highlight-current-row @row-click='flyTo'
                      border class='small-table'
                      :data="currentList"
                      style="width: 100%">
                <el-table-column
                        label="#"
                        type='index'
                        width='60'
                >   <template  scope="scope">
                    <span>{{scope.$index + (currentPage - 1)*50 +1}}</span>
                </template>
                </el-table-column>
                <el-table-column
                        label="名称"
                        prop='dbmc'
                >
                </el-table-column>
                <el-table-column
                        v-if='aroundSearch'
                        label="距离(公里)"
                        prop='distance'
                >
                </el-table-column>
                <el-table-column
                        label="省份"
                        prop='province'
                        :filters='filters'
                        :filter-method="filterTag"
                >
                </el-table-column>

                <el-table-column
                        label="坝高"
                        prop='height'
                >
                </el-table-column>
                <el-table-column
                        label="装机"
                        prop='capacity'
                >
                </el-table-column>
                <el-table-column
                        label="库容"
                        prop='storage'
                >
                </el-table-column>
                <el-table-column
                        label="监管"
                        prop='constructState'
                >
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="80"
                        v-if='login.id'
                        inline-template
                >
                    <span>
                        <a href='javascript:;' @click='onEditDb(row)'><i class='el-icon-edit'></i></a>
                        &nbsp;
                        <a href='javascript:;' @click='onDelDb(row)'><i class='el-icon-delete2'></i></a>
                    </span>
                </el-table-column>
            </el-table>
            <div style="text-align:center;">
                <el-pagination
                        small
                        :page-size.number=50
                        :current-page='currentPage'
                        layout="prev, pager, next"
                        @current-change='onCurrentChange'
                        :total="rightSpan.list.length">
                </el-pagination>
            </div>
        </el-col>

        <mt-popup v-model="dialog"   position="right"  style="width:100%;height:100%">
            <mt-header title="添加大坝">
                <span slot="left">
                    <mt-button @click='dialog = false'  icon="back">返回</mt-button>
                </span>
            </mt-header>
            <el-form v-if="dialog" :model="form" label-width="85px" ref='table' :rules='rules'  class='custom-form' >
                <el-row>
                    <el-col :span=24 >
                        <el-form-item label='所在省份'  prop='province'>
                            <el-select placeholder='请先选择省份' size='small' v-model='form.province' :disabled='type=="edit"'>
                                <el-option v-for='p in provinces' :label='p.name' :value='p.name' ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=24 v-show='form.province' >
                        <el-form-item label='所在地市'>
                            <el-select placeholder='请选择地市'  size='small' v-model='form.city' >
                                <el-option v-for='c in citys' :lable='c.name' :value='c.name' ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=24 v-show='form.province'  >
                        <el-form-item label='选择大坝' prop='dbid' >
                            <el-select placeholder='请选择大坝'  size='small' v-model='form.dbid' v-if='type=="add"' >
                                <el-option v-for='db in selectDB' :label='db.dbmc' :value='db.dbid' ></el-option>
                            </el-select>
                            <span v-else> {{editDbName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span=24  v-show='form.dbid'>
                        <el-form-item label='所在河流'>
                            <!--<el-cascader-->
                            <!--size='small'-->
                            <!--:show-all-levels="false"-->
                            <!--:options="dam.rivers"-->
                            <!--v-model='selectRiver'-->
                            <!--:props="{value:'id',label:'name',children:'children'}"-->
                            <!--&gt;</el-cascader>-->
                            <itree v-model='form.riverid' :data='dam.rivers'></itree>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-show='form.dbid'>

                    <el-col :span=12  >
                        <el-form-item label='填充颜色'>
                            <el-color-picker  v-model="form.bgColor"></el-color-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12  >
                        <el-form-item label='边框颜色'>
                            <el-color-picker v-model="form.borderColor"></el-color-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show='form.dbid'>
                    <el-col :span=24 >
                        <el-form-item label='大坝角度'>
                            <el-input size='small' type='number' placeholder="请输入大坝角度" v-model='form.angle' ></el-input>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span=12 >-->
                    <!--<el-form-item label='大坝长度'>-->
                    <!--<el-input size='small' type='number' placeholder="请输入大坝长度" v-model='form.length' ></el-input>-->
                    <!--</el-form-item>-->
                    <!--</el-col>-->
                </el-row>
                <el-row v-show='form.dbid'>
                    <el-col :span=24 >
                        <el-form-item label='经度' prop='longitude' >
                            <el-input size='small' placeholder='请输入经度'  v-model='form.longitude' type='number' ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=24 >
                        <el-form-item label='纬度' prop='latitude'  >
                            <el-input size='small' placeholder='请输入纬度' v-model='form.latitude' type='number' ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--<el-row v-if='form.dbid' :span='24'>-->
                <!--<pos :lat='form.latitude' @draw-polygon='onGetPolygon' @change='onGetPos' :fill='form.bgColor' :border='form.borderColor'  :angle='form.angle' :lng='form.longitude' :length='form.length' ></pos>-->
                <!--</el-row>-->
            </el-form>
            <div style="text-align:center;margin-top:20px;" class="dialog-footer">
                <el-button type="primary" @click='onSaveDb'>确 定</el-button>
                <el-button @click.native="dialog = false">取 消</el-button>
            </div>
        </mt-popup>

        <mt-popup
                v-model="popup"
                position="bottom"
                style="width:100%;height:100%"
        >

            <div class="mint-searchbar">
                <div class="mint-searchbar-inner">
                    <i class="mintui mintui-search"></i>
                    <input type="search" v-model="search_value" placeholder="搜索" class="mint-searchbar-core"></div>
                <a class="mint-searchbar-cancel" @click="onCancelSearch" style="">取消</a>
            </div>

            <div style="position: absolute;top:52px;bottom: 0;left: 0;right:0;overflow-y: scroll;">
                <a @click="onSearchClick(n)"  v-for="n in search_list" class="mint-cell"><!---->
                    <div class="mint-cell-left"></div>
                    <div class="mint-cell-wrapper"><div class="mint-cell-title"><!---->
                        <span class="mint-cell-text">{{n.dbmc}}</span> <!----></div>
                        <div class="mint-cell-value"><span>{{n.kind}}</span></div></div>
                    <div class="mint-cell-right"></div> <!---->
                </a>
            </div>

        </mt-popup>
        <el-dialog size="large" v-model='around_dialog'>
            <el-form :model='around_form' label-width='60px' :rules='rules2' ref='around-form' >
                <el-row>
                    <el-col :span=24 >
                        <el-form-item label='经度' prop='lng'>
                            <el-input type='number'  placehoder='请输入经度' v-model.number='around_form.lng'  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=24 >
                        <el-form-item label='纬度' prop='lat'>
                            <el-input  placehoder='请输入纬度' v-model.number='around_form.lat' number ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=24 >
                        <el-form-item label='距离' prop='distance'>
                            <el-input type='number' placehoder='请输入距离' v-model.number='around_form.distance' >
                                <template slot="append">千米</template>
                            </el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click='onSearchAround'>查 询</el-button>
                        <el-button @click.native="around_dialog = false">取 消</el-button>
                    </span>
        </el-dialog>
    </el-row>
</template>
<style lang='less'>

    .db_modal{
        position:fixed;
        top:0;
        right:0;
        width:350px;
        bottom:0;
        z-index:2000;
        background-color:#fff;
        padding:10px;
    }

    .custom-popup{
        .leaflet-popup-content{
            margin: 5px;
        }
    }

    .marker-hover{
        img{
            transform: scale(1) !important;
        }
    }
    .custom-form{
        .el-form-item{
            margin-bottom: 4px !important;
        }
    }
    .small-icon{
        .my-div-icon{
            img{
                transform: scale(0.8);
            }
        }
    }
    .mini-icon{
        .my-div-icon{
            img{
                transform: scale(0.6);
            }
        }
    }


    @media screen and (max-width:940px){
        .toolbar{
            top: 57px;
            right: 45px;
        }
    }


    .small-table.el-table{
        td,th{
            height: 32px;
        }
        .cell{
            font-size: 12px;
            line-height: 22px;
        }

    }
    .header{
        background-color:#eef1f6;
        color:#20a0ff;
        line-height:36px;
        padding:0 10px;
        span{
            font-size:14px;
        }
    }

    .show-tip{
        .my-div-icon{
            .tag{
                display: block;
            }
        }
    }

    .my-div-icon{
        .tag{
            position: absolute;
            left: 20px;
            top: -5px;
            white-space: nowrap;
            background-color: rgba(255,255,255,.9);
            padding: 2px 6px;
            background-color: #fff;
            border: 1px solid #fff;
            border-radius: 3px;
            color: #222;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            pointer-events: none;
            box-shadow: 0 1px 3px rgba(0,0,0,.4);
            display: none;

            &:before{
                content:' ';
                width:0;
                height:0;
                border-top:5px solid transparent;
                border-bottom:5px solid transparent;
                border-right:5px solid #fff;
                position: absolute;
                left: -6px;
                top: 6px;
            }
        }
    }

</style>
<script>
    import L from 'leaflet';
    import '../components/leaflet.chinese';
    import { getDma,setDbPosition,delDam,getDbList,getRivers } from '../modules/service';
    window.Spinner = require('spin');
    require('leaflet-spin')(L);
//    import '../components/zoomhome';
    import 'leaflet-editable';
    import 'leaflet-measure-path';
    import 'leaflet-contextmenu';
    import 'leaflet.markercluster';
    import toolbar from '../components/toolbar.vue';
    import clegend from '../components/legend.vue';
    import layers from '../components/layers.vue';
    import searchForm from '../components/searchForm.vue';
    import searchCompany from '../components/searchCompany.vue';
    import searchRegion from '../components/searchRegion.vue';
    import searchRiver from '../components/searchRiver.vue';
    import riverRegion from '../components/searchRiverRegion.vue';
    import search from '../components/search.vue';
    import cheader from '../components/header.vue';
    import pos from '../components/position.vue';
    import itree from '../components/itree.vue';
    import pip from '@mapbox/leaflet-pip';
    import emergency from '../components/emergency.vue';
    import rain from '../components/rain.vue';
    import control from '../components/control.vue';
    import theme from '../components/theme.vue';
    import position from '../components/position.vue';
    import section from '../components/section.vue';
    import randomColor from 'randomcolor'
    const jsts = require('jsts');
    require('leaflet.markercluster/dist/MarkerCluster.Default.css');

    import {province,city} from '../modules/province';
    import coordtransform from 'coordtransform';
    function model(){
        return {
            dbid:'',
            province:'',
            city:'',
            longitude:'',
            latitude:'',
            bgColor:'',
            borderColor:'',
            riverid:'',
            angle:'',
            area:'',
            length:''
        }
    }

    export default{
        store:['dam','layer','rightSpan','search','container','login','addList','_map','layers','showReset'],
        data() {
            return {
                height: document.documentElement.clientHeight - 40,
                zoom:4,
                //center:[30.46336022632844,116.25354766845705],
                center:[38,115],
                minZoom:2,
                tooltip:true,
                list:[],
                dialog:false,
                showArea:true,
                editDbName:'',
                type:'add',
                form:model(),
                popup:false,
                provinces:province,
                aroundSearch:false,
                rules:{
                    province:[
                        {required:true,message:'请选择所属省份',trigger:'blur'}
                    ],
                    dbid:[
                        {required:true,message:'请选择大坝',trigger:'blur'}
                    ],
                    longitude:[
                        {required:true,message:'请输入经度',trigger:'blur',type:'number'}
                    ],
                    latitude:[
                        {required:true,message:'请输入纬度',trigger:'blur',type:'number'}
                    ]
                },
                rules2:{
                    lat:[
                        {required:true,message:'请输入纬度',trigger:'blur',type:'number'}
                    ],
                    lng:[
                        {required:true,message:'请输入经度',trigger:'blur',type:'number'}
                    ],
                    distance:[
                        {required:true,message:'请输入距离',trigger:'blur',type:'number'}
                    ]
                },
                around_dialog:false,
                around_form:{
                    lng:null,
                    lat:null,
                    distance:null
                },
                currentPage:1,
                legend:'normal',
                search_value:''
            }
        },
        computed:{
            search_list() {
              if(this.search_value.length>0) {
                 return this.dam.list.filter(d=>{
                     return d.dbmc.indexOf(this.search_value)>-1;
                 })

              }  else{
                  return [];
              }
            },
            center_span(){
                let span = 24;
                if(this.container.left){
                    span = span - 5;
                }
                if(this.container.right){
                    span = span - 6;
                }

                return span;
            },
            filters(){
                var pros = {};
                this.rightSpan.list.forEach((l)=>{
                    pros[l.province] = 0;
                });
                return Object.keys(pros).map((name)=>{
                    return {text:name,value:name};
                });

            },
            citys(){
                let pid,result = [];
                this.provinces.forEach((p)=>{
                    if(p.name == this.form.province){
                        pid = p.ProID;
                    }
                });
                if(pid){
                    city.forEach((c)=>{
                        if(c.ProID == pid){
                            result.push(c);
                        }
                    })
                    return result;
                }else{
                    return [];
                }
            },
            selectDB(){
                return this.addList.filter(db=>{
                    return db.sf == this.form.province && db.isplaced == 0
                })
            },
            currentList() {
                return this.rightSpan.list.slice((this.currentPage-1)*50,this.currentPage*50);
            }
        },
        methods:{
            renderMap(){
                this.map = new L.map('map',{
                    center:this.center,
                    zoom:this.zoom,
                    minZoom:this.minZoom,
                    attributionControl:false,
                    zoomControl:false,
                    editable:true,
                    contextmenu: true,
                    contextmenuWidth: 140,
                    contextmenuItems: [
                        {
                            text: '周边查询',
                            callback:(e)=>{
                                this.around_form = {
                                    ...{lat:e.latlng.lat,
                                        lng:e.latlng.lng}
                                }
                                this.around_dialog = true;
                            }
                        },
                        {
                            text: '放大',
                            callback:()=>{
                                this.map.zoomIn();
                            }
                        },{
                            text: '缩小',
                            callback:()=>{
                                this.map.zoomOut();
                            }
                        }
                    ]
                });
                this.map.on('click',(e)=>console.log(e))
                L.control.zoom({position:'bottomright'}).addTo(this.map);
//                L.control.zoomhome({position:'topleft'}).addTo(this.map);

                this.normal = L.tileLayer.chinaProvider('Google.Normal.Map',{maxZoom:18,minZoom:2}).addTo(this.map);
                this.earth =new L.layerGroup();
                L.tileLayer.chinaProvider('Google.Satellite.Map',{maxZoom:18,minZoom:2}).addTo(this.earth);

                /* var wmsLayer = L.tileLayer.wms('http://183.247.147.228:8006/geoserver/nyc/wms?', {
                     layers:'nyc:region_dam',
                     crs:L.CRS.EPSG4326,
                     format:'image/png'
                 }).addTo(this.map); */

                this.markerLayers = new L.markerClusterGroup({maxClusterRadius:40}).addTo(this.map);
                this.measureLayers = new L.featureGroup().addTo(this.map);
                this.regionLayers = new L.featureGroup().addTo(this.map);
                this.typhoonLayers = new L.featureGroup().addTo(this.map);
                this.posLayers = new L.featureGroup().addTo(this.map);
                this.tempMarkerLayers = new L.featureGroup().addTo(this.map);

                /* this.regionLayers.on('click',(e)=>{
                         this.riverRegionLayers.clearLayers();
                         let area = e.layer._latlngs[0].map(l=>{
                             return [l.lng,l.lat];
                         })
                         this.riverRegionLayers.addData( {
                             "type":"Feature",
                             "properties": { "name":'叠加区域',"id":1000},
                             "geometry": {
                                 "type": "Polygon",
                                 "coordinates":[area]
                             }
                         });
                        this.riverRegionLayers.bringToBack();
                       let markers = this.list.filter(l=>{
                          if(l.longitude&&l.latitude) {
                             let b = pip.pointInLayer([parseFloat(l.longitude),parseFloat(l.latitude)],this.riverRegionLayers);
                             return b.length>0
                          }else{
                             return false
                          }
                     });


                     this.rightSpan.list = markers;
                     this.rightSpan.name = e.layer.options.name;
                     this.container.right = true;

                 })*/

                //流域图层
                let self = this;
                this.riverLayers = new L.featureGroup().addTo(this.map);
                this.riverRegionLayers = new L.geoJson([],{
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup(feature.properties.name);
                    },
                    style: function (feature) {
                        return {color: '#20a0ff',fillColor:self.getRandomColor(),fillOpacity:.46,weight:1,opacity:.8};
                    },
                }).addTo(this.map);
                //大坝区域
                this.areaLayers = new L.featureGroup();
                this.map.on('zoomend',(m)=>{
                    this.zoom = m.target._zoom;

                    if(this.markerType == 'river'){

                        this.markerLayers.eachLayer(layer=>{
                            let img =  $(layer._icon).find('img')[0];
                            let m = layer.options;
                            let path = this.getRiverIcon(m);
                            let  icon = L.divIcon({className:"my-div-icon",
                                iconAnchor: [2.4*this.zoom/2, 0.8*this.zoom/2],
                                html:`<img src="${path}" style="
                             width:${2.4*this.zoom}px;
                            height:${0.8*this.zoom}px;
                             transform:rotate(${m.angle||''}deg);
                             -ms-transform:rotate(${m.angle||''}deg);
                            -moz-transform:rotate(${m.angle||''}deg);
                            -webkit-transform:rotate(${m.angle||''}deg);
                            -o-transform:rotate(${m.angle||''}deg);
                             "><span class='tag'>${m.dbmc}</span>`});

                            layer.setIcon(icon)
                        })
                    }

                })

                this.map.spin(true);
                this.getDamList();
                this._map = this.map;
            },
            mapView(){
              this.container.left = false;
              this.container.right = false;
                let bounds = this.markerLayers.getBounds();
                if(bounds._northEast){
                    this.map.fitBounds(bounds);
                }
            },
            renderMarkers(rep,type){
                this.markerLayers.clearLayers();
                this.areaLayers.clearLayers();
                this.preType = type;
                rep.forEach((m)=>{
                    this.addMarker(m,type);
                });
                this.map.spin(false);
            },
            getRiverIcon(db) {

                /* if(type.indexOf('在建')>-1) {
                      return '/static/images/zaijian.png';
                 }else if(type.indexOf('前期')>-1){
                      return '/static/images/qianqi.png';
                 }else if(type.indexOf('规划')>-1){
                      return '/static/images/guihua.png';
                 }else{
                      return '/static/images/yijian.png';
                 }
  */
                return db.iconPath.replace('icon','icon2')
            },
            addMarker(m,type){
                this.markerType = type;
                if(typeof m.isShow  =='boolean'&& !m.isShow){
                    return;
                }

                let lat = parseFloat(m.latitude),
                    lng = parseFloat(m.longitude);
                if(lat&&lng){
                    let icon;
                    if(type !='river'){
                        icon = L.divIcon({
                            iconSize:[m.iconWidth,m.iconHeight],
                            className:"my-div-icon",
                            iconAnchor:[m.iconWidth/2,m.iconHeight-5],
                            html:`<img src="${m.iconPath}" style="width:${m.iconWidth}px;height:${m.iconHeight}px;"><span class='tag'>${m.dbmc}</span>`});
                    }else{
                        let path = this.getRiverIcon(m);
                        icon = L.divIcon({className:"my-div-icon",
                            iconAnchor: [2.4*this.zoom/2, 0.8*this.zoom/2],
                            html:`<img src="${path}" style="width:10px;
                             width:${2.4*this.zoom}px;
                            height:${0.8*this.zoom}px;
                             transform:rotate(${m.angle||''}deg);
                             -ms-transform:rotate(${m.angle||''}deg);
                            -moz-transform:rotate(${m.angle||''}deg);
                            -webkit-transform:rotate(${m.angle||''}deg);
                            -o-transform:rotate(${m.angle||''}deg);
                             "><span class='tag'>${m.dbmc}</span>`});
                    }
                    let ll = [];
                    if(type == 'river') {
                        ll = [lng,lat];
                    }else{
                        ll = coordtransform.wgs84togcj02(lng,lat);
                    }

                    let marker = new L.marker(ll.reverse(),{
                        icon:icon,
                        name:m.dbmc,
                        dbid:m.dbid,
                        ...m,
                        contextmenu: !!this.login.id,
                        contextmenuInheritItems:false,
                        contextmenuItems: [{
                            text: '编辑大坝',
                            index: 0,
                            callback:(e)=>{
                                this.onEditDb(e.relatedTarget.options,e)
                            }
                        }, {
                            text: '删除大坝',
                            index: 1,
                            callback:(e)=>{
                                this.onDelDb(e.relatedTarget.options,e);
                            }
                        }]

                    }).addTo(this.markerLayers);
                    marker.bindPopup('<iframe src="./detail.html?id='+m.dbid+'" style="border:none;width:360px;height:300px;" ></iframe>',{maxWidth:352,className:'custom-popup',minHeight:300});

                    marker.on('mouseover',(m)=>{
                        if(this.legend !='river') {
                            $(m.target._icon).addClass('marker-hover');
                        }


                        if(!this.tooltip){
                            m.target.bindTooltip(m.target.options.name,{direction:'right',offset:[0,-10]});
                            m.target.openTooltip();
                        }
                    }).on('mouseout',(m)=>{
                        $(m.target._icon).removeClass('marker-hover');
                        m.target.unbindTooltip();
                    });


                    if(m.area){
                        let latlngs = this._getGeo(m.area,',');
                        if(type !='river') {
                            latlngs = latlngs.map(c=>{
                                return coordtransform.wgs84togcj02(c[1],c[0]).reverse()
                            })
                        }
                        let polygon = new L.polygon(latlngs,{fillColor:m.bgColor,color:m.borderColor,weight:2,dbid:m.dbid,latlngs:this._getGeo(m.area,',')});
                        polygon.addTo(this.areaLayers);
                    }
                }
            },
            getRandomColor(){
                return randomColor({luminosity: 'light'})
            },
            getDamList(){
                let data = this.$ls.get('data');
                let t = false;
                if(data&&data.length>0) {
                    this.list = data;
                    this.dam.list = data;
                    this.dam.all = data;
                    this.dam.source = data;
                    t = true;
                    this.map.spin(false);
                }

                getDma().then((rep)=>{
                    if(!t) {
                        this.list = rep;
                        this.dam.list = rep;
                        this.dam.all = rep;
                        this.dam.source = rep;
                    }
                    // this.renderMarkers(this.list);
                    this.$ls.set('data',rep);
                    this.count = this.markerLayers.getLayers().length;
                });
            },
            onSearchClick(d){
              this.search = d;
              this.popup = false;
            },
            onToolbarClick(type){
                switch (type){
                    case 'measure-line':
                    case 'measure-polygon':
                        let feature = type=='measure-line'?this.map.editTools.startPolyline():this.map.editTools.startPolygon();
                        feature.addTo(this.measureLayers);
                        feature.on('editable:drawing:move editable:vertex:drag',()=>{
                            feature.showMeasurements();
                            feature.updateMeasurements();
                        });
                        feature.on('editable:drawing:commit',()=>{
                            feature.showMeasurements();
                            feature.updateMeasurements();
                            feature.disableEdit();
                        });
                        break;
                    case 'clear':
                        this.measureLayers.clearLayers();
                        break;
                    case 'Polyline':
                    case 'Polygon':
                    case 'Circle':
                    case 'Rectangle':
                        this.map.editTools[`start${type}`]().addTo(this.measureLayers);

                }
            },
            onLayerChange(type){
                this.map.removeLayer(this.earth);
                this.map.removeLayer(this.normal);
                this.mapType = type;

                if(this.container.left == 'river-region'&&type !='river') {
                    this.riverRegionLayers.eachLayer(layer=>{
                        layer.setStyle({fillOpacity:0,dashArray:[5, 5, 1, 5],weight:2})
                    })

                    return this[type].addTo(this.map);
                }

                if(this.container.left == 'river-region'&&type =='river') {
                    return this.riverRegionLayers.eachLayer(layer=>{
                        layer.setStyle({fillOpacity:0.6,weight:1,dashArray:null})
                    })
                }

                if(type == 'river'){
                    this.showArea = false;
                    this.map.removeLayer(this.areaLayers);
                    this.$refs.region.onShow('all');
                    this.preType = 'river';
                    this.markerLayers.eachLayer(layer=>{
                        if(layer.options.latitude&&layer.options.longitude){
                            layer.setLatLng([parseFloat(layer.options.latitude),parseFloat(layer.options.longitude)]);
                        }
                    })
                    this.areaLayers.eachLayer(layer=>{
                        layer.setLatLngs(layer.options.latlngs);
                    })


                }else{
                    if(this.preType == 'river') {

                        this.onCloseRiverRegion();
                        this.$refs.region.clean();
                        this.map.removeLayer(this.earth);
                        this.map.removeLayer(this.normal);
                    }
                    this.preType = type;
                    this[type].addTo(this.map);

                    if(type == 'normal') {
                        this.showArea = true;
                        this.markerLayers.eachLayer(layer=>{
                            if(layer.options.latitude&&layer.options.longitude){
                                let ll = coordtransform.wgs84togcj02(parseFloat(layer.options.longitude),parseFloat(layer.options.latitude));
                                layer.setLatLng(ll.reverse());
                            }
                        })

                        this.regionLayers.eachLayer(layer=>{
                            let ll =  layer.options.latlngs.map(c=>{
                                return coordtransform.wgs84togcj02(c[1],c[0]).reverse()
                            })
                            layer.setLatLngs(ll);
                        })

                        this.areaLayers.eachLayer(layer=>{
                            let ll =  layer.options.latlngs.map(c=>{
                                return coordtransform.wgs84togcj02(c[1],c[0]).reverse()
                            })
                            layer.setLatLngs(ll);
                        })

                        if(this.posMarker) {
                            let ll =  coordtransform.wgs84togcj02(this.posMarker._latlng.lng,this.posMarker._latlng.lat);
                            this.posMarker.setLatLng(ll.reverse());
                        }

                    }else if(type == 'earth') {
                        this.markerLayers.eachLayer(layer=>{
                            if(layer.options.latitude&&layer.options.longitude){
                                layer.setLatLng([parseFloat(layer.options.latitude),parseFloat(layer.options.longitude)]);
                            }
                        })

                        if(this.posMarker) {
                            let ll =  coordtransform.gcj02towgs84(this.posMarker._latlng.lng,this.posMarker._latlng.lat);
                            this.posMarker.setLatLng(ll.reverse());
                        }


                        this.regionLayers.eachLayer(layer=>{
                            layer.setLatLngs(layer.options.latlngs)
                        })

                        this.showArea = false;
                        this.map.removeLayer(this.areaLayers);
                        this.areaLayers.eachLayer(layer=>{
                            layer.setLatLngs(layer.options.latlngs);
                        })
                    }
                }
                setTimeout(()=>{ this.map.spin(false);},2000)
            },
            onTooltipChange(b){
                this.tooltip = b;
                if(b){
                    this.map.setZoom(8);
                }
            },
            filterDam(){
                this.map.spin(true);
                let list = [];
                if(this.legend == 'normal') {
                    list = this.dam.source.filter((l)=>{
                        let b = true;
                        b = this.layer.state.indexOf(l.isGisConfirm)>-1;
                        if(!b){
                            return b;
                        }
                        switch(this.layer.mode){
                            case '全国':{
                                b = true;
                            }break;
                            case '水利':
                            case '电力':
                                b = l.domination == this.layer.mode;
                                break;
                            default:
                                b = (l.domination !='电力'&& l.domination!='水利');
                        }
                        if(!b){
                            return b;
                        }

                        l.isShow = this.layer.legend.indexOf(l.kind)>-1;
                        return b;

                    });
                    this.dam.list = list;
                    if(this.container.right ){
                        this.rightSpan.list = list.filter(l=>l.isShow);
                    }

                    setTimeout(()=>this.renderMarkers(list),100);

                }else{
                    list = this.dam.source.filter(l=>{
                        let b = true;
                        b = this.layer.state.indexOf(l.isGisConfirm)>-1;
                        if(!b){
                            return b;
                        }
                        switch(this.layer.mode){
                            case '全国':{
                                b = true;
                            }break;
                            case '水利':
                            case '电力':
                                b = l.domination == this.layer.mode;
                                break;
                            default:
                                b = (l.domination !='电力'&& l.domination!='水利');
                        }
                        if(!b){
                            return b;
                        }

                        l.isShow = this.layer.legend.indexOf(l.kind)>-1;
                        return b;
                    })
                    this.dam.list = list;
                    if(this.container.right ){
                        this.rightSpan.list = list.filter(l=>l.isShow);
                    }
                    setTimeout(()=>this.renderMarkers(list,'river'),100);
                }


            },
            flyTo({dbid}){
                this.markerLayers.eachLayer((layer)=>{
                    if(layer.options.dbid == dbid){
                        return this.map.setView(layer._latlng,16);
                    }
                })
            },
            delMarker(dbid){
                this.markerLayers.eachLayer((layer)=>{
                    if(layer.options.dbid == dbid){
                        return this.markerLayers.removeLayer(layer);
                    }
                })
            },
            onCloseRight(){
                this.container.right = false;
                this.rightSpan.list = [];

                if(this.aroundSearch == true) {
                    this.measureLayers.clearLayers();
                    this.onCloseLeft();
                    this.aroundSearch = false;
                }

            },
            onCloseLeft(){
                this.regionLayers.clearLayers();
                this.typhoonLayers.clearLayers();
                this.riverRegionLayers.clearLayers();
                this.container.left = false;
                this.layers.active = 'normal';
                if(this.markerLayers.getLayers().length != this.count) {
//                    this.map.spin(true);
                    setTimeout(()=>this.dam.source = this.dam.list = this.list,100)
                }
            },
            filterTag(value,row){
                return row.province == value;
            },
            onCancelSearch(){
                this.popup = false;
                this.search_value = "";
            },
            onRegionSelect(region){
                this.regionLayers.clearLayers();
                let data = [];
                region.forEach((r)=>{

                    if(r.Geometry){
                        let polygon = new L.polygon(this._getGeo(r.Geometry),{fillColor:r.Color||this.getRandomColor(),weight:2});
                        polygon.bindPopup(r.RegionName);
                        polygon.addTo(this.regionLayers);

                        var reader = new jsts.io.WKTReader();
                        let area = reader.read(r.Geometry);

                        this.list.forEach((l,index)=>{
                            if(l.longitude&&l.latitude){
                                let point = reader.read(`POINT (${l.longitude} ${l.latitude})`);
                                if(area.contains(point)&&!data.find(d=>d.dbid==l.dbid)) {
                                    data.push(l);
                                }
                            }
                        })
                    }
                });

                if(data.length>0) {
                    this.rightSpan.list = data;
                    this.dam.source = data;
                    this.dam.list = data;
                    this.rightSpan.name = '省市区域查询结果';
                    this.container.right = true;
                }

                let bounds = this.regionLayers.getBounds();
                if(bounds._northEast){
                    this.map.fitBounds(bounds);
                }
            },
            _getGeo(str,split){
                let result = [];
                str = str.replace('POLYGON ((','').replace('))','');
                let list = str.split(split?split:', ');
                list.forEach((l)=>{
                    let latlng = l.split(' ');
                    let lat = parseFloat(latlng[1]);
                    let lng = parseFloat(latlng[0]);
                    if(lat&&lng){
                        result.push([lat,lng]);
                    }
                });
                return result;
            },
            onAddDb(e){
                this.dialog = true;
                this.form = {...model()};
                if(this.$refs.table&&this.$refs.table.retFields){
                    this.$refs.table.retFields();
                }
                this.type = 'add';
                this.form.longitude = e.latlng.lng;
                this.form.latitude = e.latlng.lat;

                this.tempMarkerLayers.clearLayers();
//                let marker = new L.marker([this.form.latitude,this.form.longitude],{draggable:true}).addTo(this.tempMarkerLayers);
//                marker.bindPopup("可以拖动我").openPopup();
//                marker.on("dragend",e=>{
//                    this.form.longitude = e.target._latlng.lng;
//                    this.form.latitude = e.target._latlng.lat;
//                })


            },
            onDelDb(options,e){
                let dbid = options.dbid;
                let name = options.name;
                if(dbid){
                    layer.open({
                        title:'提示',
                        icon:8,
                        content:`是否删除该大坝?`,
                        btn:['确定','取消'],
                        yes:()=>{
                            layer.load(1);
                            delDam(dbid).then(rep=>{
                                let result = eval(rep);
                                layer.closeAll();
                                this.$message({
                                    type: result?'success':'error',
                                    message: result?'删除成功！':'删除失败！'
                                });
                                this.markerLayers.removeLayer(e.relatedTarget);
                                this.areaLayers.eachLayer(layer=>{
                                    if(layer.options.dbid == dbid){
                                        this.areaLayers.removeLayer(layer);
                                    }
                                })
                                // this.init();
                            })
                        }
                    })
                }
            },
            onSaveDb(){
                this.$refs.table.validate(valid=>{
                    if(valid){
                        layer.load(1);
                        setDbPosition(this.form).then(rep=>{
                            layer.closeAll();
                            this.dialog = false;
                            if(eval(rep)){
                                this.$message({
                                    type: 'success',
                                    message: '提交成功！'
                                });
                                this.delMarker(this.form.dbid);
                                this.map.spin(true);
                                getDma({dbid:this.form.dbid}).then(rep=>{
                                    this.map.spin(false);
                                    let result = rep[0];
                                    this.list.push(result);
                                    this.dam.list.push(result);
                                    this.addMarker(result);
                                    // this.init();
                                })
                            }
                        })
                    }
                })
            },
            onEditDb(d, e){
//                e.relatedTarget.enableEdit();
//                this.relatedTarget = e.relatedTarget;
                this.form = {...{
                    dbid:d.dbid,
                    province:d.province,
                    city:d.city,
                    longitude:parseFloat(this.around_form.lng),
                    latitude:parseFloat(this.around_form.lat),
                    bgColor:'',
                    borderColor:'',
                    riverid:d.riverid,
                    angle:d.angle,
                    area:d.area,
                    length:''
                }}
                this.type = 'edit';
                this.editDbName = d.name || d.dbmc;

//                e.relatedTarget.on("dragend",e=>{
//                    this.form.longitude = e.target._latlng.lng;
//                    this.form.latitude = e.target._latlng.lat;
//                })

                if(this.$refs.table&&this.$refs.table.retFields){
                    this.$refs.table.retFields();
                }
                this.dialog = true;
            },
            onGetPos(position){
                this.map.spin(true);
                plus.geolocation.getCurrentPosition((rep)=>{

                    let lat = rep.coords.latitude;
                    let lng = rep.coords.longitude;
                    if(this.layers.active != 'normal') {
                        var ll = coordtransform.gcj02towgs84(lng,lat);
                        lat = ll[1];
                        lng = ll[0];
                    }


                    this.posLayers.clearLayers();
                    let icon = new L.icon({iconUrl:'./static/images/pos.png',shadowUrl:null,iconSize:[32,32]})
                    let marker = this.posMarker = new L.marker([lat,lng],{icon:icon}).addTo(this.posLayers);
                    if(this.login.id) {
                        marker.bindTooltip('点击周边查询大坝',{permanent:true,direction:'top',interactive:true}).openTooltip();
                        marker.on('click', (e)=> {
//                            this.onAddDb(e);
                            this.around_form = {
                                ...{lat:e.latlng.lat,
                                    lng:e.latlng.lng}
                            };
                            this.around_dialog = true;
                        })
                    }

                   this.map.setView([lat,lng],16);


                    this.map.spin(false);
                },(e)=>{
                    this.map.spin(false);
                    alert('code:'+e.code +'; message:' + e.message);
                },{geocode:true,provider:'amap',timeout:6000})
            },
            onGetPolygon(area){
                this.form.area = area;
            },
            init(){
                getDbList().then(rep=>{
                    this.addList = JSON.parse(rep);
                })
            },
            onSearchAround(){
                this.$refs['around-form'].validate(valid => {
                    if(valid) {
                        this.aroundSearch = true;
                        let list = [];
                        let marker = L.marker([this.around_form.lat,this.around_form.lng]).addTo(this.measureLayers);
//                        marker.bindTooltip('中心点',{permanent:true,direction:'top'});

                        let circle = L.circle([this.around_form.lat,this.around_form.lng], {radius: this.around_form.distance*1000,fillOpacity:.1,dashArray:[5,5]},).addTo(this.measureLayers);

                        let bounds = circle.getBounds();

                        let lat2 = (bounds._northEast.lat - bounds._southWest.lat)/2 + bounds._southWest.lat;
                        let lng2 = bounds._northEast.lng;

                        let line = L.polyline([[this.around_form.lat,this.around_form.lng],[lat2,lng2]]).addTo(this.measureLayers);
                        L.marker.measurement(line.getCenter(),this.around_form.distance +'公里').addTo(this.measureLayers)

                        this.dam.list.forEach(marker => {
                            let lat = marker.latitude,
                                lng = marker.longitude;
                            if(lat&&lng) {
                                let distance = this.map.distance([this.around_form.lat,this.around_form.lng],[parseFloat(lat),parseFloat(lng)])
                                if(distance/1000 < this.around_form.distance) {
                                    marker.distance = (distance/1000).toFixed(2);
                                    list.push(marker);
                                }
                            }
                        })
                        list = list.sort((a,b)=>a.distance-b.distance)
                        this.rightSpan.list = list;
                        this.dam.source = list;
                        this.dam.list = list;
                        this.rightSpan.name = '周边查询结果';
                        this.container.right = true;
                        this.around_dialog = false;

                        this.$nextTick(()=>this.map.fitBounds(this.markerLayers.getBounds()));
                    }
                })
            },
            onAreaChange(v) {
                this.showArea = v;
                if(v){
                    this.areaLayers.addTo(this.map);
                }else{
                    this.map.removeLayer(this.areaLayers);
                }
            },
            onCurrentChange(p) {
                this.currentPage = p;
            },
            onRegionCheck(checked, type) {
                this.regionLayers.clearLayers();
                this.regionCheck = true;
                this.showArea = false;
                this.map.spin(true);
                this.map.removeLayer(this.areaLayers);
                setTimeout(()=>{
                    this.riverRegionLayers.clearLayers();

                    if(this.wmsLayer) {
                        this.map.removeLayer(this.wmsLayer)
                        this.wmsLayer = null
                    }

                    if(checked.length>0) {

                        let filters = checked.map(c=>{
                            return 'RegionID=' + c.properties.id
                        })

                        let layers = checked.map(c=>{
                            return 'nyc:dam_river'
                        })
                        this.wmsLayer = L.tileLayer.wms(`http://223.93.186.208:8006/geoserver/nyc/wms?CQL_FILTER=${filters.join(';')}&`, {
                            layers:layers.join(','),
                            crs:L.CRS.EPSG4326,
                            format:'image/png',
                            transparent:true
                        }).addTo(this.map);

                        this.wmsLayer.bringToFront();

                        this.riverRegionLayers.bringToBack();
                        checked.forEach(c=>{
                            this.riverRegionLayers.addData(c);
                        })
                        if(type !='all') {
                            this.map.fitBounds(this.riverRegionLayers.getBounds());
                        }
                        this.map.removeLayer(this.normal);
                        this.map.removeLayer(this.earth);
                        let markers = type=='all'?this.list:this.list.filter(l=>{
                            if(l.longitude&&l.latitude) {
                                let b = pip.pointInLayer([parseFloat(l.longitude),parseFloat(l.latitude)],this.riverRegionLayers);
                                return b.length>0
                            }else{
                                return false
                            }
                        });

                        this.dam.list = markers;
                        this.dam.source = markers;
                        this.layers.active = 'river';
                        this.legend = 'river';
                        this.renderMarkers(markers,'river');
                        this.rightSpan.list = markers;
                        setTimeout(()=> this.$nextTick(()=>this.map.fitBounds(this.riverRegionLayers.getBounds())),500)

                    }else{
                        this.renderMarkers([]);
                    }
                },100)
            },
            onCloseRiverRegion() {
                this.onCloseLeft();
                this.rightSpan.list = [];
                this.measureLayers.clearLayers();
                if(this.regionCheck) {
                    this.map.spin(true);
                    this.map.removeLayer(this.wmsLayer);
                    this.normal.addTo(this.map);
                    this.dam.list = this.list;
                    this.legend = 'normal';
                    this.riverRegionLayers.clearLayers();
                    this.renderMarkers(this.dam.list);
                    this.regionCheck =false;
                }

            },
            onEmergencyClick(type,data) {
                this.regionLayers.clearLayers();
                if(type == '地震') {
                    let circle = L.circle([data.lat,data.lng], {radius: Math.ceil(data.level)*10000}).addTo(this.regionLayers);
                    circle.bindTooltip(`${data.time}</br>${data.addr}</br>深度：${data.deep}；级别：${data.level}`,{permanent:true})
                    this.map.fitBounds(this.regionLayers.getBounds())
                }else {
                    let d = data[0];
                    this.typhoonLayers.clearLayers();
                    let area;
                    let polyline = L.polyline(d.points.map(p=>{
                        return [parseFloat(p.lat),parseFloat(p.lng)]
                    }),{weight:2}).addTo(this.typhoonLayers);
                    let list = [];

                    d.points.forEach(p=>{
                        let marker = new L.circleMarker([parseFloat(p.lat),parseFloat(p.lng)],{
                            radius:4,
                            fillColor:'yellow',
                            fillOpacity:.8,
                            weight:1,
                            color:'blue',
                            info:p
                        }).addTo(this.typhoonLayers);

                        marker.bindPopup(`<table>
                            <tr class='header'>
                                <td colspan='2'>${p.time}</td>
                            </tr>
                            <tr>
                                <td>当前位置</td>
                                <td>${p.lng}°/${p.lat}°</td>
                            </tr>
                             <tr>
                                <td>最大风速</td>
                                <td>${p.speed} 米/秒</td>
                            </tr>
                             <tr>
                                <td>风力</td>
                                <td>${p.power} 级</td>
                            </tr>
                             <tr>
                                <td>等级</td>
                                <td>${p.strong}</td>
                            </tr>
                             <tr>
                                <td>移动速度</td>
                                <td>${p.movespeed} 公里/小时</td>
                            </tr>
                             <tr>
                                <td>移动方向</td>
                                <td>${p.movedirection}</td>
                            </tr>
                             <tr>
                                <td>七级半径</td>
                                <td>${p.radius7} 公里</td>
                            </tr>
                             <tr>
                                <td>十级半径</td>
                                <td>${p.radius10} 公里</td>
                            </tr>
                         </table>`,{
                            className:'custom'
                        })

                        let dbs = this.list.filter(l=>{
                            if(l.latitude&&l.longitude) {
                                let distance = this.map.distance({lat:parseFloat(p.lat),lng:parseFloat(p.lng)},{lat:parseFloat(l.latitude),lng:parseFloat(l.longitude)})
                                return distance <= p.radius7 * 1000
                            }else{
                                return false;
                            }

                        });

                        dbs.forEach(d=>{
                            let r = list.find(item=>{
                                return item.dbid == d.dbid;
                            });
                            if(!r) {
                                list.push(d);
                            }

                        });

                        /* marker.on('click',(m)=>{
                           if(area) {
                               this.typhoonLayers.removeLayer(area);
                               area = null;
                           }
                           area = new L.circle(m.target._latlng,{
                               radius:m.target.options.info.radius7 * 1000
                           });
                           area.addTo(this.typhoonLayers);

                           let dbs = this.list.filter(l=>{
                               if(l.latitude&&l.longitude) {
                               let distance = this.map.distance(m.target._latlng,{lat:parseFloat(l.latitude),lng:parseFloat(l.longitude)})
                               return distance <= m.target.options.info.radius7 * 1000
                               }else{
                                   return false;
                               }

                           })

                           if(dbs.length>0) {
                               this.rightSpan.list = dbs;
                               this.rightSpan.name = '台风影响大坝';
                               this.container.right = true;
                           }

                        })*/
                    });


                    let forecast = d.points[d.points.length - 1]['forecast'];
                    if(forecast.length>0){
                        let colors = ['#ff0000','#FF00FF','#2BBE00','#fe9104','#fff'];

                        forecast.forEach((f,index)=>{
                            let line = new L.polyline(f.forecastpoints.map(p=>{
                                return [parseFloat(p.lat),parseFloat(p.lng)]
                            }),{
                                weight:1,
                                dashArray:'5,5',
                                color:colors[index]
                            }).addTo(this.typhoonLayers);

                            f.forecastpoints.forEach(p=>{
                                let marker = new L.circleMarker([parseFloat(p.lat),parseFloat(p.lng)],{
                                    radius:4,
                                    fillColor:'#50beff',
                                    fillOpacity:.8,
                                    weight:1,
                                    color:'blue',
                                    info:p
                                }).addTo(this.typhoonLayers);

                                marker.bindPopup(`<table>
                            <tr class='header'>
                                <td colspan='2'>${f.tm} ${p.time}</td>
                            </tr>
                            <tr>
                                <td>当前位置</td>
                                <td>${p.lng}°/${p.lat}°</td>
                            </tr>
                             <tr>
                                <td>最大风速</td>
                                <td>${p.speed} 米/秒</td>
                            </tr>
                             <tr>
                                <td>风力</td>
                                <td>${p.power} 级</td>
                            </tr>
                             <tr>
                                <td>等级</td>
                                <td>${p.strong}</td>
                            </tr>
                         </table>`,{
                                    className:'custom'
                                })

                                let dbs = this.list.filter(l=>{
                                    if(l.latitude&&l.longitude) {
                                        let distance = this.map.distance({lat:parseFloat(p.lat),lng:parseFloat(p.lng)},{lat:parseFloat(l.latitude),lng:parseFloat(l.longitude)})
                                        return distance <= p.radius7 * 1000
                                    }else{
                                        return false;
                                    }

                                });

                                dbs.forEach(d=>{
                                    let r = list.find(item=>{
                                        return item.dbid == d.dbid;
                                    });
                                    if(!r) {
                                        list.push(d);
                                    }

                                });

                                /* marker.on('click',(m)=>{
                                   if(area) {
                                       this.typhoonLayers.removeLayer(area);
                                       area = null;
                                   }
                                   area = new L.circle(m.target._latlng,{
                                       radius:m.target.options.info.radius7 * 1000
                                   });
                                   area.addTo(this.typhoonLayers);

                                   let dbs = this.list.filter(l=>{
                                       if(l.latitude&&l.longitude) {
                                       let distance = this.map.distance(m.target._latlng,{lat:parseFloat(l.latitude),lng:parseFloat(l.longitude)})
                                       return distance <= m.target.options.info.radius7 * 1000
                                       }else{
                                           return false;
                                       }

                                   })

                                   if(dbs.length>0) {
                                       this.rightSpan.list = dbs;
                                       this.rightSpan.name = '台风影响大坝';
                                       this.container.right = true;
                                   }

                                })*/
                            });

                        })


                    }


                    this.dam.source = list;
                    this.dam.list = list;
                    this.rightSpan.list = list;
                    this.rightSpan.name = '台风影响大坝';
                    this.container.right = true;

                    this.typhoonLayers.bringToBack();
                    this.map.fitBounds(this.typhoonLayers.getBounds());
                }



            },
            onSearchRainFall(data) {
                this.regionLayers.clearLayers();
                data.forEach(d=>{
                    if(this.mapType == undefined||this.mapType == 'normal' ){
                        d.area.forEach((a,index)=>{
                            d.area[index] = coordtransform.wgs84togcj02(...a.reverse()).reverse()
                        })
                    }
                    new L.polygon(d.area,{
                        fillColor:d.color,
                        weight:1,
                        fillOpacity:.3,
                        name:d.name,
                        latlngs:d.area,
                    }).addTo(this.regionLayers);
                })

                if(data.length>0){
                    this.map.fitBounds(this.regionLayers.getBounds())
                }
            },
            onThemeFilter(data) {
                //this.markerLayers.clearLayers();

            },
            onExport() {
                let data = this.rightSpan.list;
            }
        },
        watch:{
            container:{
                deep:true,
                handler(){
                    this.$nextTick(()=>this.map.invalidateSize());
                }
            },
            search(v){
                this.flyTo(v);
            },
            'rightSpan.list'(){
                this.currentPage = 1;
            },
            zoom(z){
                this.map.removeLayer(this.areaLayers);
                if(z >= 12 && this.showArea){
                    this.areaLayers.addTo(this.map);
                }
            },
            'login.id'(id){
                if(id){
                    this.map.contextmenu.insertItem({
                        text:'添加大坝',
                        callback:this.onAddDb
                    },0)
                    this.map.contextmenu.insertItem({
                        text:'大坝管理',
                        callback:()=>{
                            this.rightSpan.list = this.dam.list;
                            this.rightSpan.name = '大坝管理';
                            this.container.right = true;
                        }
                    },2)
                    this.map.contextmenu.insertItem('-',3);

                    this.markerLayers.eachLayer(marker=>{
                        marker.options.contextmenuItems =  [{
                            text: '编辑大坝',
                            index: 0,
                            callback:this.onEditDb
                        }, {
                            text: '删除大坝',
                            index: 1,
                            callback:this.onDelDb
                        }]
                    })

                }
            },
            "dam.source"(data){
                if(data.length>0) {
                    this.filterDam();
                    this.renderMarkers(data);
                    let len = this.markerLayers.getLayers().length;
                    this.count = this.count < len?len:this.count;

                }
            },
            dialog(v){
                if(!v) {
                    this.tempMarkerLayers.clearLayers();
                    if(this.relatedTarget) {
                        this.relatedTarget.disableEdit();
                    }
                }
            },
            "container.left"(v){
                if(!v) {
                    if(this.riverRegionLayers.getLayers().length>0) {
                        this.$nextTick(()=>this.map.fitBounds(this.riverRegionLayers.getBounds()))
                    }else{
                        this.$nextTick(()=>this.map.fitBounds(this.markerLayers.getBounds()))
                    }

                }
            }
        },
        components:{
            toolbar,
            clegend,
            layers,
            searchForm,
            searchCompany,
            searchRegion,
            searchRiver,
            search,
            cheader,
            itree,
            riverRegion,
            emergency,
            rain,
            theme,
            control,
            pos:position,
            xSection:section
        },
        mounted() {
            this.$nextTick(()=>{
                this.$nextTick(()=>{
                    this.renderMap();
                    $('.leaflet-touch').removeClass('leaflet-touch');
                })
            })

            $(window).resize(()=>{
                this.height = document.documentElement.clientHeight - 88;
            });

            this.init();
        }
    }
</script>

<template>
    <el-dialog top="5%" title='绘制等值面' v-model='visible' :before-close='onClose' size='large'>
        <div id='drawmap' style="height:400px;"></div>
        <div slot="footer" class="dialog-footer">
            <el-button @click='onClose'>取 消</el-button>
            <el-button type="primary" @click='onClick' >确 定</el-button>
        </div>
    </el-dialog>
</template>
<style>

</style>
<script>
    import L from 'leaflet';
    import '../components/leaflet.chinese';
    import 'leaflet-editable';

    export default{
        props:['visible','area'],
        data(){
            return{
                polygon:null
            }
        },
        methods:{
            render() {
                 this.map = new L.map('drawmap',{
                    zoom:4,
                    center:[38,115],
                    minZoom:2,
                    editable:true
                });
                this.normal = L.tileLayer.chinaProvider('Google.Normal.Map',{maxZoom:18,minZoom:2}).addTo(this.map);
                if(this.area) {
                    let latlngs = this.getArea(this.area);
                    if(latlngs&&latlngs.length>0) {
                         this.polygon = new L.polygon(latlngs,{}).addTo(this.map);
                         this.map.fitBounds(this.polygon.getBounds());
                         this.polygon.enableEdit();
                    }
                }else{
                   this.polygon = this.map.editTools.startPolygon()
                }
            },
            onClose() {
                this.$emit('close');
            },
            getArea(str) {
                str = str.replace('MULTIPOLYGON(((','').replace(')))','');
                let ll = str.split(',');
                return ll.map(l=>{
                    let latlng = l.split(' ');
                    return [parseFloat(latlng[1]),parseFloat(latlng[0])]
                })
            },
            onClick() {
                if(this.polygon) {
                    let latlngs = this.polygon.toGeoJSON()['geometry']['coordinates'][0];
                    let str = latlngs.map(ll=>{
                        return `${ll[0]} ${ll[1]}`
                    }).join(',');
                    this.$emit('select',`MULTIPOLYGON(((${str})))`);
                }
                this.onClose();
            }
        },
        mounted() {
            this.$nextTick(()=>{
                this.render();
            })
        }
    }
</script>

<template>
    <div class="map-layer" >

        <span class="legend-button" @click="sheetVisible = true">
            12
        </span>
        <!--<div class="map-layer-card river" v-show='layers.active=="river"||expand' @click='change("river")' :class="{active:layers.active=='river'}">-->
            <!--<span>流域图</span>-->
        <!--</div>-->
        <!--<div class="map-layer-card normal" v-show='layers.active=="normal"||expand' @click='change("normal")' :class="{active:layers.active=='normal'}">-->
            <!--<span>交通图</span>-->
        <!--</div>-->
        <!--<div class="map-layer-card" v-show='layers.active=="earth"||expand' @click='change("earth")' :class="[{active:layers.active=='earth'},getClass]">-->
            <!--<span>{{getText}}</span>-->
        <!--</div>-->
        <mt-actionsheet
                :actions="actions"
                v-model="sheetVisible">
        </mt-actionsheet>
    </div>
</template>
<style lang='less'>
    .map-layer{
        position: absolute;
        z-index: 1000;
        right: 10px;
        top: 80px;

    }

</style>
<script>

    export default{
        store:['layers'],
        data(){
            return {
                expand:false,
                actions:[
                    {name:'卫星图'},{name:'交通图',name:'流域图'}
                ],
                sheetVisible:false
            }
        },
        computed:{
            getClass(){
                return this.expand?'earth':this.layers.active;
            },
            getText() {
                return !this.expand?{'earth':'卫星图','normal':'交通图','river':'流域图'}[this.layers.active]:'卫星图';
            }
        },
        methods:{
            change(active) {
                this.layers.active = active;
                this.$emit('change',active);
            }
        }
    }
</script>

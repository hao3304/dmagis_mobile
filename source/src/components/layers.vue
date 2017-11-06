<template>
    <div class="map-layer"  @mouseover="expand=true" @mouseout="expand=false" >
        <div class="map-layer-card river" v-show='layers.active=="river"||expand' @click='change("river")' :class="{active:layers.active=='river'}">
            <span>流域图</span>
        </div>
        <div class="map-layer-card normal" v-show='layers.active=="normal"||expand' @click='change("normal")' :class="{active:layers.active=='normal'}">
            <span>交通图</span>
        </div>
        <div class="map-layer-card" v-show='layers.active=="earth"||expand' @click='change("earth")' :class="[{active:layers.active=='earth'},getClass]">
            <span>{{getText}}</span>
        </div>
    </div>
</template>
<style lang='less'>
    .map-layer{
        position: absolute;
        z-index: 999;
        background-color: rgba(255,255,255,.2);
        border-radius: 4px;
        padding: 4px;
        width:86px;
        height:60px;
        transition: all .4s;
        -moz-transition: all .4s;
        -webkit-transition: all .4s;
        -o-transition: all .4s;
        box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.12), 0px 0px 6px 0px rgba(0,0,0,0.04);

        .map-layer-card{
            width: 86px;
            height: 60px;
            cursor: pointer;
            position: relative;
            box-sizing: border-box;
            border-radius: 2px;
            span{
                position: absolute;
                bottom: 0;
                right: 0;
                color: #fff;
                font-size: 12px;
                border-radius: 2px;
                padding: 2px;
            }
        }
        .normal{
            background-image: url("/static/images/maptype.png");
            background-position: 0 0;
            position: absolute;
            right:4px;
            top:4px;
        }

        .earth{
            background-image: url("/static/images/maptype.png");
            background-position: 0 -180px;
            position: absolute;
            right: 4px;
            top:4px;
        }
        .river{
            background-image: url("/static/images/maptype.png");
            background-position: 0 -240px;

        }

        &:hover{
            width: 270px;
            background-color: #fff;
            padding: 4px;
            .normal {
                right:96px;
            }
            .map-layer-card{
                &.active{
                    border:1px solid #3385ff;
                }
                span{
                    background-color: #3385ff;
                }
            }
        }
    }

</style>
<script>

    export default{
        store:['layers'],
        data(){
            return {
                expand:false
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

<template>
    <div >

        <span class="legend-button layer-button" @click="sheetVisible = true">
            <img src="./static/images/mapSwitch.png" alt="">
        </span>
        <mt-actionsheet
                :actions="actions"
                v-model="sheetVisible">
        </mt-actionsheet>
    </div>
</template>
<style lang='less'>
    .legend-button.layer-button{
        position: absolute;
        z-index: 999;
        right: 10px;
        top: 100px;
        img{
            width: 25px;
            margin-top: 4px;
        }

    }

</style>
<script>

    export default{
        store:['layers'],
        data(){
            let self = this;
            return {
                expand:false,
                actions:[
                    {name:'卫星图',method:()=>self.change('earth')},{name:'交通图',method:()=>self.change('normal')},{name:'流域图',method:()=>self.change('river')}
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
                if(this.layers.active != active) {
                    this.layers.active = active;
                    this.$emit('change',active);
                }
            }
        }
    }
</script>

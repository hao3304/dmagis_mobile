<template>
    <div class="control" style="background-color:#fff;border:1px solid #ddd; padding: 3px 4px;border-radius: 4px;">
        <el-checkbox v-model="control">显示标签</el-checkbox>
    </div>
</template>
<style lang='less' scoped >
    .control{
        position: absolute;
        top:9px;
        left:305px;
        z-index: 1000;
    }
</style>
<script>
    import {getLegend} from '../modules/service';

    export default{
        data(){
            return {
                control:false
            }
        },
        watch:{
            control(t){
                this.$emit('tooltip-change',t);
            }
        }
    }
</script>

<template>
 <div class="wrap">
  <slider   @change="onRoute" ></slider>
  <section>
   <div class="main">
    <mt-header class="x-header" title="大坝信息系统" style="height: 46px;">
     <mt-button slot="right" @click="onClick">
      <img src="/static/images/integratedQuery.png" alt="" style="height: 25px;margin-top: 4px;">
     </mt-button>
    </mt-header>
    <div style="position:absolute;top:46px;bottom: 0;width: 100%;">
     <router-view style="position:absolute;width:100%" ></router-view>
    </div>
   </div>
  </section>
 </div>
</template>
<style lang="less">
 .x-header .mint-header-title{
  font-size: 18px;
 }
</style>
<script>

    import slider from '/src/components/slider.vue';

    export default{
        data(){
            return{

            }
        },
        methods:{
            onRoute: function (v) {
                this.$router.push(v);
            },
            onClick() {
                $('.sidebar-collapse').removeClass('sidebar-collapse')
            }
        },
        components:{
            slider
        }
    }

</script>
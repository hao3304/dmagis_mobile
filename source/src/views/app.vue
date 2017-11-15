<template>
 <div class="wrap">
  <slider   @change="onRoute" ></slider>
  <section>
   <div class="main">
    <mt-header  class="x-header" title="全国大坝信息系统" style="height: 46px;">
     <mt-button slot="right" v-show="login.show" @click="onClick">
      <img src="./static/images/integratedQuery.png"  style="height: 25px;margin-top: 4px;" />
     </mt-button>
    </mt-header>
    <div style="position:absolute;top:46px;bottom: 0;width: 100%;">
     <router-view style="position:absolute;width:100%" ></router-view>
    </div>
   </div>
   <div class="x-modal" @click="onHideModal"></div>
  </section>
 </div>
</template>
<style lang="less">
 .x-header .mint-header-title{
  font-size: 18px;
 }

 .x-modal{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 2000;
  background-color: rgba(0,0,0,.3);
 }
</style>
<script>

    import slider from '/src/components/slider.vue';

    export default{
        store:['login'],
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
            },
            onHideModal() {
                $('.sidebar-mini').addClass('sidebar-collapse')
            }
        },
        components:{
            slider
        }
    }

</script>
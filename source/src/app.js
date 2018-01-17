/**
 * Created by jack on 16/11/14.
 */

const Vue = require('vue');
const UI = require('element-ui');
const Router = require('vue-router');
require('es6-promise').polyfill();

import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';

Vue.use(Mint);

require('./modules/datefomat');
require('/static/js/layer/skin/default/layer.css');
require('leaflet/dist/leaflet.css');
import "element-ui/lib/theme-default/index.css";

import VueStash from 'vue-stash';
import VueLocalStorage from 'vue-ls';
Vue.use(VueLocalStorage);
Vue.use(VueStash);
Vue.use(UI);
Vue.use(Router);


import map from './views/map.vue';
import login from './views/login.vue';
import {store} from './store';
import app from './views/app.vue';
import test from './views/test.vue';
const routes = [
    { path: '/map', component: map },
    { path: '/', component: login },
    { path: '/test', component: test },
];

const router = new Router({
    routes
});

import { Gender, Status } from './modules/filters';
Vue.filter('Gender', Gender);
Vue.filter('Status', Status);

import { getVersion } from './modules/service';

new Vue({
    router: router,
    data: {
        store
    },
    render:h=>h(app),
    methods:{
        checkVersion(version){
            var self = this;
            getVersion().then(rep=>{
                console.log("检测版本："+rep.versionName);
                if(rep.versionName!=version) {
                    plus.nativeUI.confirm("检查到当前版本有最新更新，下载升级？",
                        function(event){
                            if(event.index ==0){
                                console.log('下载地址：'+rep.fileAddress)
                                self.downWgt(rep.fileAddress); //下载更新版的地址
                            }
                        } ,'系统消息',['马上升级','下次再说']);
                }
            })
        },
        downWgt(wgtUrl) {
            var self = this;
            plus.nativeUI.showWaiting("下载更新文件...");
            plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
                if ( status == 200 ) {
                    //console.log("下载wgt成功："+d.filename);
                    self.installWgt(d.filename); // 安装wgt包
                } else {
                    //console.log("下载wgt失败！");
                    plus.nativeUI.alert("下载更新失败！");
                }
                plus.nativeUI.closeWaiting();
            }).start();
        },
        installWgt(path) {
            plus.nativeUI.showWaiting("安装更新文件...");
            plus.runtime.install(path,{},function(){
                plus.nativeUI.closeWaiting();
                plus.nativeUI.alert("应用资源更新完成！",function(){
                    plus.runtime.restart();
                });
            },function(e){
                plus.nativeUI.closeWaiting();
                plus.nativeUI.alert("安装更新文件失败["+e.code+"]："+e.message);
            });
        }
    },

    mounted: function () {
        this.$nextTick(function () {
            $('.main').slimScroll({ height: document.documentElement.clientHeight });
        });

        $(window).resize(function(){
            $('.main').slimScroll({ height: document.documentElement.clientHeight });
        });

        $('.loading').hide();

        mui.back = function() {
            //首次按键，提示‘再按一次退出应用’
            if (!first) {
                first = new Date().getTime();
                mui.toast('再按一次退出应用');
                setTimeout(function() {
                    first = null;
                }, 1000);
                return;
            } else {
                if (new Date().getTime() - first < 1000) {
                    plus.runtime.quit();
                }
            }
        }

        setTimeout( () =>{
            if(!mui.os.ios) {
                plus.runtime.getProperty(plus.runtime.appid,(inf)=>{
                    this.checkVersion(inf.version);
                });
            }

        },20000)

        // this.checkVersion(1);
    }
}).$mount('#app')



<template>
    <div class="page-login">

        <div class="logo">
            <img src="./static/images/logo.png">
            <p>DamGIS</p>
        </div>

        <!--<group title="" label-width="4em" >-->
        <!--<x-input v-model='username' required title="用户名" placeholder="请输入用户名" novalidate  placeholder-align="right"></x-input>-->
        <!--<x-input v-model='password' type='password' required title="密&nbsp;&nbsp;&nbsp;&nbsp;码" placeholder="请输入密码" novalidate placeholder-align="right"></x-input>-->
        <!--</group>-->

        <!--<mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>-->
        <!--<mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>-->

        <div style="padding:20px 10px;text-align: center">
            <mt-button size="large" @click='onLogin' type="primary">IMEI登录</mt-button>
            <!--<mt-button style="margin-top: 20px;" size="large" @click='onView' >游客</mt-button>-->
        </div>
    </div>
</template>
<style lang='less'>
    .page-login{
        height: 100%;
        position: absolute;
        width: 100%;
        top:0;
        left: 0;
        background-color: #ecedf1;

        .logo{
            margin-top:10%;
            text-align: center;
            img{
                width: 30%;
            }
            p{
                font-size: 1.8rem;
                color: #3e89f5;
                font-weight: 200;
            }
        }


    }
</style>
<script>
    import {doLogin,getLoginInfo,loginWithIMEI} from '../modules/service';
    export default{
        store:['login'],
        data(){
            return{
                username:'',
                password:'',
                loading:false,
                loading2:false
            }
        },

        methods:{
            onLogin(){
                plus.nativeUI.showWaiting("登录中...");
                loginWithIMEI(plus.device.imei).then(([rep])=>{
                    plus.nativeUI.closeWaiting();
                    if(rep.result == 'false') {
                        mui.alert(rep.hint);
                    }else{
                        this.login = $.extend(this.login,{name:rep.realname,id:rep.userid,show:true});
                        this.$router.push('/map');
                        this.$ls.set('username',rep.realname);
                    }
                })
//                plus.screen.lockOrientation("landscape-primary");
//                this.$router.push('/map');
//                this.$ls.set('username',"jack");

            },
            onView(){
                this.login.show = true;
                this.$router.push('/map');
            }
        },
        components:{

        },
        mounted(){
            this.username = this.$ls.get('username','');
            this.password = this.$ls.get('password','');
        }
    }
</script>

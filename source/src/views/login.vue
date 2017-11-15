<template>
    <div class="page-login">

        <div class="logo">
            <img src="./static/images/logo.png">
            <p>全国大坝信息系统</p>
        </div>

        <!--<group title="" label-width="4em" >-->
            <!--<x-input v-model='username' required title="用户名" placeholder="请输入用户名" novalidate  placeholder-align="right"></x-input>-->
            <!--<x-input v-model='password' type='password' required title="密&nbsp;&nbsp;&nbsp;&nbsp;码" placeholder="请输入密码" novalidate placeholder-align="right"></x-input>-->
        <!--</group>-->

        <mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
        <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>

        <div style="padding:20px 10px;text-align: center">
            <mt-button size="large" @click='onLogin' type="primary">登录</mt-button>
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
    import {doLogin,getLoginInfo} from '../modules/service';
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
                if(this.username && this.password){

                    doLogin({username:this.username,password:this.password}).then((rep)=>{
                        if(rep.length>0&&rep[0].realname){
                            this.login.name = rep[0].realname;
                            this.login.id = rep[0].userid;
                            this.$ls.set('username',this.username);

                            this.$ls.set('password',this.password);
                            this.$router.push('/map');
                        }else{
                            let hint = rep[0].hint;
                            alert(hint);
                        }
                    })
                }
            }
        },
        components:{

        },
        mounted(){
            this.username = this.$ls.get('username','');
            this.password = this.$ls.get('password','');
            getLoginInfo().then((rep)=>{
                this.loading2 = false;
                let result = JSON.parse(rep);
                if(result&&result.realname){
                    this.login = $.extend(this.login,{name:result.realname,id:result.userid,show:true});
                    this.$router.push('/map');
                }
            });


        }
    }
</script>

<template>
    <div class="page-login">
        <el-checkbox-group
                v-model="checkedCities1"
             >
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>

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
        data() {
            return {
                checkedCities1: ['上海', '北京'],
                cities: ['上海', '北京', '广州', '深圳']
            };
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

        }
    }
</script>

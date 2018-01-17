<template>
        <div class="search-block">
                <div class="input-block" @click="onShow">
                        请输入查询内容
                </div>

        </div>
</template>
<style lang='less'>
        .search-block{
                position: absolute;
                top: -40px;
                right: 50px;
                left: 10px;
                line-height: initial;
                z-index: 900;
                .input-block{
                        background-color: #fff;
                        border: 1px solid #ccc;
                        height: 32px;
                        line-height: 32px;
                        color: #888;
                        padding: 0 10px;
                        border-radius: 4px;
                        margin: 0 10px;
                }
        }
</style>
<script>


    export default{
        store:['dam','search'],
        data(){
            return{
                query:''
            }
        },
        computed:{
            icons(){
                return this.query?'close':'search';
            }
        },
        methods:{
            querySearch(queryString,cb){
                let list = this.dam.list;
                let result = queryString?list.filter((l)=>l.dbmc.indexOf(queryString.toLowerCase())>-1):list;
                cb(result.map((r)=>{return {value:r.dbmc,...r}}));
            },
            handleSelect(v){
                this.search = {...v};
            },
            handleIconClick(){
                this.query = '';
            },
            onShow() {

                this.$emit("show");
            }
        }
    }
</script>

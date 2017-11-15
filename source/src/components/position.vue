<template>
	<div  class='page-position' :style="translate">
		<a href='javascript:;' @tap='onTap'>
			<img src="./static/images/location.png">
		</a>
	</div>

</template>
<style lang='less'>
        div.page-position{
			position:absolute;
			z-index:996;
			bottom:10px;
			left:10px;
			height:2.2rem;
			width:2.2rem;
			background-color:rgba(255,255,255,.8);
   			border-radius: 3px;
			text-align:center;
			box-shadow:1px 1px 2px rgba(0,0,0,.4);

			transition: all .4s;

   			 a{
				font-size:1.4rem;
				color:#3d89f4;
				 line-height:2.2rem;
				 img{
					 width: 1.8rem;
					 margin-top: 3px;
				 }

			 }
			&:active{
				background-color:#ddd;
			}
        }
</style>
<script>
    export default{
    	props:['transform'],
    	computed:{
    		translate(){
    			return this.transform?'transform:translateY(-67px);':'transform:translateY(0);';
    		}
    	},
        data(){
            return{
            }
        },
        methods:{
        	onTap(){
        		this.$emit('get-position');
        	}
        }
    }
</script>

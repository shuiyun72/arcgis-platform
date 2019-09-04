<template>
	<div class="statistics_card">
	  <div class="header">
	       <span class="iconfont icon-xiaoshoutongji"></span>{{easyCardData.title}}
	  </div>
	  <div class="content clearfix">
	    <div class="left"><span class="iconfont" :class="easyCardData.icon"></span></div>
	    <div class="right">
	    	<p>{{easyCardData.num}}</p>
	    	<p>{{easyCardData.unit}}</p>
	    </div>
	  </div>
	</div>
</template>

<script>

export default({
	name:"EasyCard",
	props:["easyCardData"],
	data () {
		return {
			
		}
	}
})
</script>

<style lang="stylus">
.statistics_card
	border-radius:4px
	background-color: #44B6AE
	overflow:hidden
	.header
		text-align:left
		padding: 0px 10px
		color: #fff
		font-size: 15px
		background-color:rgba(0,0,0,.2)
		.iconfont
			font-size: 15px
			margin-right: 4px
	.content
		height: 76px
		border-bottom: 6px solid #36928B
		padding-top: 4px
		.left
			float: left
			padding: 10px 0 6px 8px
			.iconfont
				font-size: 70px	
				display: block
				color: rgba(255,255,255,.3)
		.right
			float: right
			padding-top: 6px
			p:nth-child(1)
				font-size: 28px
				padding: 4px 10px 2px 0;
				margin: 0
				line-height: 24px;
				text-align: right;
				color: #333
			p:nth-child(2)
				margin: 0
				color: #fff
				text-align: right
				padding-right: 10px
</style>
<template>
	<div class="inspection-card">
	  <div class="header clearfix" :style="{background:roundnessCardData.titleColor}">
	  	<div class="left">
	  		<i class="iconfont " :class="roundnessCardData.titleIcon"></i><span>{{roundnessCardData.title}}</span>
	  	</div>
	  </div>
	  <div class="content" :style="{background:roundnessCardData.contentColor}">
	    	<slot></slot>
	  </div>
	</div>
</template>

<script>
export default({
	name:"StatisticsCard",
	props:["roundnessCardData"],
	data () {
		return {
			
		}
	}
})
</script>

<style lang="stylus">

.clearfix:after
	content:""
	display: block
	clear:both	
.inspection-card
	background-color: #C2C2C2;
	border-radius:4px
	overflow:hidden;
	.header
		text-align: left
		padding: 3px 10px
		color: #fff
		font-size: 18px
		background: #273335
		.left
			float: left
			.iconfont
				margin-right: 4px
				color: rgba(255,255,255,.6)
				position:relative
				top: 2px
			span
				font-size: 14px
		.right
			float: right
			padding-top: 6px
			em
				width: 24px
				height: 14px
				background-color: #0086B6
				display: inline-block
				margin-right: 4px
				position:relative
				top: 2px
				border-radius:4px
			span
				color: #eee
				font-size: 14px
	.content
		padding: 0px 0 6px
		min-height: 120px
		.charWraper
			padding-top: 0;
		.gauge1,.gauge2
			position:relative
			top:6px
</style>
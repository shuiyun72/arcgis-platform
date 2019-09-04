<template>		
	<el-row>
		<el-col :span="9">
			<div class="header_title">
				<em></em>
				<span>{{titleName}}</span>	
			</div> 
		</el-col>
	</el-row>
</template>
<script>
export default({
	name:"HeaderTitle",
	props:["titleName"]
})
</script>

<style lang="stylus">
@import '~@common/styles/common/variables.styl'
.MaintainGIS
	.header_title
		color: $orangeColor
		font-size: 14px
		line-height: 30px
		text-align: left
		em
			display: inline-block
			background: $orangeColor
			width: 10px
			height: 10px
			margin-right: 4px
</style>
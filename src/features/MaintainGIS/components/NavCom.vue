<template>
	<ul class="nav_ul">
      	<li class="active">全部</li>
      	<li>全部</li>
      	<li>本日</li>
      	<li>本周</li>
      	<li>本月</li>
      	<li>自定义</li>
    </ul>
</template>
<script>
export default({
	name:"NavCom"
})
</script>

<style lang="stylus">
@import '~@common/styles/common/variables.styl'
.nav_ul
	margin: 0
	padding: 0
	list-style: none
	height: 34px
	line-height: 34px
	position:relative
	top: -5px
	left: -2px
	text-align: left
	li
		margin: 0
		padding: 0
		display: inline-block
		color: #eee
		font-size: 13px
		padding: 0 12px
	li.active
		background: $greenColor
		color: #333
</style>
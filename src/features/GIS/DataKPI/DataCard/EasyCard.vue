<template>
	<div class="easy-card bgOne" :class="easyCardData.class" >
	  <div class="content">
		  	<p> {{easyCardData.title}}</p>
	    	<p>{{easyCardData.num}}</p>
	    	<p>{{easyCardData.unit}}</p>
	  </div>
	  <span class="bg-icon" :style="{color:easyCardData.iconColor}"><i class="iconfont" :class="easyCardData.icon"></i></span>
	  <div class="line-border">
		  <span class="one-1" :style="{ 'border-color':easyCardData.leftColor}"></span>
		  <span class="one-2" :style="{ 'border-color':easyCardData.rightColor}"></span>
		  <span class="two-1" :style="{ 'border-color':easyCardData.rightColor}"></span>
		  <span class="two-2" :style="{ 'border-color':easyCardData.leftColor}"></span>
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
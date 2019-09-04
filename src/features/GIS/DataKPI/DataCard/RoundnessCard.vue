<template>
	<div class="roundness-card">
	  <div class="header">
	  	<i class="title-left"></i><span>{{roundnessCardData.title}}</span>
	  </div>
	  <div class="content">
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
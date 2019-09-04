<template>
	<div class="statistics-card">
	  <el-row class="header">
	  	<span>{{statisticsCardData.title}}</span>
	  </el-row>
	  <div class="content" >
	    	<slot></slot>
	  </div>
	</div>
</template>

<script>
export default({
	name:"StatisticsCard",
	props:["statisticsCardData"],
	mounted (){	
	},
	data () {
		return {
			
		}
	}
})
</script>
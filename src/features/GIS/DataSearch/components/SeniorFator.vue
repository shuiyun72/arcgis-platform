<template>
  <div class="fatorClass">
    <el-col :span="9" class="table-left" :xs="12" :sm="12" :lg="9">
      <el-row>
        <el-form-item label="属性：">
          <el-select
            v-model="fatorObj.attRListValue"
            placeholder="编号"
            @change="onAttRChange(fatorObj.attRListValue)"
            size="mini"
          >
            <el-option
              v-for="item in attRList"
              :key="item.field"
              :label="item.text"
              :value="item.field"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="关系：">
          <el-select v-model="fatorObj.mathDataValue" size="mini">
            <el-option
              v-for="item in mathData"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="值：">
          <el-select
            v-if="fatorObj.dom === 'Select'"
            v-model="fatorObj.detailDataValue"
            placeholder
            size="mini"
          >
            <el-option v-for="item in attrValueList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-date-picker
            style="width:95%;"
            v-else-if="fatorObj.dom === 'Date'"
            v-model="fatorObj.detailDataValue"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
          ></el-date-picker>
          <el-input v-else v-model="fatorObj.detailDataValue" style="width:95%;"></el-input>
        </el-form-item>
      </el-row>
    </el-col>
    <el-col :span="4" class="flexCol">
      <div class="sql-btn-warpper">
        <el-button class="my-SeniorSearch" @click="addOrSql('and')">与条件</el-button>
        <el-button class="my-SeniorSearch" @click="addOrSql('or')">或条件</el-button>
        <el-button class="my-SeniorSearch" @click="clearSql">清空</el-button>
      </div>
    </el-col>
    <el-col :span="10" :xs="6" :sm="6" :lg="10">
      <el-form-item label-width="0px">
        <el-input type="textarea" v-model="sqlCValue" disabled></el-input>
      </el-form-item>
    </el-col>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
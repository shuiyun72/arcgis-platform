<template>
  <div class="initiate_table">
    <div class="header_title_">事件基本信息</div>
    <el-form label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="事件来源：">
            <el-select v-model="EventSourceDataSelect" @change="onAttRChange" size="mini">
              <el-option
                v-for="(item,index) in EventSourceData"
                :label="item"
                :value="item"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="紧急程度：">
            <el-select v-model="UrgencyDataSelect" @change="onAttRChange" size="mini">
              <el-option
                v-for="(item,index) in UrgencyData"
                :label="item"
                :value="item"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="事件类型：">
            <el-select v-model="EvevtClassDataSelect" @change="onAttRChange" size="mini">
              <el-option
                v-for="(item,index) in EvevtClassData"
                :label="item"
                :value="item"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
        <el-col :span="8">
          <el-form-item label="事件内容：">
            <el-select v-model="EvevtContentDataSelect" @change="onAttRChange" size="mini">
              <el-option
                v-for="(item,index) in EvevtContentData"
                :label="item"
                :value="item"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>      
        <el-col :span="8">
          <el-form-item label="联系人：">
						<el-input v-model="Linkman" size="mini" placeholder="请输入联系人" class="width_bi80"></el-input>
					</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话：">
						 <el-input v-model="Phone" size="mini" placeholder="请输入联系电话"  class="width_bi80"></el-input>
					</el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="8">
          <el-form-item label="处理部门：">
						<el-select v-model="UnitDataSelect" @change="onAttRChange" size="mini">
              <el-option v-for="(item,index) in UnitData" :label="item" :value="item" :key="index"></el-option>
            </el-select>
					</el-form-item>
        </el-col>
				<el-col :span="8">
          <el-form-item label="紧急程度：">
						<el-select v-model="DisposeUserSelect" @change="onAttRChange" size="mini">
              <el-option
                v-for="(item,index) in DisposeUser"
                :label="item"
                :value="item"
                :key="index"
              ></el-option>
            </el-select>
					</el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="事件地址：">
						<el-input v-model="EventAddress" size="mini" placeholder="请输入事件地址"></el-input>
					</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="位置坐标：">
							 <el-col :span="7">
								 <el-input v-model="Coordinate.x" size="mini"></el-input>
							 </el-col>
							 <el-col :span="1">
								 <span>_</span>
							 </el-col>
							 <el-col :span="7">
								 <el-input v-model="Coordinate.y" size="mini"></el-input>
							 </el-col>
							 <el-col :span="4" :offset="1">
								 <el-button size="mini" class="my-setCoordinate">设定位置</el-button>
							 </el-col>
					</el-form-item>
        </el-col>
      </el-row>

			<el-row>
        <el-col :span="24" style="height: auto;">
          <el-form-item label="事件备注：">
						<el-input
              type="textarea"
              :autosize="{ minRows: 8, maxRows: 20}"
              placeholder="请输入内容"
              v-model="EventNote"
            ></el-input>
					</el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <el-row type="flex" justify="end">
      <el-button size="mini" class="my-evenReport">事件上报</el-button>
    </el-row>
  </div>
</template>

<script>
import * as disposeData from "../config.js";

export default {
  name: "Initiate",
  data() {
    return {
      EventSourceDataSelect: "",
      EventSourceData: [], //事件来源
      UrgencyDataSelect: "",
      UrgencyData: [], //进阶程度
      EvevtClassDataSelect: "",
      EvevtClassData: [], //事件类型
      EvevtContentDataSelect: "",
      EvevtContentData: [], //事件内容
      Linkman: "", //联系人
      Phone: "", //联系电话
      EventAddress: "",
      Coordinate: {
        x: "",
        y: ""
      },
      UnitDataSelect: "", //处理部门
      UnitData: [],
      DisposeUserSelect: "", //处理人
      DisposeUser: [],
      EventNote: ""
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      //初始化
      this.EventSourceData = ["接电上报", "部门上报", "未知"];
      this.UrgencyData = ["一般", "紧急", "非常紧急"];
    }
  }
};
</script>
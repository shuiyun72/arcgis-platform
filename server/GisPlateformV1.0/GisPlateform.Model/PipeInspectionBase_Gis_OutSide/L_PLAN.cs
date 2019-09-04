using GisPlateform.Model.AttributePack;
using System;
using System.Runtime.Serialization;

namespace GisPlateform.Model.PipeInspectionBase_Gis_OutSide
{
    //巡检计划表
    [Serializable]
    [DataContract]
    public class L_Plan
    {

        /// <summary>
        /// 计划编号
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsPrimaryKey, PrimaryKeyType = PrimaryKeyType.Identity)]
        public int PlanId
        {
            set; get;
        }
        /// <summary>
        /// 计划名称
        /// </summary>		
        [DataMember]
        public string PlanName
        {
            set; get;
        }
        /// <summary>
        /// 计划类型ID
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public int PlanTypeId
        {
            set; get;
        }
        /// <summary>
        /// 区域名称
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public int PlanAreaId
        {
            set; get;
        }
        /// <summary>
        /// 设备实体
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public string EquipmentList
        {
            set; get;
        }
        /// <summary>
        /// 路径
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public string PlanPath
        {
            set; get;
        }
        /// <summary>
        /// 是否需要反馈
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public int BoolFeedBack
        {
            set; get;
        }
        /// <summary>
        /// 是否常规计划
        /// </summary>		
        [DataMember]
        public int BoolNormalPlan
        {
            set; get;
        }
        /// <summary>
        /// 周期编号
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public int PlanCycleId
        {
            set; get;
        }
        /// <summary>
        /// 1  车巡   2  徒步
        /// </summary>		
        [DataMember]
        public int MoveType
        {
            set; get;
        }
        /// <summary>
        /// Operator
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public string Operator
        {
            set; get;
        }
        /// <summary>
        /// OperateDate
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public DateTime OperateDate
        {
            set; get;
        }
        /// <summary>
        /// EquipmentListName
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public string EquipmentListName
        {
            set; get;
        }
        /// <summary>
        /// 巡检计划失效时间
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public DateTime InvalidationDate
        {
            set; get;
        }
        /// <summary>
        /// 起止日期例:1|2
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public string StartStopInfo
        {
            set; get;
        }
        /// <summary>
        /// PlanLineId
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public int PlanLineId
        {
            set; get;
        }
        /// <summary>
        /// 计划类别
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public int PlanTypeLB
        {
            set; get;
        }
        /// <summary>
        /// xun
        /// </summary>		
        [DataMember]
        public string Remark
        {
            set; get;
        }
        /// <summary>
        /// 0:删除 1:正常
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public int PlanState
        {
            set; get;
        }

    }
}
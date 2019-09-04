using GisPlateform.Model.AttributePack;
using System;
using System.Runtime.Serialization;

namespace GisPlateform.Model.PipeInspectionBase_Gis_OutSide
{
    //PlanLineDetail
    [Serializable]
    [DataContract]
    public class PlanLineDetail
    {

        /// <summary>
        /// PlanLineDetaiId
        /// </summary>	
        [Column(FilterType = FilterType.IsPrimaryKey, PrimaryKeyType = PrimaryKeyType.Identity)]
        [DataMember]
        public int PlanLineDetaiId
        {
            set; get;
        }
        /// <summary>
        /// 巡检路线ID
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public int? PlanLineId
        {
            set; get;
        }
        /// <summary>
        /// X
        /// </summary>		
        [DataMember]
        public string X
        {
            set; get;
        }
        /// <summary>
        /// Y
        /// </summary>		
        [DataMember]
        public string Y
        {
            set; get;
        }
        /// <summary>
        /// 排序
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public int OrderNum
        {
            set; get;
        }
        /// <summary>
        /// 添加时间
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public DateTime AddTime
        {
            set; get;
        }
        /// <summary>
        /// 空为路线单位关键点1为手动添加关键点
        /// </summary>		
        [DataMember]
        
        public int? ImportPointType
        {
            set; get;
        }
        /// <summary>
        /// 手动添加的关键点名称
        /// </summary>		
        [DataMember]
        public string ImportPointName
        {
            set; get;
        }
        /// <summary>
        /// 0:无效 1:有效 空有效
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public int State
        {
            set; get;
        }
        /// <summary>
        /// LengthToFirsPointt
        /// </summary>		
        [DataMember]
        public decimal LengthToFirsPointt
        {
            set; get;
        }

    }
}
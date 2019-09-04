using GisPlateform.Model.AttributePack;
using System;
using System.Runtime.Serialization;

namespace GisPlateform.Model.PipeInspectionBase_Gis_OutSide
{
    //工作时段管理
    [Serializable]
    [DataContract]
    public class L_WorkTimeInterval
    {

        /// <summary>
        /// 工作时段编号
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsPrimaryKey, PrimaryKeyType = PrimaryKeyType.Identity)]
        public int IntervalId
        {
            set; get;
        }
        /// <summary>
        /// 开始时间
        /// </summary>		
        [DataMember]
        public string StartTime
        {
            set; get;
        }
        /// <summary>
        /// 结束时间
        /// </summary>		
        [DataMember]
        public string EndTime
        {
            set; get;
        }
        /// <summary>
        /// 备注
        /// </summary>		
        [DataMember]
        public string Remarks
        {
            set; get;
        }

    }
}
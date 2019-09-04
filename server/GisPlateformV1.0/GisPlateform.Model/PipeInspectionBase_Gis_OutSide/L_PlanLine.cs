using GisPlateform.Model.AttributePack;
using System;
using System.Runtime.Serialization;

namespace GisPlateform.Model.PipeInspectionBase_Gis_OutSide
{
    //L_PlanLine
    [Serializable]
    [DataContract]
    public class L_PlanLine
    {

        /// <summary>
        /// PlanLineId
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsPrimaryKey, PrimaryKeyType = PrimaryKeyType.Identity)]
        public int PlanLineId
        {
            set; get;
        }
        /// <summary>
        /// 巡检路线名称
        /// </summary>		
        [DataMember]
        public string PlanLineName
        {
            set; get;
        }
        /// <summary>
        /// 线路的geotext
        /// </summary>		
        [DataMember]
        public string GeoText
        {
            set; get;
        }
        /// <summary>
        /// 巡检路线状态0:作废状态1:启用状态
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public int PlanLintState
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
        /// 最后操作时间
        /// </summary>		
        [DataMember]
        public DateTime LastOperateTime
        {
            set; get;
        }
        /// <summary>
        /// PatroGeoText
        /// </summary>		
        [DataMember]
        public string PatroGeoText
        {
            set; get;
        }

    }
}
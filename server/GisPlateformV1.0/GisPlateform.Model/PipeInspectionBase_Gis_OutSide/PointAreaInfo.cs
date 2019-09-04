using GisPlateform.Model.AttributePack;
using System;
using System.Runtime.Serialization;

namespace GisPlateform.Model
{
    [Serializable]
    [DataContract]
    public class PointAreaInfo
    {
        [DataMember]
        [Column(FilterType = FilterType.IsPrimaryKey, PrimaryKeyType = PrimaryKeyType.Identity)]
        public int? PointId { set; get; }
        [Column(FilterType = FilterType.IsNotUpdate)]
        [DataMember]
        public int? PlanAreaId { set; get; }
        [DataMember]
        public string PointName { set; get; }
        [DataMember]
        public string PointX { set; get; }
        [DataMember]
        public string PointY { set; get; }
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public DateTime? AddTime { set; get; }
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public int IsShow { set; get; }
    }
}

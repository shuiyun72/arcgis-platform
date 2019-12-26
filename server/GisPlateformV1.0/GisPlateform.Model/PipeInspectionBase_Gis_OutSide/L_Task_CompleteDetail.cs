using GisPlateform.Model.AttributePack;
using System;
using System.Runtime.Serialization;

namespace GisPlateform.Model.PipeInspectionBase_Gis_OutSide
{
    [Serializable]
    [DataContract]
    public class L_Task_CompleteDetail
    {
        [DataMember]
        [Column(FilterType = FilterType.IsPrimaryKey, PrimaryKeyType = PrimaryKeyType.Identity)]
        public int ID { set; get; }
        [DataMember]
        public int TaskId { set; get; }
        [DataMember]
        public string Devicename { set; get; }
        [DataMember]
        public int Devicesmid { set; get; }
        [DataMember]
        public DateTime Uptime { set; get; }
        [DataMember]
        public string x { set; get; }
        [DataMember]
        public string y { set; get; }
        [DataMember]
        public string Peopleid { set; get; }
        [DataMember]
        public string ImagePath { set; get; }
        [DataMember]
        public string Address { set; get; }
        [DataMember]
        public string Miaoshu { set; get; }
        [DataMember]
        public int PointType { set; get; }
        [DataMember]
        public string VoicePath { set; get; }
        [DataMember]
        public int IsHidden { set; get; }
        [DataMember]
        public int IsFeedback { set; get; }
        [DataMember]
        public int? EquType { set; get; }
    }
}


using GisPlateform.Model.AttributePack;
using System;
using System.Runtime.Serialization;

namespace GisPlateform.Model
{
    [Serializable]
    [DataContract]
    public class M_EventType
    {
        [DataMember]
        [Column(FilterType = FilterType.IsPrimaryKey, PrimaryKeyType = PrimaryKeyType.Identity)]
        public int? EventTypeId { set; get; }
        /// <summary>
        /// 事件名称
        /// </summary>
        [DataMember]
        public string EventTypeName { set; get; }
        [DataMember]
        public int? ExecTime { set; get; }
        [DataMember]
        public int ParentTypeId { set; get; }
    }
}
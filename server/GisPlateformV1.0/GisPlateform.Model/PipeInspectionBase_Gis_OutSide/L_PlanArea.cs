using GisPlateform.Model.AttributePack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.Model
{
    [Serializable]
    [DataContract]
    public class L_PlanArea
    {
        [DataMember]
        [Column(FilterType = FilterType.IsPrimaryKey, PrimaryKeyType = PrimaryKeyType.Identity)]
        public int PlanAreaId { set; get; }
        [DataMember]
        public string PlanAreaName { set; get; }
        [DataMember]
        public string GeoText { set; get; }
        [DataMember]
        public int DeptId { set; get; }
        [DataMember]
        public int PersonId { set; get; }
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public int AreaState { set; get; }
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public DateTime OperateAddTime { set; get; }
        //[Column(FilterType = FilterType.IsNotUpdate)]
        //public DateTime LastOperateTime { set; get; }
    }
}

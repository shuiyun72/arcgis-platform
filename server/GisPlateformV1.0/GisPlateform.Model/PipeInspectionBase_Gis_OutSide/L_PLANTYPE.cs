using GisPlateform.Model.AttributePack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.Model.PipeInspectionBase_Gis_OutSide
{
    [Serializable]
    [DataContract]
    public class L_PlanType
    {
        [DataMember]
        [Column(FilterType = FilterType.IsPrimaryKey, PrimaryKeyType = PrimaryKeyType.Identity)]
        public int PlanTypeId { set; get; }
        [DataMember]
        public string PlanTypeName { set; get; }
        [DataMember]
        public int ParentTypeId { set; get; }
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public int? Operater { set; get; }
        [DataMember]
        [Column(FilterType = FilterType.IsNotUpdate)]
        public DateTime? OperateDate { set; get; }
      
    }
}

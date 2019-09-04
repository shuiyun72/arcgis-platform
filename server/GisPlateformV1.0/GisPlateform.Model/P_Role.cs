using GisPlateform.Model.AttributePack;
using System;
using System.Runtime.Serialization;

namespace GisPlateform.Model
{

    [Serializable]
    [DataContract]
    public class P_Role
    {
        [DataMember]
        [Column(FilterType = FilterType.IsPrimaryKey, PrimaryKeyType = PrimaryKeyType.Identity)]
        public int iRoleID { set; get; }
        [DataMember]
        public string cRoleName { set; get; }
        [DataMember]
        public int iIsAllowChangePWD { set; get; }
        [DataMember]
        public int iIsLocked { set; get; }
        [DataMember]
        public string cRoleExplain { set; get; }
        [DataMember]
        public bool isSuperAdmin { set; get; }
    }
}

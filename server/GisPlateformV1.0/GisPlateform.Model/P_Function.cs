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
    public class P_Function
    {
        [DataMember]
        [Column(FilterType = FilterType.IsPrimaryKey, PrimaryKeyType = PrimaryKeyType.Identity)]
        public int iFunID { set; get; }
        [DataMember]
        public int iFunFatherID { set; get; }
        [DataMember]
        public string cFunName { set; get; }
        [DataMember]
        public string cFunIcon { set; get; }
        [DataMember]
        public string cFunSmallIcon { set; get; }
        [DataMember]
        public string cFunUrl { set; get; }
        [DataMember]
        public string Params { set; get; }
        [DataMember]
        public string cFunOnClick { set; get; }
        [DataMember]
        public int iFunOrder { set; get; }
        [DataMember]
        public int iFunMenuIsShow { set; get; }
        [DataMember]
        public int cFunMenuOrder { set; get; }
        [DataMember]
        public int Type { set; get; }
        [DataMember]
        public string SqlId { set; get; }
        [DataMember]
        public int System_Type { set; get; }
        [DataMember]
        public string cFunWidth { set; get; }
        [DataMember]
        public string cFunHeight { set; get; }
        [DataMember]
        public int cFunPosition { set; get; }
        [DataMember]
        public int FunctionType { set; get; }
    }
}

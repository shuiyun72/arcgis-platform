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
    public class P_FunPurview
    {
        [DataMember]
        public int iPurviewID { set; get; }
        [DataMember]
        public int iFunID { set; get; }
        [DataMember]
        /// <summary>
        /// 
        /// </summary>
        public int iPurviewType { set; get; }
        [DataMember]
        public P_Function Function { set; get; }
    }
}

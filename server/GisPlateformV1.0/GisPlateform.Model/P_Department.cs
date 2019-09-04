using GisPlateform.Model.AttributePack;
using System;
using System.Runtime.Serialization;

namespace GisPlateform.Model
{
    //P_Department
    [Serializable]
    [DataContract]
    public class P_Department
    {

        /// <summary>
        /// iDeptID
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsPrimaryKey, PrimaryKeyType = PrimaryKeyType.Identity)]
        public int iDeptID
        {
            set; get;
        }
        /// <summary>
        /// PiDeptID
        /// </summary>		
        [DataMember]
        public int PiDeptID
        {
            set; get;
        }
        /// <summary>
        /// iAdminID
        /// </summary>		
        [DataMember]
        public int iAdminID
        {
            set; get;
        }
        /// <summary>
        /// cDepName
        /// </summary>		
        [DataMember]
        public string cDepName
        {
            set; get;
        }
        /// <summary>
        /// cDepTel
        /// </summary>		
        [DataMember]
        public string cDepTel
        {
            set; get;
        }
        /// <summary>
        /// cDepEmail
        /// </summary>		
        [DataMember]
        public string cDepEmail
        {
            set; get;
        }
        /// <summary>
        /// iIsLocked
        /// </summary>		
        [DataMember]
        public int iIsLocked
        {
            set; get;
        }
        /// <summary>
        /// iIsAllowChangePWD
        /// </summary>		
        [DataMember]
        public int iIsAllowChangePWD
        {
            set; get;
        }

    }
}

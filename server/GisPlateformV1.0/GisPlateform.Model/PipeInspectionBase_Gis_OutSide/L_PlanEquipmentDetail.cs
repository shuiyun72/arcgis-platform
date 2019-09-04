using GisPlateform.Model.AttributePack;
using System;
using System.Runtime.Serialization;

namespace GisPlateform.Model.PipeInspectionBase_Gis_OutSide
{
    //L_PlanEquipmentDetail
    [Serializable]
    [DataContract]
    public class L_PlanEquipmentDetail
    {

        /// <summary>
        /// 计划明细ID自增长
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsPrimaryKey, PrimaryKeyType = PrimaryKeyType.Identity)]
        public int PlanListId
        {
            set; get;
        }
        /// <summary>
        /// 计划ID对应L_Plan表
        /// </summary>		
        [DataMember]
        public int PlanID
        {
            set; get;
        }
        /// <summary>
        /// 设备ID
        /// </summary>		
        [DataMember]
        public string SmID
        {
            set; get;
        }
        /// <summary>
        /// 设备的x坐标
        /// </summary>		
        [DataMember]
        public string SmX
        {
            set; get;
        }
        /// <summary>
        /// 设备Y坐标
        /// </summary>		
        [DataMember]
        public string SmY
        {
            set; get;
        }
        /// <summary>
        /// 设备类别名称
        /// </summary>		
        [DataMember]
        public string EquType
        {
            set; get;
        }

    }
}
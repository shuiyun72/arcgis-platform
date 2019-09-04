using GisPlateform.Model.AttributePack;
using System;
using System.Runtime.Serialization;

namespace GisPlateform.Model.PipeInspectionBase_Gis_OutSide
{
    //M_WorkOrder_Oper_History
    [Serializable]
    [DataContract]
    public class M_WorkOrder_Oper_History
    {
        /// <summary>
        /// 编号
        /// </summary>		
        [DataMember]
        [Column(FilterType = FilterType.IsPrimaryKey, PrimaryKeyType = PrimaryKeyType.Identity)]
        public int HistoryId
        {
            set; get;
        }
        /// <summary>
        /// 事件ID
        /// </summary>		
        [DataMember]
        public int EventID
        {
            set; get;
        }
        /// <summary>
        /// 工单编号,关联工单表中自增id
        /// </summary>		
        [DataMember]
        public int OrderId
        {
            set; get;
        }
        /// <summary>
        /// 步骤ID
        /// </summary>		
        [DataMember]
        public int OperId
        {
            set; get;
        }
        /// <summary>
        /// 步骤处理时间
        /// </summary>		
        [DataMember]
        public DateTime OperTime
        {
            set; get;
        }
        /// <summary>
        /// 上传图片
        /// </summary>		
        [DataMember]
        public string Pictures
        {
            set; get;
        }
        /// <summary>
        /// 上传声音-目前不使用
        /// </summary>		
        [DataMember]
        public string Voices
        {
            set; get;
        }
        /// <summary>
        /// 操作意见
        /// </summary>		
        [DataMember]
        public string OperRemarks
        {
            set; get;
        }
        /// <summary>
        /// 指派人ID
        /// </summary>		
        [DataMember]
        public int DispatchPersonID
        {
            set; get;
        }
        /// <summary>
        /// 执行人ID
        /// </summary>		
        [DataMember]
        public int ExecPersonId
        {
            set; get;
        }
        /// <summary>
        /// 数据默认处理时间
        /// </summary>		
        [DataMember]
        public DateTime ExecUpDateTime
        {
            set; get;
        }
        /// <summary>
        /// 执行人部门ID
        /// </summary>		
        [DataMember]
        public int ExecDetpID
        {
            set; get;
        }
        /// <summary>
        /// 事件状态
        /// </summary>		
        [DataMember]
        public int IsValid
        {
            set; get;
        }

    }
}
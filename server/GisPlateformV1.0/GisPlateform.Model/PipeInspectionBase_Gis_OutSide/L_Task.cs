using GisPlateform.Model.AttributePack;
using System;
using System.Runtime.Serialization;

namespace GisPlateform.Model.PipeInspectionBase_Gis_OutSide
{
    //L_Task
    [Serializable]
    [DataContract]
    public class L_Task
    {

        /// <summary>
        /// TaskId
        /// </summary>		
        [DataMember]
        public int TaskId
        {
            set; get;
        }
        /// <summary>
        /// 任务名称
        /// </summary>		
        [DataMember]
        public string TaskName
        {
            set; get;
        }
        /// <summary>
        /// 部门名称
        /// </summary>		
        [DataMember]
        public string ProraterDeptName
        {
            set; get;
        }
        /// <summary>
        /// 部门ID
        /// </summary>		
        [DataMember]
        public int ProraterDeptId
        {
            set; get;
        }
        /// <summary>
        /// 巡检人员
        /// </summary>		
        [DataMember]
        public string ProraterName
        {
            set; get;
        }
        /// <summary>
        /// 巡检人员ID
        /// </summary>		
        [DataMember]
        public int ProraterId
        {
            set; get;
        }
        /// <summary>
        /// 任务开始时间
        /// </summary>		
        [DataMember]
        public DateTime VisitStarTime
        {
            set; get;
        }
        /// <summary>
        /// 任务结束时间
        /// </summary>		
        [DataMember]
        public DateTime VisitOverTime
        {
            set; get;
        }
        /// <summary>
        /// 任务执行频率
        /// </summary>		
        [DataMember]
        public string Frequency
        {
            set; get;
        }
        /// <summary>
        /// 任务描述
        /// </summary>		
        [DataMember]
        public string Descript
        {
            set; get;
        }
        /// <summary>
        /// 任务添加人
        /// </summary>		
        [DataMember]
        public string Operator
        {
            set; get;
        }
        /// <summary>
        /// 任务添加时间
        /// </summary>		
        [DataMember]
        public DateTime OperateDate
        {
            set; get;
        }
        /// <summary>
        /// 任务状态 0:作废1:启用
        /// </summary>		
        [DataMember]
        public int TaskState
        {
            set; get;
        }
        /// <summary>
        /// 计划ID
        /// </summary>		
        [DataMember]
        public int PlanId
        {
            set; get;
        }
        /// <summary>
        /// 计划名称
        /// </summary>		
        [DataMember]
        public string PlanName
        {
            set; get;
        }
        /// <summary>
        /// Remark
        /// </summary>		
        [DataMember]
        public string Remark
        {
            set; get;
        }
        /// <summary>
        /// 0:未完成 1:已完成
        /// </summary>		
        [DataMember]
        public int Finish
        {
            set; get;
        }
        /// <summary>
        /// 0或者空为未分派1:已分派
        /// </summary>		
        [DataMember]
        public int AssignState
        {
            set; get;
        }
        /// <summary>
        /// 巡检任务编号,系统自动生成
        /// </summary>		
        [DataMember]
        public string TaskCode
        {
            set; get;
        }

    }
}
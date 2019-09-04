using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL.InspectionPlan
{
    public interface ITaskManageDAL:IDependency
    {
        MessageEntity GetTaskManageInfo( string serachCondition, int? isNomalPlan,int? isAssigned, int? deptId, int? operatorId, DateTime? startTime, DateTime? endTime, string sort, string ordering, int num, int page);
        MessageEntity GetPlanListCount(DateTime startTime, DateTime endTime);
        MessageEntity AssignTask(string[] taskIds);
        MessageEntity Delete(string[] taskIds);
        //   MessageEntity AssignPlan(ProraterDeptName);
        MessageEntity GetTaskPlanInfo(int taskId);
        MessageEntity PostTaskEqument(L_Task_CompleteDetail task_CompleteDetail);
    }
}

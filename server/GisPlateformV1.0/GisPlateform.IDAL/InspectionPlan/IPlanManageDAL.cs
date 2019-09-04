using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace GisPlateform.IDAL.InspectionPlan
{
    public interface IPlanManageDAL : IDependency
    {
        MessageEntity GetPlanManageInfo(int? planTypeId, string serachCondition, int? isNomalPlan, int? deptId, int? operatorId, DateTime? startTime, DateTime? endTime, string sort, string ordering, int num, int page);

        MessageEntity Add(string planName, int planTypeId, int planTypeLB, string equipmentIdList, string planPath, int planCycleId, int isFeedBack, int isNomalPlan, string equipmentNameList, string equmentInfo, int moveType, DateTime invalidationDate, int planAreaId, int planLineId,string operatorName,List<Equipment> equipmentList);
        MessageEntity Update(L_Plan plan);
        MessageEntity Delete(int planId);
        MessageEntity AssignTask(L_Task task);
    }
}
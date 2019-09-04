using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL.InspectionPlan
{
    public interface IPlanLineDAL:IDependency
    {
        MessageEntity GetPlanLineInfo(string sort, string ordering, int num, int page);
        MessageEntity Add(L_PlanLine planLine);
        MessageEntity Update(L_PlanLine planLine);
        MessageEntity Delete(Object planLine);
    }
}

using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL.InspectionPlan
{
    public interface IPlanLineDetailDAL:IDependency
    {
        MessageEntity GetPlanLineDetailInfo(string planLineId, string sort, string ordering, int num, int page);

        MessageEntity Update(PlanLineDetail value);
        MessageEntity Add(PlanLineDetail value);
        MessageEntity Delete(PlanLineDetail value);
    }
}

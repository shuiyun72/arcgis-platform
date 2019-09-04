using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL
{
    public interface IPlanAreaDAL : IDependency
    {
        MessageEntity GetAllPlanAreaInfo(string sort, string ordering,int num, int page);
        MessageEntity AddPlanArea(L_PlanArea planArea);
        MessageEntity UpdatePlanArea(L_PlanArea planArea);
        MessageEntity DeletePlanArea(L_PlanArea planArea);
    }
}

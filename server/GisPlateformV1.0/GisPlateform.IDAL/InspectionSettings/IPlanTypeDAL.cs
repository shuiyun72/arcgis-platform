using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL.InspectionSettings
{
    public interface IPlanTypeDAL:IDependency
    {
        MessageEntity GetComboBoxList();
        MessageEntity GetPlanTypByPlanTypeId(int planTypeId, string sort, string ordering, int num, int page);
        MessageEntity Add(L_PlanType planType);
        MessageEntity Update(L_PlanType planType);
        MessageEntity Delete(L_PlanType planType);
    }
}

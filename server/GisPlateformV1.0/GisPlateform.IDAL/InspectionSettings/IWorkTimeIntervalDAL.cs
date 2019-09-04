using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL.InspectionSettings
{
   public interface IWorkTimeIntervalDAL:IDependency
    {
        MessageEntity Get(string sort, string ordering, int num, int page);
        MessageEntity Add(L_WorkTimeInterval workTimeInterval);
        MessageEntity Update(L_WorkTimeInterval workTimeInterval);
        MessageEntity Delete(L_WorkTimeInterval workTimeInterval);
    }
}

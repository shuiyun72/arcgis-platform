using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL.InspectionSettings
{
    public interface IEventStatusDAL : IDependency
    {
        MessageEntity GetStatusForInspection();
        MessageEntity GetStatusForMantain();
    }
}

using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL.InspectionMonitor
{
    public interface IMonitorDAL : IDependency
    {
        MessageEntity GetInspectors();
        MessageEntity GetInspectionRoute(int iAdminID, DateTime startTime, DateTime endTime);
    }
}

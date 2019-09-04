using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL.InspectionStatistics
{
    public interface ITaskStatisticsDAL : IDependency
    {
        MessageEntity GetTable(int? deptId, int? personId, int? checkCycleId, DateTime? startTime, DateTime? endTime, string sort, string ordering, int num, int page);
    }
}

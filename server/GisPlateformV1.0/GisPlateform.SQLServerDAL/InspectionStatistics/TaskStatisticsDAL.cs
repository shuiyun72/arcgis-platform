using GisPlateform.IDAL.InspectionStatistics;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.SQLServerDAL.InspectionStatistics
{
    public class TaskStatisticsDAL : ITaskStatisticsDAL
    {
        public MessageEntity GetTable(int? deptId, int? personId, int? checkCycleId, DateTime? startTime, DateTime? endTime, string sort, string ordering, int num, int page)
        {
            throw new NotImplementedException();
        }
    }
}

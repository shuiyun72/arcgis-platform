using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL.InspectionStatistics
{
    public interface IExecutedRateDAL
    {
        MessageEntity GetTable(DateTime? startTime, DateTime? endTime);
        MessageEntity GetPieChart(DateTime? startTime, DateTime? endTime);
    }
}

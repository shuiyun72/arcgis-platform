using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL.InspectionStatistics
{
    public interface IEventTypeTrendStatisticsDAL:IDependency
    {
        MessageEntity GetTable(string[] months,string yearStr, string startMStr, string endMStr);
        MessageEntity GetLineChart(string[] months, string yearStr, string startMStr, string endMStr);
    }
}

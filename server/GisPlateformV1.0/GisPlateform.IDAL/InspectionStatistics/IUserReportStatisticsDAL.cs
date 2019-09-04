using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL.InspectionStatistics
{
    public interface IUserReportStatisticsDAL:IDependency
    {
        MessageEntity GetTable(DateTime? startTime, DateTime? endTime);
        
    }
}

using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace GisPlateform.IDAL.MainTainStatistics
{
   public interface IMainTainStatisticsDAL : IDependency
    {
         MessageEntity Get(DateTime? startTime, DateTime? endTime, string sort,string ordering, int num, int page);
        MessageEntity EChatEventFromStatistics(DateTime? startTime , DateTime? endTime );
        DataTable EventFromStatisticsbyDate(DateTime? startTime, DateTime? endTime);
        DataTable DtDateByEventfromStatistics(DateTime? startTime, DateTime? endTime);
        DataTable EventFromNameStatistics(DateTime? startTime, DateTime? endTime);
    }
}

using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace GisPlateform.IDAL
{
    public interface IAttendanceRecordDAL : IDependency
    {
        MessageEntity Get(DateTime startTime, DateTime endTime,int? deptId,int ? iAdminID, string sort, string ordering, int num, int page);
        MessageEntity  QianDao(string Lwr_PersonId, string Lwr_XY, int DeptId, string Lwr_BeiZhu, string Lwr_UpTime, string Lwr_Date, string Lwr_StartTime, string Lwr_EndTime, string Lwr_Hour, string Lwr_PersonStatus);
        DataTable GetQianDao(string Lwr_PersonId, string UpTime);
    }
}

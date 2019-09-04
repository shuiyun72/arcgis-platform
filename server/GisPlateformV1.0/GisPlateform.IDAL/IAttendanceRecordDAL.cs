using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL
{
    public interface IAttendanceRecordDAL : IDependency
    {
        MessageEntity Get(DateTime startTime, DateTime endTime,int? deptId, string sort, string ordering, int num, int page);
    }
}

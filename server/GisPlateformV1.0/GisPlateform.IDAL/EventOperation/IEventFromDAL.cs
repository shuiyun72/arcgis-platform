using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL.EventOperation
{
    public interface IEventFromDAL : IDependency
    {
        MessageEntity GetEventFrom(DateTime? startTime, DateTime? endTime);
    }
}

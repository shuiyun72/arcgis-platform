using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL
{
    public interface IEventContentDAL : IDependency
    {
        MessageEntity GetEventContentInfo(int? eventTypeId, string sort, string ordering, int num, int page);
      
    }
}

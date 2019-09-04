using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL
{
    public interface IEventTypeDAL : IDependency
    {
        MessageEntity GetEventType(string sort, string ordering, int num, int page);
        MessageEntity GetEventTypeCommboBoxList();

        MessageEntity AddEventType(M_EventType eventType);
        MessageEntity UpdateEventType(M_EventType eventType);
        MessageEntity DeleteEventType(M_EventType eventType);
    }
}

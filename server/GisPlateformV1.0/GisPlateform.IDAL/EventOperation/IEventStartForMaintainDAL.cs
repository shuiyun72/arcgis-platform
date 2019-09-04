using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL.EventOperation
{
   public interface IEventStartForMaintainDAL : IDependency
    {
        MessageEntity GetEventFromComboBoxList();
        MessageEntity GetUrgencyComboBoxList();
        MessageEntity AddEventStart(string iAdminID, string cAdminName, string iDeptID, int? EventFromId, int? UrgencyId, int? EventTypeId, int? EventTypeId2, string EventTypeName, string EventTypeName2, string EventX, string EventY, int? ExecDetpID, int? ExecPersonId, string EventCode,string EventDesc, string LinkMan, string LinkCall, string EventAddress);
    }
}

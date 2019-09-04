using GisPlateform.Database;
using GisPlateform.IDAL;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace GisPlateform.SQLServerDAL.InspectionSettings
{
    class EventContentDAL : IEventContentDAL
    {
        public MessageEntity GetEventContentInfo(int? eventTypeId, string sort, string ordering, int num, int page)
        {
            if (string.IsNullOrEmpty(sort))
            {
                sort = "EventTypeName";
            }

            if (string.IsNullOrEmpty(ordering))
            {
                ordering = "asc";
            }
            string sqlstr = @"select b.EventTypeId,A.EventTypeName ParentTypeName,b.EventTypeName,b.ParentTypeId,b.ExecTime from M_EventType a left join M_EventType b on b.ParentTypeId = a.EventTypeId where 1=1 and b.ParentTypeId  <>  '0'";
            if (eventTypeId!=null)
            {
                sqlstr += " and b.ParentTypeId=( select EventTypeId from M_EventType where  EventTypeId ='" + eventTypeId + "')";
            }
            DapperExtentions.EntityForSqlToPager<dynamic>(sqlstr, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide);

            return result;
        }
    }
}
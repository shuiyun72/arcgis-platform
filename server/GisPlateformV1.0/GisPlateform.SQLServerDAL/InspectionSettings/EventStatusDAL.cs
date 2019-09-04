using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL.InspectionSettings;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.SQLServerDAL.InspectionSettings
{
    public class EventStatusDAL : IEventStatusDAL
    {
        public MessageEntity GetStatusForInspection()
        {
            string errorMsg = "";
            string query = " select OperId,OperName2 from M_WorkOrder_Oper where OperId in (1,2,3,4,5,6,7,11) ";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    List<dynamic> eventType = conn.Query<dynamic>(query).ToList();

                    return MessageEntityTool.GetMessage(eventType.Count(), eventType, true, "", eventType.Count());
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }

            
        }

        public MessageEntity GetStatusForMantain()
        {
            string errorMsg = "";
            string query = " SELECT OperId,OperName,OperName2,ROW_NUMBER() OVER(ORDER BY rankorder) [rank] FROM M_WorkOrder_Oper where OperId in (11, 2, 3, 4, 5, 6, 7, 9) ";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    List<dynamic> eventType = conn.Query<dynamic>(query).ToList();

                    return MessageEntityTool.GetMessage(eventType.Count(), eventType, true, "", eventType.Count());
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
        }
    }
}

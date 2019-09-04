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
    public class EquipmentDAL : IEquipmentDAL
    {
        public MessageEntity GetByLayerNid(string layerId, string objecketId)
        {
            string errorMsg = "";
            string query = $@" select * from  {layerId} where OBJECTID = {objecketId}";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GISDB))
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

        public MessageEntity GetComboBoxList()
        {
            string errorMsg = "";
            string query = " select EquipmentId ,EquipmentName  from  L_Equipment where EquipmentState = 1 order by EquipmentId asc";
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

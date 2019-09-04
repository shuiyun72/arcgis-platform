using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL.EventOperation;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace GisPlateform.SQLServerDAL.EventOperation
{
  public  class EventFromDAL: IEventFromDAL
    {
        public MessageEntity GetEventFrom(DateTime? startTime, DateTime? endTime)
        {
            string errorMsg = "";
            #region 条件
            string sqlwhere = " ";
            if (startTime != null)
            {
                sqlwhere += " and UpTime>='" + startTime + "' ";
            }
            if (endTime != null)
            {
                endTime = DateTime.Parse(endTime.ToString()).AddDays(1);
                sqlwhere += " and UpTime<='" + endTime + "' ";
            }
            #endregion
            string query = string.Format(@" select  A.EventFromId, C.EventFromName,COUNT(0) SUMCOUNT
FROM            dbo.M_Event AS A LEFT OUTER JOIN
                dbo.M_EventFrom AS C ON A.EventFromId = C.EventFromId where a.DeleteStatus=0
				{0}
				GROUP BY A.EventFromId,C.EventFromName", sqlwhere);
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

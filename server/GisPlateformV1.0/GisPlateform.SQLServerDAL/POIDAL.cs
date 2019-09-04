using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.SQLServerDAL
{
    public class POIDAL : IPOIDAL
    {
        public MessageEntity Get(string name)
        {
            string queryStr = $@"SELECT  * FROM POI WHERE NAME LIKE @likeName ";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GISDB))
                {
                    List<dynamic> result = conn.Query<dynamic>(queryStr, new { likeName = "%" + name + "%" }).ToList();

                    return MessageEntityTool.GetMessage(result.Count(), result);
                }
            }
            catch (Exception e)
            {
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
        }
    }
}

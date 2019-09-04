using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL;
using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.SQLServerDAL
{
    public class DepartmentDAL : BaseDAL, IDepartmentDAL
    {
        public MessageEntity Get(string sort, string ordering, int num, int page)
        {

            string sqlStr = $@"SELECT a.* FROM dbo.P_Department a where PiDeptID !=0 ";

            DapperExtentions.EntityForSqlToPager<P_Department>(sqlStr, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.GisPlateform);

            return result;
        }

        public MessageEntity Add(P_Department department)
        {
            base.InsertEntity(department, ConnectionFactory.DBConnNames.GisPlateform, out MessageEntity messageEntity);
            return messageEntity;
        }

        public MessageEntity Delete(P_Department department)
        {
            base.DeleteEntity(department, ConnectionFactory.DBConnNames.GisPlateform, out MessageEntity messageEntity);
            return messageEntity;
        }
        
        public MessageEntity Update(P_Department department)
        {
            base.UpdateEntity(department, ConnectionFactory.DBConnNames.GisPlateform, out MessageEntity messageEntity);
            return messageEntity;
        }
        public List<dynamic> GetDeptInfoList(out string errorMsg)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                errorMsg = "";
                string query = "SELECT a.* FROM dbo.P_Department a where PiDeptID !=0 ;";

                try
                {
                    var b = conn.Query<dynamic>(query).ToList();
                    return b;
                }
                catch (Exception e)
                {
                    errorMsg = e.Message;
                    return null;
                }
            }
        }
    }
}

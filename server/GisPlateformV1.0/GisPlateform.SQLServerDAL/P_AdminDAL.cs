using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL;
using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GisPlateform.SQLServerDAL
{
    public class P_AdminDAL : IP_AdminDAL
    {
        public P_Admin GetEntity(string id)
        {
            P_Admin p_Admin;
            string query = "SELECT * FROM P_Admin WHERE iAdminID = @iAdminID";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                p_Admin = conn.Query<P_Admin>(query, new { iAdminID = id }).SingleOrDefault();
                return p_Admin;
            }
        }

        public P_Admin GetEntityWithRefence(string id)
        {
            P_Admin p_Admin;
            string query = "SELECT * FROM P_Admin WHERE iAdminID = @iAdminID";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                p_Admin = conn.Query<P_Admin>(query, new { iAdminID = id }).SingleOrDefault();
                return p_Admin;
            }
        }

        public List<P_Admin> GetList()
        {
            throw new NotImplementedException();
        }

        public MessageEntity GetListByPage(string sort, string ordering, int num, int page)
        {
            string sql = "SELECT * FROM P_Admin";
            DapperExtentions.EntityForSqlToPager<P_Admin>(sql, sort, ordering, num, page, out MessageEntity result);
            return result;
        }

        public int Insert(P_Admin p_Admin)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                return conn.Execute(DapperExtentions.MakeInsertSql(p_Admin), p_Admin);
            }
        }


    }
}

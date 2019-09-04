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
    public class RoleDAL :BaseDAL, IRoleDAL
    {
        public MessageEntity Add(P_Role role)
        {
            base.InsertEntity(role, ConnectionFactory.DBConnNames.GisPlateform, out MessageEntity messageEntity);
            return messageEntity;
        }

        public MessageEntity Delete(P_Role role)
        {
            base.DeleteEntity(role, ConnectionFactory.DBConnNames.GisPlateform, out MessageEntity messageEntity);
            return messageEntity;
        }

        public MessageEntity Get(string roleName, string sort, string ordering, int num, int page)
        {
            string strWhere = " where 1=1 ";
            if (!string.IsNullOrEmpty(roleName))
                strWhere += $" and cRoleName like '%{roleName}%' ";
            
            string sqlStr = $@" SELECT *  from P_Role {strWhere} ";

            var users = DapperExtentions.EntityForSqlToPager<P_Role>(sqlStr, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.GisPlateform);

            return result;
        }

        public MessageEntity Update(P_Role role)
        {
            base.UpdateEntity(role, ConnectionFactory.DBConnNames.GisPlateform, out MessageEntity messageEntity);
            return messageEntity;
        }
    }
}

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
    public class RoleDAL :BaseDAL, IRoleDAL
    {
        public MessageEntity Add(P_Role role)
        {
            if (IsExist(role))
            {
                return MessageEntityTool.GetMessage(ErrorType.OprationError, "", "已存在相同角色名称");
            }
            base.InsertEntity(role, ConnectionFactory.DBConnNames.GisPlateform, out MessageEntity messageEntity);
            return messageEntity;
        }

        public MessageEntity Delete(P_Role role)
        {
         
            //不允许删除
            if (IsAllowDelete(role))
            {
                return MessageEntityTool.GetMessage(ErrorType.OprationError, "", "超级管理员不允许删除");
            }
            if (IsExistUser(role))
            {
                return MessageEntityTool.GetMessage(ErrorType.OprationError, "", "该岗位下存在用户,不允许删除");
            }
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
            if (IsExist(role))
            {
                return MessageEntityTool.GetMessage(ErrorType.OprationError, "", "已存在相同角色名称");
            }
            base.UpdateEntity(role, ConnectionFactory.DBConnNames.GisPlateform, out MessageEntity messageEntity);
            return messageEntity;
        }
        /// <summary>
        /// 超级管理员岗位不能删除 
        /// </summary>
        /// <param name="admin"></param>
        /// <param name="errorMsg"></param>
        /// <returns></returns>
        public bool IsAllowDelete(P_Role role)
        {
          
            string sql = $@"  select r.isSuperAdmin from   P_Role as r  where r.iRoleID= {role.iRoleID} ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                try
                {
                    List<dynamic> list = conn.Query<dynamic>(sql).ToList();

                    if (list.Count > 0 && list[0].isSuperAdmin == true)
                    {
                        return true;
                    }

                    else
                    {
                        return false;
                    }
                }
                catch (Exception e)
                {

                    return false;
                }
            }
        }
        /// <summary>
        /// 该岗位下是否存在用户
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        public bool IsExistUser(P_Role role)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                try
                {
                    string sql = $@"select count(0) as count from P_Admin p where p.iRoleID = {role.iRoleID}";
                    List<dynamic> pointcc = conn.Query<dynamic>(sql).ToList();
                    if (pointcc[0].count > 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                }
                catch (Exception e)
                {
                    return false;
                }

            }
        }
        public bool IsExist(P_Role role)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                try
                {
                string sql = $@"select count(0) as count from P_Role p where p.iRoleID <> {role.iRoleID}  and p.cRoleName = '{role.cRoleName} '";
                List<dynamic> pointcc = conn.Query<dynamic>(sql).ToList();
                if (pointcc[0].count > 0)
                {
                    return true;
                }
               else
                {
                        return false;
                }
                  
                }
                catch (Exception e)
                {
                    return false;
                }

            }
        }
    }
}

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
            if (IsExist(department))
            {
                return MessageEntityTool.GetMessage(ErrorType.NotUnique, "已存在相同部门名称");
            }
            base.InsertEntity(department, ConnectionFactory.DBConnNames.GisPlateform, out MessageEntity messageEntity);
            return messageEntity;
        }

        public MessageEntity Delete(P_Department department)
        {
            if (IsExistUser(department))
            {
                return MessageEntityTool.GetMessage(ErrorType.OprationError, "", "该部门下存在用户,不允许删除");
            }
            base.DeleteEntity(department, ConnectionFactory.DBConnNames.GisPlateform, out MessageEntity messageEntity);
            return messageEntity;
        }
        /// <summary>
        /// 该部门下是否存在用户
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        public bool IsExistUser(P_Department department)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                try
                {
                    string sql = $@"select count(0) as count from P_Admin p where p.iDeptID = {department.iDeptID}";
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
        public MessageEntity Update(P_Department department)
        {
            if (IsExist(department))
            {
                return MessageEntityTool.GetMessage(ErrorType.NotUnique, "已存在相同部门名称");
            }
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
        public bool IsExist(P_Department department)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                try
                {
                    string sql = $@"select count(0) as count from P_Department p where p.iDeptID <> {department.iDeptID}  and p.cDepName = '{department.cDepName} '";
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

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
    public class CommonDAL : BaseDAL, ICommonDAL
    {
        public List<P_Function> GetRoleAuthority(string roleId, int systemType, out string errorMsg)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                errorMsg = "";
                string query = $@"SELECT f.*
FROM
(
    SELECT fp.iFunID
    FROM dbo.P_FunPurview fp
        LEFT JOIN dbo.P_Role a
            ON 
               
                   a.iRoleID = fp.iPurviewID
                   AND fp.iPurviewType = 2
               
    WHERE a.iRoleID = @iRoleID
    GROUP BY fp.iFunID
) fp
    LEFT JOIN dbo.P_Function f
        ON f.iFunID = fp.iFunID ";
                if (systemType > 0)
                {
                    query += " WHERE f.System_Type=@systemType ";
                }
                try
                {
                    var b = conn.Query<P_Function>(query, new { iRoleID = roleId, systemType }).ToList();
                    return b;
                }
                catch (Exception e)
                {
                    errorMsg = e.Message;
                    return new List<P_Function>();
                }
            }
        }

        public List<P_Function> GetUserAuthority(string userId, int systemType, out string errorMsg)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                errorMsg = "";
                string query = @"SELECT f.*
FROM
(
    SELECT fp.iFunID
    FROM dbo.P_FunPurview fp
        LEFT JOIN dbo.P_Admin a
            ON (
                   a.iAdminID = fp.iPurviewID
                   AND fp.iPurviewType = 1
               )
              {0}
    WHERE a.iAdminID = @iAdminID
    GROUP BY fp.iFunID
) fp
    LEFT JOIN dbo.P_Function f
        ON f.iFunID = fp.iFunID ";
                if (systemType > 0)
                {
                    query = string.Format(query, "");
                    query += " WHERE f.System_Type=@systemType ";

                }
                else
                {
                    query = string.Format(query, @" OR
               (
                   a.iRoleID = fp.iPurviewID
                   AND fp.iPurviewType = 2
               ) ");
                }
                try
                {
                    var b = conn.Query<P_Function>(query, new { iAdminID = userId, systemType }).ToList();
                    return b;
                }
                catch (Exception e)
                {
                    errorMsg = e.Message;
                    return new List<P_Function>();
                }
            }
        }

        public P_Admin GetUserInfo(string loginContent, string password, out string errorMsg)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                errorMsg = "";
                string query = "SELECT a.*,r.* FROM dbo.P_Admin a LEFT JOIN dbo.P_Role r ON r.iRoleID = a.iRoleID WHERE a.cAdminName = @loginContent and a.cAdminPassWord=@password  and a.IsDelete!=1";
                //string query = "SELECT a.* FROM dbo.P_Admin a  WHERE a.cAdminName = @loginContent and a.cAdminPassWord=@password";
                try
                {
                    var b = conn.Query<P_Admin, P_Role, P_Admin>(query, (admin, role) =>
                         {
                             admin.P_Role = role;
                             return admin;
                         }, new { loginContent = loginContent, password = password }, splitOn: "iRoleID").Distinct().SingleOrDefault();
                    return b;
                }
                catch (Exception e)
                {
                    errorMsg = e.Message;
                    return new P_Admin();
                }
            }
        }

        public P_Admin GetUserInfo(string userId, out string errorMsg)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                errorMsg = "";
                string query = "SELECT a.* FROM dbo.P_Admin a WHERE a.iAdminID = @userId";
                //string query = "SELECT a.* FROM dbo.P_Admin a  WHERE a.cAdminName = @loginContent and a.cAdminPassWord=@password";
                try
                {
                    var b = conn.Query<P_Admin>(query, new { userId = userId }).SingleOrDefault();
                    return b;
                }
                catch (Exception e)
                {
                    errorMsg = e.Message;
                    return new P_Admin();
                }
            }
        }

        public P_Admin GetUserInfoByName(string userName, out string errorMsg)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                errorMsg = "";
                string query = "SELECT top(1) a.*,r.* FROM dbo.P_Admin a LEFT JOIN dbo.P_Role r ON r.iRoleID = a.iRoleID WHERE a.cAdminName = @userName ";

                try
                {
                    var b = conn.Query<P_Admin, P_Role, P_Admin>(query, (admin, role) =>
                    {
                        admin.P_Role = role;
                        return admin;
                    }, new { userName }, splitOn: "iRoleID").Distinct().SingleOrDefault();
                    return b;
                }
                catch (Exception e)
                {
                    errorMsg = e.Message;
                    return new P_Admin();
                }
            }
        }

        public List<P_Admin> GetUserInfoListByDeptId(string deptId, string roleId, out string errorMsg)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                errorMsg = "";
                string query = @"SELECT iAdminID
                                      ,iDeptID
                                      ,iRoleID
                                      ,cAdminName
                                      ,CJobNumber
                                      ,cAdminSex
                                      ,cAdminPassWord
                                      ,cAdminTel
                                      ,cAdminEmail
                                      ,iIsLocked
                                      ,dExpireDate
                                      ,iIsAllowChangePWD
                                      ,cLastLoginIP
                                      ,dLastLoginTime
                                      ,dLastLogoutTime
                                      ,iLoginTimes
                                      ,cTitlePic
                                      ,iSkinID
                                      ,LoginTicket
                                      ,Smid
                                      ,JueSeID
                                      ,IsNumOne
                                      ,Level
                                      ,AllPinyin
                                      ,IsDelete FROM dbo.P_Admin a WHERE 1=1 ";
                string whereStr = "";
                if (!string.IsNullOrEmpty(deptId))
                {
                    whereStr += "and  iDeptID = @iDeptID ";
                }
                if (!string.IsNullOrEmpty(roleId))
                {
                    whereStr += "and  iRoleID = @iRoleID ";
                }
                try
                {
                    var b = conn.Query<P_Admin>(query + whereStr, new { iDeptID = deptId, iRoleID = roleId }).ToList();
                    return b;
                }
                catch (Exception e)
                {
                    errorMsg = e.Message;
                    return null;
                }
            }
        }
        public List<P_Admin> GetUserInfoListByDeptIdNoDelete(string deptId, string roleId, out string errorMsg)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                errorMsg = "";
                string query = @"SELECT iAdminID
                                      ,iDeptID
                                      ,iRoleID
                                      ,cAdminName
                                      ,CJobNumber
                                      ,cAdminSex
                                      ,cAdminPassWord
                                      ,cAdminTel
                                      ,cAdminEmail
                                      ,iIsLocked
                                      ,dExpireDate
                                      ,iIsAllowChangePWD
                                      ,cLastLoginIP
                                      ,dLastLoginTime
                                      ,dLastLogoutTime
                                      ,iLoginTimes
                                      ,cTitlePic
                                      ,iSkinID
                                      ,LoginTicket
                                      ,Smid
                                      ,JueSeID
                                      ,IsNumOne
                                      ,Level
                                      ,AllPinyin
                                      ,IsDelete FROM dbo.P_Admin a WHERE 1=1 and IsDelete!=1 ";
                string whereStr = "";
                if (!string.IsNullOrEmpty(deptId))
                {
                    whereStr += "and  iDeptID = @iDeptID ";
                }
                if (!string.IsNullOrEmpty(roleId))
                {
                    whereStr += "and  iRoleID = @iRoleID ";
                }
                try
                {
                    var b = conn.Query<P_Admin>(query + whereStr, new { iDeptID = deptId, iRoleID = roleId }).ToList();
                    return b;
                }
                catch (Exception e)
                {
                    errorMsg = e.Message;
                    return null;
                }
            }
        }
        public List<P_Admin> GetUserComboboxListAssigment(string deptId, string roleId, out string errorMsg)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                errorMsg = "";
                string query = @"SELECT iAdminID
                                      ,iDeptID
                                      ,iRoleID
                                      ,cAdminName
                                      ,CJobNumber
                                      ,cAdminSex
                                      ,cAdminPassWord
                                      ,cAdminTel
                                      ,cAdminEmail
                                      ,iIsLocked
                                      ,dExpireDate
                                      ,iIsAllowChangePWD
                                      ,cLastLoginIP
                                      ,dLastLoginTime
                                      ,dLastLogoutTime
                                      ,iLoginTimes
                                      ,cTitlePic
                                      ,iSkinID
                                      ,LoginTicket
                                      ,Smid
                                      ,JueSeID
                                      ,IsNumOne
                                      ,Level
                                      ,AllPinyin
                                      ,IsDelete,IsAssignment FROM dbo.P_Admin a WHERE 1=1 and IsDelete!=1 and IsAssignment=1";
                string whereStr = "";
                if (!string.IsNullOrEmpty(deptId))
                {
                    whereStr += "and  iDeptID = @iDeptID ";
                }
                if (!string.IsNullOrEmpty(roleId))
                {
                    whereStr += "and  iRoleID = @iRoleID ";
                }
                try
                {
                    var b = conn.Query<P_Admin>(query + whereStr, new { iDeptID = deptId, iRoleID = roleId }).ToList();
                    return b;
                }
                catch (Exception e)
                {
                    errorMsg = e.Message;
                    return null;
                }
            }
        }
        
        public MessageEntity GetUsers(string searchCondition, int? roleId, int? deptId, string sort, string ordering, int num, int page)
        {
            string strWhere = " where IsDelete!=1 ";
            if (!string.IsNullOrEmpty(searchCondition))
            {
                strWhere += " and (a.cAdminName like '%" + searchCondition + "%'or a.CJobNumber like '%" + searchCondition + "%' or a.cAdminTel like '%" + searchCondition + "%')";
            }
            if (roleId != null)
                strWhere += $" and a.iRoleID = {roleId} ";
            if (deptId != null)
                strWhere += $" and a.iDeptID = {deptId} ";
            string sqlStr = $@" SELECT a.iAdminID,
       a.iDeptID,
       a.iRoleID,
       a.cAdminName,
       a.CJobNumber,
       a.cAdminSex,
       a.cAdminTel,
       a.cAdminEmail,
       a.iIsLocked,
       a.dExpireDate,
       a.iIsAllowChangePWD,
       a.cLastLoginIP,
       a.dLastLoginTime,
       a.dLastLogoutTime,
       a.iLoginTimes,
       a.cTitlePic,
       a.iSkinID,
       a.LoginTicket,
       a.Smid,
       a.JueSeID,
       a.IsNumOne,
       a.Level,
       a.AllPinyin,
       a.IsDelete ,
	   p.cDepName,
	   r.cRoleName,a.IsAssignment,a.iDeptIDs
	   FROM dbo.P_Admin a LEFT JOIN dbo.P_Department p ON a.iDeptID=p.iDeptID
	   LEFT JOIN dbo.P_Role r ON r.iRoleID = a.iRoleID  {strWhere}";

            var users = DapperExtentions.EntityForSqlToPager<dynamic>(sqlStr, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.GisPlateform);

            return result;
        }

        public MessageEntity AddUser(P_Admin admin)
        {
            base.InsertEntity(admin, ConnectionFactory.DBConnNames.GisPlateform, out MessageEntity messageEntity);
            return messageEntity;
        }

        public MessageEntity DeleteUser(int id)
        {
            string updateSql = @"UPDATE P_Admin
   SET IsDelete = 1
      
 WHERE  iAdminID = @iAdminID ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                //conn.Open();
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        conn.Execute(updateSql, new { iAdminID = id }, transaction);
                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }

            }
        }
        public MessageEntity UpdateUser(P_Admin admin)
        {
            base.UpdateEntity(admin, ConnectionFactory.DBConnNames.GisPlateform, out MessageEntity messageEntity);
            return messageEntity;
        }

        public bool UpdateUserPassword(AdminPassword admin, out string errorMsg)
        {
            errorMsg = "";
            string updateSql = @"UPDATE P_Admin
   SET cAdminPassWord = @cAdminPassWord
      
 WHERE  iAdminID = @iAdminID ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                //conn.Open();
                using (var transaction = conn.BeginTransaction())
                {
                    try
                    {
                        var i = conn.Execute(updateSql, admin, transaction);
                        transaction.Commit();
                        return i > 0;
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        errorMsg = e.Message;
                        return false;
                    }
                }

            }
        }
        public bool IsAllowChangePWD(AdminPassword admin, out string errorMsg)
        {
            errorMsg = "";
            string sql =$@"select iIsAllowChangePWD from  P_Admin WHERE  iAdminID ={ admin.iAdminID }";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                    try
                    {
                        List<dynamic> list = conn.Query<dynamic>(sql).ToList();
                    if (list.Count > 0 && list[0].iIsAllowChangePWD == 1)
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
                       
                        errorMsg = e.Message;
                        return false;
                    }
               
               

            }
        }
        public MessageEntity InsertDayFeezing(string loginContent, string islogin)
        {
            string updateSql = @"   insert into P_AdminDayFreezing(cAdminName,LoginTime,islogin) values(@cAdminName,@LoginTime,@islogin)  ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                //conn.Open();
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        conn.Execute(updateSql, new { cAdminName = loginContent, LoginTime =DateTime.Now , IsLogin =islogin}, transaction);
                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }

            }
        }
        public bool IsDayFeezing(string loginContent, out string errorMsg)
        {
            errorMsg = "";
            string sql = $@"select  DATEDIFF(MINUTE,max( logintime), GETDATE()) AS xcminute ,count(0) as count from [P_AdminDayFreezing] where islogin=0 and cAdminName ='{ loginContent }'   and logintime>
(
select case loginCount when 0 then '1990-01-01' else (select max(logintime)  from [P_AdminDayFreezing] where islogin=1 and cAdminName ='{ loginContent }') end as lastLoginTime
from (select count(0) loginCount from [P_AdminDayFreezing] where  islogin=1  and cAdminName ='{ loginContent }' ) t) ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                try
                {
                    List<dynamic> list = conn.Query<dynamic>(sql).ToList();
                    //十分钟之内不允许输错十次密码
                    if (list.Count > 0 && list[0].count >=4 && list[0].xcminute < 10)
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

                    errorMsg = e.Message;
                    return false;
                }



            }
        }
        public bool IsLocked(string loginContent, out string errorMsg)
        {
            errorMsg = "";
            string sql = $@"select iIsLocked from  P_Admin WHERE  cAdminName ='{ loginContent }'";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                try
                {
                    List<dynamic> list = conn.Query<dynamic>(sql).ToList();
                   
                        if (list.Count > 0 && list[0].iIsLocked == 1)
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

                    errorMsg = e.Message;
                    return false;
                }



            }
        }
        /// <summary>
        /// 是否允许删除
        /// </summary>
        /// <param name="admin"></param>
        /// <param name="errorMsg"></param>
        /// <returns></returns>
        public bool IsAllowDelete(int id, out string errorMsg)
        {
            errorMsg = "";
            string sql = $@"  select r.isSuperAdmin from P_Admin as p left join P_Role as r on p.iRoleID=r.iRoleID where p.iAdminID= {id} ";
            string sql1 = $@"  select p.cAdminName from P_Admin as p  where p.iAdminID= {id} ";

            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                try
                {
                    List<dynamic> list = conn.Query<dynamic>(sql).ToList();
                    List<dynamic> listadmin = conn.Query<dynamic>(sql1).ToList();

                    if (list.Count > 0 && (list[0].isSuperAdmin == true || listadmin[0].cAdminName == "admin"))
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

                    errorMsg = e.Message;
                    return false;
                }
            }
            }
        public P_Admin IsUserExist(string userName, string cJobNumber, int adminId, out string errorMsg)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                errorMsg = "";
                string query = "SELECT * FROM dbo.P_Admin a WHERE (a.cAdminName = @userName or a.CJobNumber = @cJobNumber )and iAdminID!=@adminId";
                //string query = "SELECT a.* FROM dbo.P_Admin a  WHERE a.cAdminName = @loginContent and a.cAdminPassWord=@password";
                try
                {
                    var b = conn.Query<P_Admin>(query, new { userName, cJobNumber, adminId }).FirstOrDefault();
                    return b;
                }
                catch (Exception e)
                {
                    errorMsg = e.Message;
                    return new P_Admin();
                }
            }
        }
    }
}

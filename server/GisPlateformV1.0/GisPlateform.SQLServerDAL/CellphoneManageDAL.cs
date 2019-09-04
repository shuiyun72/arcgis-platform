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
using System.Web;

namespace GisPlateform.SQLServerDAL
{
    public class CellphoneManageDAL : ICellphoneManageDAL
    {
        /// <summary>
        /// 获取App上传记录
        /// </summary>
        /// <param name="sort">排序字段默认(UploadTime)</param>
        /// <param name="ordering">desc/asc默认降序(desc)</param>
        /// <param name="num">默认20</param>
        /// <param name="page">默认1</param>
        /// <returns></returns>
        public MessageEntity Get(string sort, string ordering, int num, int page)
        {

            string sqlStr = $@"SELECT ApkName ,UploadTime,VersionId FROM dbo.AndroidVersion";

            DapperExtentions.EntityForSqlToPager<AndroidVersionModel>(sqlStr, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.GisPlateform);

            return result;
        }
        /// <summary>
        /// 获取最新版本号
        /// </summary>
        /// <returns></returns>
        public MessageEntity GetLatestVersionId()
        {
            string errorMsg = "";
            string query = $@"SELECT top 1 VersionId FROM dbo.AndroidVersion order by UploadTime desc";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
                {
                    List<AndroidVersionModel> eventType = conn.Query<AndroidVersionModel>(query).ToList();

                    return MessageEntityTool.GetMessage(eventType.Count(), eventType, true, "", eventType.Count());
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
        }
        /// <summary>
        /// 上传APP版本信息
        /// </summary>
        /// <param name="VersionId"></param>
        /// <returns></returns>
        public MessageEntity UploadApk(string FileName, string VersionId)
        {
         string insertSql = $"insert into dbo.AndroidVersion (ApkName,UploadTime,VersionId) values (@ApkName,@UploadTime,@VersionId)";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        var i = conn.Execute(insertSql, new { ApkName = FileName, VersionId = VersionId, UploadTime = DateTime.Now.ToString() }, transaction);

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
        public MessageEntity getCount(string VersionId)
        {
            string errorMsg = "";
            string query = $@"select * from dbo.AndroidVersion where VersionId=@VersionId";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
                {
                    List<dynamic> eventType = conn.Query<dynamic>(query, new { VersionId = VersionId }).ToList();

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

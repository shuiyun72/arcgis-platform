using Dapper;
using GisPlateform.Model.AttributePack;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static GisPlateform.Database.ConnectionFactory;

namespace GisPlateform.Database
{
    public class DapperExtentions
    {

        /// <summary>
        /// 获取自动新增数据SQL
        /// </summary>
        /// <param name="entity">实体对象</param>
        /// <returns>sql语句</returns>
        public static string MakeInsertSql(Object entity)
        {
            #region  拼接SQL
            //object obj;
            if (entity == null)
                return string.Empty;

            var type = entity.GetType();
            var properties = CacheFactory.CacheProperties(type);
            var strSql = new StringBuilder();
            var strColumn = new StringBuilder();
            var strValue = new StringBuilder();

            for (var i = 0; i < properties.Length; i++)
            {
                var property = properties[i];
                //获取验证特性
                var columnAttributes = CacheFactory.CacheCustomAttributes(type, property);

                if (columnAttributes.Length > 0)
                { //获取定义的第一个验证特性
                    var columnAttribute = columnAttributes[0] as ColumnAttribute;
                    //if (columnAttribute == null)
                    //    continue;
                    //如果字段不需要执行插入操作，那么忽略
                    if (columnAttribute.FilterType == FilterType.IsNotInsert || columnAttribute.FilterType == FilterType.IsNotEdit)
                        continue;
                    if (columnAttribute.PrimaryKeyType == PrimaryKeyType.Identity || columnAttribute.PrimaryKeyType == PrimaryKeyType.Sequence)
                        continue;
                }
                strColumn.Append(property.Name + ",");
                strValue.AppendFormat("@{0},", property.Name);
            }

            if (strColumn.ToString().EndsWith(","))
            {
                strColumn.Remove(strColumn.Length - 1, 1);
                strValue.Remove(strValue.Length - 1, 1);
            }
            if (strColumn.Length > 0 && strValue.Length > 0)
            {
                strSql.Append("INSERT INTO " + entity.GetType().Name + " (" + strColumn + ") values (" + strValue + ");");
            }

            return strSql.Length > 0 ? strSql.ToString() : string.Empty;

            #endregion
        }

        /// 获取自动根据主键修改数据SQL
        /// </summary>
        /// <param name="entity">实体对象</param>
        /// <returns>sql语句</returns>
        public static string MakeUpdateSql(Object entity)
        {
            #region  拼接SQL
            if (entity == null)
                return string.Empty;

            var type = entity.GetType();
            var properties = CacheFactory.CacheProperties(type);
            var strSql = new StringBuilder();
            var strColumn = new StringBuilder();
            var strWhere = new StringBuilder("1=1");

            for (var i = 0; i < properties.Length; i++)
            {
                var property = properties[i];
                //获取验证特性
                var columnAttributes = CacheFactory.CacheCustomAttributes(type, property);

                if (columnAttributes.Length > 0)
                {
                    var validateAttribute = columnAttributes[0] as ColumnAttribute;

                    //如果字段不需要执行更新操作，那么忽略
                    if (validateAttribute.FilterType == FilterType.IsNotUpdate || validateAttribute.FilterType == FilterType.IsNotEdit)
                        continue;

                    if (validateAttribute.FilterType == FilterType.IsPrimaryKey)
                    {
                        strWhere.AppendFormat(" and " + property.Name + "=" + "@{0}", property.Name);
                    }
                    else
                    {
                        strColumn.AppendFormat(property.Name + "=" + "@{0}", property.Name);
                        if (i >= properties.Length - 1)
                            continue;
                        strColumn.Append(",");
                    }
                }
                else
                {
                    strColumn.AppendFormat(property.Name + "=" + "@{0}", property.Name);
                    if (i >= properties.Length - 1)
                        continue;
                    strColumn.Append(",");
                }
            }

            if (strColumn.ToString().EndsWith(","))
                strColumn.Remove(strColumn.Length - 1, 1);

            if (strColumn.Length > 0 && strWhere.Length > 0)
            {
                strSql.Append("UPDATE " + entity.GetType().Name + " SET " + strColumn + " WHERE " + strWhere + " ;");
            }


            return strSql.Length > 0 ? strSql.ToString() : string.Empty;

            #endregion
        }

        /// 获取自动根据主键删除数据SQL
        /// </summary>
        /// <param name="entity">实体对象</param>
        /// <returns>sql语句</returns>
        public static string MakeDeleteSql(Object entity)
        {
            #region  拼接SQL
            if (entity == null)
                return string.Empty;

            var type = entity.GetType();
            var properties = CacheFactory.CacheProperties(type);
            var strSql = new StringBuilder();
            var strWhere = new StringBuilder(" 1=1 ");

            for (var i = 0; i < properties.Length; i++)
            {
                var property = properties[i];
                //获取验证特性
                var validateContent = CacheFactory.CacheCustomAttributes(type, property);
                //获取属性的值 
                var value = property.GetValue(entity, null);

                if (validateContent.Length < 1)
                    continue;

                ColumnAttribute validateAttribute = validateContent[0] as ColumnAttribute;

                if (validateAttribute == null || validateAttribute.FilterType != FilterType.IsPrimaryKey)
                    continue;

                strWhere.AppendFormat(" and " + property.Name + "=" + "@{0} ", property.Name);
            }

            if (strWhere.Length > 0)
            {
                strSql.Append("DELETE " + entity.GetType().Name + " WHERE " + strWhere + " ; ");
            }
            else
            {
                return "";
            }


            return strSql.Length > 0 ? strSql.ToString() : string.Empty;

            #endregion
        }

        /// <summary>
        /// 如果遇到没有构建返回实体或查询语句很复杂不太知道怎么构建实体 可以把T定义为dynamic
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql">sql查询语句</param>
        /// <param name="sort">排序字段</param>
        /// <param name="ordering">asc/desc</param>
        /// <param name="num">每页多少行</param>
        /// <param name="page">第几页</param>
        /// <param name="messageEntity"></param>
        /// <returns></returns>
        public static List<T> EntityForSqlToPager<T>(string sql, string sort, string ordering, int num, int page, out MessageEntity messageEntity, DBConnNames dbname= DBConnNames.GisPlateform)
        {
            int beginNum = (page - 1) * (num);
            //if (beginNum == 0) { beginNum = 1; }
            int endNum = beginNum + num;

            
            string sqlString = "SELECT * FROM(SELECT * , ROW_NUMBER() OVER ( Order by " + sort + " " + ordering + " ) AS Pos FROM (" + sql + ") as T) AS TT where TT.Pos > " + beginNum.ToString() + " and TT.Pos <= " + endNum.ToString();
            string sqlCountString = "select count(0) as RowsCount from (" + sql + " ) as TT";

            try
            {

                using (IDbConnection conn = ConnectionFactory.GetDBConn(dbname))
                {
                    dynamic result = conn.Query<T>(sqlString);
                    dynamic resultTotalResult = conn.Query<dynamic>(sqlCountString).FirstOrDefault();

                    messageEntity = MessageEntityTool.GetMessage(result.Count, result, true, "完成", Convert.ToInt32(((IDictionary<string, object>)resultTotalResult)["RowsCount"]));
                    return result;
                }
            }
            catch (Exception e)
            {
                messageEntity = MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
            return null;

        }
    }
}

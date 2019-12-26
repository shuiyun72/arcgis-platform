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
    public class PointAreaInfoDAL : IPointAreaInfoDAL
    {
        public MessageEntity AddPointArea(PointAreaInfo pointTable)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                var rows = 0;
                string sql = $@"select count(0) as count from PointAreaInfo p where p.PlanAreaId = {pointTable.PlanAreaId} and p.PointName='{ pointTable.PointName}'";
                List<dynamic> pointcc = conn.Query<dynamic>(sql).ToList();
                if (pointcc[0].count > 0)
                {
                    return MessageEntityTool.GetMessage(ErrorType.NotUnique, "同一区域内不能添加相同关键点");
                }
                var updateSql = DapperExtentions.MakeInsertSql(pointTable);
                if (string.IsNullOrEmpty(updateSql))
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, "请检查实体类");
                }
                try
                {
                    rows = conn.Execute(updateSql, pointTable);
                    return MessageEntityTool.GetMessage(rows);
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }

            }
        }

        public MessageEntity DeletePointArea(PointAreaInfo pointTable)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                var rows = 0;
                var updateSql = DapperExtentions.MakeDeleteSql(pointTable);
                if (string.IsNullOrEmpty(updateSql))
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, "请检查实体类");
                }
                try
                {
                    rows = conn.Execute(updateSql, pointTable);
                    return MessageEntityTool.GetMessage(rows);
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }

            }
        }

        public MessageEntity GetAllPointAreaInfo(string planAreaId, string sort, string ordering, int num, int page)
        {
            if (string.IsNullOrEmpty(sort))
            {
                sort = "PointId";
            }

            if (string.IsNullOrEmpty(ordering))
            {
                ordering = "asc";
            }
            string sql = @"select a.*,b.PlanAreaName from PointAreaInfo as a join L_PlanArea as b on a.PlanAreaId=b.PlanAreaId where 1=1";
            if (!string.IsNullOrEmpty(planAreaId))
            {
                sql += " and a.PlanAreaId='" + planAreaId + "'";
            }
            DapperExtentions.EntityForSqlToPager<dynamic>(sql, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide);

            return result;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="pointId"></param>
        /// <param name="pointTable"></param>
        /// <returns></returns>
        public MessageEntity UpdatePointTableByPointId( PointAreaInfo pointTable)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                var rows = 0;
                string sql = $@"select count(0) as count from PointAreaInfo p where p.PlanAreaId = {pointTable.PlanAreaId} and p.PointName='{ pointTable.PointName}'";
                List<dynamic> pointcc = conn.Query<dynamic>(sql).ToList();
                if (pointcc[0].count > 0)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, "同一区域内不能添加相同关键点");
                }
                var updateSql = DapperExtentions.MakeUpdateSql(pointTable);
                if (string.IsNullOrEmpty(updateSql))
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, "请检查实体类");
                }
                try
                {
                    rows = conn.Execute(updateSql, pointTable);
                    return MessageEntityTool.GetMessage(rows);
                }
                catch (Exception e)
                {
                   return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }

            }

        }
    }
}

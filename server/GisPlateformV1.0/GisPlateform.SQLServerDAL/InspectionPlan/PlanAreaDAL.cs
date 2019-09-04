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
    public class PlanAreaDAL : IPlanAreaDAL
    {
        public MessageEntity GetAllPlanAreaInfo(string sort, string ordering, int num, int page)
        {
            if (string.IsNullOrEmpty(sort))
            {
                sort = "PersonName";
            }

            if (string.IsNullOrEmpty(ordering))
            {
                ordering = "asc";
            }
            string sql = "select a.*,b.DeptName,c.PersonName from L_PlanArea as a left join  L_Department  as b on a.DeptId=b.DeptId left join L_Person as c on a.PersonId=c.PersonId where a.AreaState=1";
            DapperExtentions.EntityForSqlToPager<dynamic>(sql, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide);

            return result;
        }

        public MessageEntity AddPlanArea(L_PlanArea planArea)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                var rows = 0;
                var insertSql = DapperExtentions.MakeInsertSql(planArea);
                if (string.IsNullOrEmpty(insertSql))
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, "请检查实体类");
                }
                try
                {
                    rows = conn.Execute(insertSql, planArea);
                    return MessageEntityTool.GetMessage(rows);
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }
            }
        }

        public MessageEntity DeletePlanArea(L_PlanArea planArea)
        {

            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                var rows = 0;
                var excSql = DapperExtentions.MakeDeleteSql(planArea);
                if (string.IsNullOrEmpty(excSql))
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, "请检查实体类");
                }
                try
                {
                    rows = conn.Execute(excSql, planArea);
                    return MessageEntityTool.GetMessage(rows);
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }
            }
        }
        
        public MessageEntity UpdatePlanArea(L_PlanArea planArea)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                var rows = 0;
                var excSql = DapperExtentions.MakeUpdateSql(planArea);
                if (string.IsNullOrEmpty(excSql))
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, "请检查实体类");
                }
                try
                {
                    rows = conn.Execute(excSql, planArea);
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
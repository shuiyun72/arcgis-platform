using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL.InspectionPlan;
using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.SQLServerDAL.InspectionPlan
{
    public class PlanLineDAL : BaseDAL,IPlanLineDAL
    {
        public MessageEntity Add(L_PlanLine planLine)
        {
            base.InsertEntity(planLine, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide, out MessageEntity messageEntity);
            return messageEntity;
        }

        public MessageEntity Delete(Object planLine)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                var rows = 0;
                var excSql = "UPDATE L_PlanLine set PlanLintState = 0 where PlanLineId = @PlanLineId";
                if (string.IsNullOrEmpty(excSql))
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, "请检查实体类");
                }
                try
                {
                    rows = conn.Execute(excSql, planLine);
                    return MessageEntityTool.GetMessage(rows);
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }
            }
        }

        public MessageEntity GetPlanLineInfo(string sort, string ordering, int num, int page)
        {
            if (string.IsNullOrEmpty(sort))
            {
                sort = "PlanLineId";
            }

            if (string.IsNullOrEmpty(ordering))
            {
                ordering = "asc";
            }
            string sql = "select * from L_PlanLine where PlanLintState = 1";
            DapperExtentions.EntityForSqlToPager<dynamic>(sql, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide);

            return result;
        }

        public MessageEntity Update(L_PlanLine planLine)
        {
            base.UpdateEntity(planLine, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide, out MessageEntity messageEntity);
            return messageEntity;
        }
    }
}

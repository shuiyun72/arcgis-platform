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
    public class PlanLineDetailDAL : BaseDAL,IPlanLineDetailDAL
    {
        public MessageEntity Add(PlanLineDetail value)
        {
            base.InsertEntity(value, Database.ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide,out MessageEntity entity);
            return entity;
        }

        public MessageEntity Delete(PlanLineDetail value)
        {
            base.DeleteEntity(value, Database.ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide, out MessageEntity entity);
            return entity;
        }

        public MessageEntity GetPlanLineDetailInfo(string planLineId, string sort, string ordering, int num, int page)
        {
            
            
            string sql = @" select PlanLineDetaiId
      , PlanLineId
      , X
      , Y
      , OrderNum
      , AddTime
      , ImportPointType
      , CASE WHEN ImportPointName IS NULL THEN '自动点位' ELSE ImportPointName END AS ImportPointName
      ,State
      ,LengthToFirsPointt from PlanLineDetail where 1=1 ";
            if (!string.IsNullOrEmpty(planLineId)) {
                sql += $" and PlanLineId = '{planLineId}' ";
            }
            DapperExtentions.EntityForSqlToPager<dynamic>(sql, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide);

            return result;
        }

        public MessageEntity Update(PlanLineDetail value)
        {
            base.UpdateEntity(value, Database.ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide, out MessageEntity entity);
            return entity;
        }
    }
}

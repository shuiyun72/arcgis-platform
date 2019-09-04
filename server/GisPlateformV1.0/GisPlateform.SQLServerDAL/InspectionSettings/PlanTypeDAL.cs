using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL.InspectionSettings;
using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.SQLServerDAL
{
    public class PlanTypeDAL : BaseDAL, IPlanTypeDAL
    {
        public MessageEntity Add(L_PlanType planType)
        {
            base.InsertEntity(planType, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide, out MessageEntity messageEntity);
            return messageEntity;
        }

        public MessageEntity Delete(L_PlanType planType)
        {
            base.DeleteEntity(planType, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide, out MessageEntity messageEntity);
            return messageEntity;
        }

        public MessageEntity GetComboBoxList()
        {
            string errorMsg = "";
            string query = " select PlanTypeId,PlanTypeName from L_PLANTYPE where ParentTypeId=0";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    List<dynamic> eventType = conn.Query<dynamic>(query).ToList();

                    return MessageEntityTool.GetMessage(eventType.Count(), eventType, true, "", eventType.Count());
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
        }

        public MessageEntity GetPlanTypByPlanTypeId(int planTypeId, string sort, string ordering, int num, int page)
        {
            if (string.IsNullOrEmpty(sort))
            {
                sort = "PlanTypeId";
            }

            if (string.IsNullOrEmpty(ordering))
            {
                ordering = "asc";
            }

            string strWhere = $" and lp.ParentTypeId = {planTypeId} ";


            string sqlStr = $@" select lp.PlanTypeId,lp.PlanTypeName,lp.Operater,lp.OperateDate,pe.PersonName,lp.ParentTypeId,ll.PlanTypeName as ParPlanTypeName
from L_PLANTYPE lp 
left join L_PLANTYPE ll on ll.PlanTypeId = lp.ParentTypeId
left join L_Person pe on pe.PersonId = lp.Operater 
where lp.ParentTypeId <>0  and lp.PlanTypeState = 1 {strWhere}";

            DapperExtentions.EntityForSqlToPager<dynamic>(sqlStr, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide);

            return result;
        }

        public MessageEntity Update(L_PlanType planType)
        {
            base.UpdateEntity(planType, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide, out MessageEntity messageEntity);
            return messageEntity;
        }
    }
}

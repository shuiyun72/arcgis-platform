using GisPlateform.Database;
using GisPlateform.IDAL.InspectionSettings;
using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.SQLServerDAL.InspectionSettings
{
    public class WorkTimeInterval : BaseDAL,IWorkTimeIntervalDAL
    {
        public MessageEntity Add(L_WorkTimeInterval workTimeInterval)
        {
            base.InsertEntity(workTimeInterval, Database.ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide, out MessageEntity messageEntity);
            return messageEntity;
        }

        public MessageEntity Delete(L_WorkTimeInterval workTimeInterval)
        {
            base.DeleteEntity(workTimeInterval, Database.ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide, out MessageEntity messageEntity);
            return messageEntity;
        }

        public MessageEntity Get(string sort, string ordering, int num, int page)
        {
            string sqlStr = $@" select * from L_WorkTimeInterval ";

            DapperExtentions.EntityForSqlToPager<dynamic>(sqlStr, sort, ordering, num, page, out MessageEntity messageEntity, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide);

            return messageEntity;
        }

        public MessageEntity Update(L_WorkTimeInterval workTimeInterval)
        {
            base.UpdateEntity(workTimeInterval, Database.ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide, out MessageEntity messageEntity);
            return messageEntity;
        }
    }
}

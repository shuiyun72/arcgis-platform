using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL.InspectionStatistics;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.SQLServerDAL.InspectionStatistics
{
    public class EventTypeStatisticsDAL : IEventTypeStatisticsDAL
    {
        public MessageEntity GetTable(DateTime startTime, DateTime endTime)
        {
            string sqlStr = "";
            //设定返回的DataTable
            DataTable dt = new DataTable();
            DataColumn col = new DataColumn();
            col.ColumnName = "事件类型名称";
            dt.Columns.Add(col);
            DataColumn col1 = new DataColumn();
            col1.ColumnName = "事件内容";
            dt.Columns.Add(col1);
            DataColumn col2 = new DataColumn();
            col2.ColumnName = "数量";
            dt.Columns.Add(col2);
            DataColumn col3 = new DataColumn();
            col3.ColumnName = "bili";
            dt.Columns.Add(col3);
            DataColumn col4 = new DataColumn();
            col4.ColumnName = "小计";
            dt.Columns.Add(col4);
            DataColumn col5 = new DataColumn();
            col5.ColumnName = "biliAll";
            dt.Columns.Add(col5);
            //1 先获取隐患表中所有的隐患类型
            sqlStr = string.Format("SELECT DISTINCT ev.EventTypeId,evt.EventTypeName FROM dbo.M_Event AS ev LEFT JOIN dbo.M_EventType as evt ON ev.EventTypeId=evt.EventTypeId where ev.DeleteStatus=0 and ev.EventFromId=3 and ev.UpTime >= '{0}' and ev.UpTime <= '{1}' ORDER BY ev.EventTypeId", startTime, endTime);
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                try
                {
                    DataTable dt_type = new DataTable();
                    dt_type.Load(conn.ExecuteReader(sqlStr));

                    foreach (DataRow dr in dt_type.Rows)
                    {
                        var typeId = dr["EventTypeId"];//获取类别编号
                        var typeName = dr["EventTypeName"];//获取类别名称,先根据类别查询类别下的隐患名称 

                        sqlStr = string.Format(" SELECT  DISTINCT e.EventTypeId2,t.EventTypeName FROM dbo.M_Event AS e  LEFT JOIN dbo.M_EventFrom as c ON e.EventFromId=c.EventFromId  LEFT JOIN dbo.M_EventType as t ON e.EventTypeId2=t.EventTypeId WHERE e.DeleteStatus=0 and  c.EventFromId=3 and e.EventTypeId={0} AND e.UpTime >= '{1}' and e.UpTime <= '{2}' ORDER BY e.EventTypeId2", typeId, startTime, endTime);
                        DataTable dt_hdName = new DataTable();
                        dt_hdName.Load(conn.ExecuteReader(sqlStr)); //此类别下所有隐患去重复后的表数据，目的循环此表，加载到dt中
                        foreach (DataRow drName in dt_hdName.Rows)
                        {
                            //获取此类别在时间段内个数
                            sqlStr = string.Format("select COUNT(*) sumNum from M_Event where DeleteStatus=0 and EventFromId=3 and EventTypeId={0} and UpTime>='{1}' and UpTime<='{2}'", typeId, startTime, endTime);
                            DataTable dt_sumType = new DataTable();
                            dt_sumType.Load(conn.ExecuteReader(sqlStr)); //此类别下时间段内隐患名称出现的个数
                            int numCate = int.Parse(dt_sumType.Rows[0]["sumNum"].ToString());

                            DataRow dr_row = dt.NewRow();
                            dr_row["事件类型名称"] = typeName;
                            dr_row["事件内容"] = drName["EventTypeName"];

                            sqlStr = string.Format("select COUNT(*) sumNum from M_Event where DeleteStatus=0 and EventFromId=3 and EventTypeId2 ={0} and UpTime>='{1}' and UpTime<='{2}' and EventTypeId={3}", drName["EventTypeId2"], startTime, endTime, typeId);
                            DataTable dt_sumNameType = new DataTable();
                            dt_sumNameType.Load(conn.ExecuteReader(sqlStr)); //此类别下时间段内隐患名称出现的个数
                            int numName = int.Parse(dt_sumNameType.Rows[0]["sumNum"].ToString());
                            dr_row["数量"] = numName;
                            float typeNameFloat = (float)(numName) / numCate * 100;
                            dr_row["bili"] = Math.Round(typeNameFloat, 1) + "%";//某一隐患占该类别所有隐患的百分比
                            dr_row["小计"] = numCate;
                            //获取所有类别在时间段内的个数
                            sqlStr = string.Format("select COUNT(*) sumNum from M_Event where DeleteStatus=0 and EventFromId=3 and UpTime>='{0}' and UpTime<='{1}'", startTime, endTime);
                            DataTable dt_sum = new DataTable();
                            dt_sum.Load(conn.ExecuteReader(sqlStr));//此类别下时间段内隐患名称出现的个数
                            int numAll = int.Parse(dt_sum.Rows[0]["sumNum"].ToString());
                            float biliAllFloat = (float)(numCate) / numAll * 100;
                            dr_row["biliAll"] = Math.Round(biliAllFloat, 1) + "%";//某一类别占所有类别的百分比
                            dt.Rows.Add(dr_row);

                        }
                    }
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }
            }
            return MessageEntityTool.GetMessage(dt.Rows.Count, dt);
        }

        public MessageEntity GetPieChart(DateTime startTime, DateTime endTime)
        {
            string queryStr = $@"SELECT EventTypeName,COUNT(0)AS num FROM  dbo.M_Event AS e LEFT JOIN dbo.M_EventType AS t ON e.EventTypeId=t.EventTypeId   WHERE e.UpTime >='{startTime}' and e.UpTime <='{endTime}' and DeleteStatus=0 and EventFromId=3  GROUP BY t.EventTypeName";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    List<dynamic> eventType = conn.Query<dynamic>(queryStr).ToList();

                    return MessageEntityTool.GetMessage(eventType.Count(), eventType);
                }
            }
            catch (Exception e)
            {
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
        }
    }
}

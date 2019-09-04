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
    public class EventTypeTrendStatisticsDAL : IEventTypeTrendStatisticsDAL
    {
        public MessageEntity GetLineChart(string[] monthArry, string yearStr, string startMStr, string endMStr)
        {
            var sTime = yearStr + "-" + ChangeStr(startMStr) + "-" + "01";
            var eTime = yearStr + "-" + ChangeStr((Convert.ToInt32(endMStr) + 1).ToString()) + "-" + "01";
            if ((Convert.ToInt32(endMStr) + 1).ToString() == "13")
                eTime = (Convert.ToInt32(yearStr) + 1).ToString() + "-01-01";
            string sqlstr = string.Format(@"SELECT SUM(1) [Count],
       et.EventTypeName,datepart(mm,e.UpTime) [Month]
FROM M_Event e
    LEFT JOIN M_EventType et
        ON e.EventTypeId = et.EventTypeId
WHERE e.DeleteStatus = 0
      AND EventFromId = 3
      AND UpTime >= '{0}'
      AND UpTime < '{1}'
	  GROUP BY  et.EventTypeName,datepart(mm,e.UpTime)", sTime, eTime);
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                try
                {
                    DataTable dt_type = new DataTable();
                    dt_type.Load(conn.ExecuteReader(sqlstr));
                    return MessageEntityTool.GetMessage(dt_type.Rows.Count, dt_type);
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }
            }
        }

        public MessageEntity GetTable(string[] monthArry, string yearStr, string startMStr, string endMStr)
        {

            var startTime = yearStr + "-" + ChangeStr(startMStr) + "-" + "01";
            string singleSTime = yearStr + "-" + ChangeStr(startMStr);//例如：2015-11
            var endTime = yearStr + "-" + ChangeStr((Convert.ToInt32(endMStr) + 1).ToString()) + "-" + "01";
            if ((Convert.ToInt32(endMStr) + 1).ToString() == "13")
            {
                endTime = (Convert.ToInt32(yearStr) + 1).ToString() + "-01-01";
            }
            string singetETime = yearStr + "-" + ChangeStr(endMStr);//例如：2015-12
            //string[] monthArry = months;
            DataTable dt = new DataTable();
            DataColumn col = new DataColumn();
            col.ColumnName = "事件类型";
            dt.Columns.Add(col);
            DataColumn coll = new DataColumn();
            coll.ColumnName = "类型";
            dt.Columns.Add(coll);
            DataColumn colll = new DataColumn();
            colll.ColumnName = "小计";
            dt.Columns.Add(colll);
            for (int i = 0; i < monthArry.Length; i++)
            {
                dt.Columns.Add(new DataColumn(monthArry[i]));
            }
            //所有月份所欲事件总计

            //1 先获取事件表中所有的事件类型
            var sqlStr = string.Format("select e.EventTypeId,et.EventTypeName,count(e.EventTypeId) XiaoJi from M_Event e left join M_EventType et on e.EventTypeId=et.EventTypeId WHERE e.DeleteStatus=0 and e.EventFromId=3 and UpTime>='{0}' AND UpTime<'{1}'  GROUP BY e.EventTypeId,et.EventTypeName", startTime, endTime);
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                try
                {
                    DataTable dt_type = new DataTable();
                    dt_type.Load(conn.ExecuteReader(sqlStr));

                    foreach (DataRow dr_type in dt_type.Rows)
                    {
                        //获取时间段内所有事件记录的数量
                        sqlStr = string.Format("select count(e.EventTypeId) XiaoJi from M_Event e left join M_EventType et on e.EventTypeId=et.EventTypeId WHERE e.DeleteStatus=0 and e.EventFromId=3 and UpTime>='{0}' AND UpTime<'{1}'  ", startTime, endTime);
                        DataTable dtAll = new DataTable();
                        dtAll.Load(conn.ExecuteReader(sqlStr));
                        int allCount = int.Parse(dtAll.Rows[0]["XiaoJi"].ToString());
                        //数量
                        DataRow dr = dt.NewRow();
                        dr["事件类型"] = dr_type["EventTypeName"];
                        dr["类型"] = "数量";
                        //比例
                        DataRow dr_bili = dt.NewRow();
                        dr_bili["事件类型"] = dr_type["EventTypeName"];
                        dr_bili["类型"] = "比例";

                        int typeCount = 0;//此事件类型小计    
                        int typeTimeCount = 0;//总数
                                              //2 循环所有月份  获取对应月份 对应类型 在表中的数量
                        for (int j = 0; j < monthArry.Length; j++)
                        {
                            typeTimeCount = 0;
                            string nowMonth = GetSelectTime(yearStr, monthArry[j]);
                            string nextMonth = "";
                            if (j == 11) { nextMonth = GetSelectTime((Convert.ToInt32(yearStr) + 1).ToString(), monthArry[0]); }
                            else
                            {
                                string month = (Convert.ToInt32(GetSelectTime(yearStr, monthArry[j]).Remove(0, 5)) + 1).ToString();
                                if (month == "13")
                                    nextMonth = int.Parse(yearStr) + 1 + "-0" + 1;
                                else
                                    nextMonth = yearStr + "-" + month;
                            }
                            string startSelectTime = nowMonth + "-01";
                            string endSelectTime = nextMonth + "-01";
                            sqlStr = string.Format("select COUNT(EventTypeId) singleMonthNum from M_Event WHERE DeleteStatus=0 and EventFromId=3 and UpTime>='{0}' AND  UpTime<'{1}' and EventTypeId={2} ", startSelectTime, endSelectTime, dr_type["EventTypeId"]);

                            DataTable dt_singleMonth = new DataTable();
                            dt_singleMonth.Load(conn.ExecuteReader(sqlStr));
                            string singleMonthNum = "0";
                            if (dt_singleMonth.Rows.Count > 0)
                            {
                                singleMonthNum = dt_singleMonth.Rows[0]["singleMonthNum"].ToString();
                            }
                            singleMonthNum = singleMonthNum == "0" ? "" : dt_singleMonth.Rows[0]["singleMonthNum"].ToString();
                            dr[monthArry[j]] = singleMonthNum;
                            if (dt_singleMonth.Rows.Count > 0)
                            {
                                typeCount += int.Parse(dt_singleMonth.Rows[0]["singleMonthNum"].ToString());
                            }
                            else { typeCount = 0; }
                            //获取对应月份所有类型的总和
                            sqlStr = string.Format("select count(*) typeTimeNum from M_Event where DeleteStatus=0 and EventFromId=3 and UpTime>='{0}' and UpTime<'{1}'  ", startSelectTime, endSelectTime);

                            DataTable dtTypeTime = new DataTable();
                            dtTypeTime.Load(conn.ExecuteReader(sqlStr));
                            //分母不正确
                            //
                            //
                            if (dtTypeTime.Rows.Count > 0)
                                typeTimeCount += int.Parse(dtTypeTime.Rows[0]["typeTimeNum"].ToString());

                            float typeTimeFloat = 0;
                            if (dt_singleMonth.Rows.Count > 0)
                            {
                                typeTimeFloat = (float)(int.Parse(dt_singleMonth.Rows[0]["singleMonthNum"].ToString())) / typeTimeCount * 100;

                                if (int.Parse(dt_singleMonth.Rows[0]["singleMonthNum"].ToString()) != 0)
                                {
                                    dr_bili[monthArry[j]] = Math.Round(typeTimeFloat, 1) + "%";//当前类型月份查询结果 和 当前月份查询结果 之比
                                }
                                else
                                {
                                    dr_bili[monthArry[j]] = "";
                                }
                            }
                            else
                            {
                                dr_bili[monthArry[j]] = "";
                            }

                        }
                        string typeCountStr = typeCount == 0 ? "" : typeCount.ToString();
                        dr["小计"] = typeCountStr;
                        dt.Rows.Add(dr);
                        float jieguo = (float)typeCount / allCount * 100;
                        dr_bili["小计"] = jieguo == 0 ? "" : Math.Round(jieguo, 1) + "%";
                        dt.Rows.Add(dr_bili);
                    }
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }
            }

            return MessageEntityTool.GetMessage(dt.Rows.Count, dt);
        }


        private string GetSelectTime(string yearStr, string monthStr)
        {
            string monthNum = "";
            switch (monthStr)
            {
                case "1月":
                    monthNum = "01";
                    break;
                case "2月":
                    monthNum = "02";
                    break;
                case "3月":
                    monthNum = "03";
                    break;
                case "4月":
                    monthNum = "04";
                    break;
                case "5月":
                    monthNum = "05";
                    break;
                case "6月":
                    monthNum = "06";
                    break;
                case "7月":
                    monthNum = "07";
                    break;
                case "8月":
                    monthNum = "08";
                    break;
                case "9月":
                    monthNum = "09";
                    break;
                case "10月":
                    monthNum = "10";
                    break;
                case "11月":
                    monthNum = "11";
                    break;
                case "12月":
                    monthNum = "12";
                    break;
                default:
                    break;
            }
            return yearStr + "-" + monthNum;
        }
        //一位变两位
        private string ChangeStr(string s)
        {
            if (s.Length == 1)
            {
                s = "0" + s;
            }
            return s;
        }
    }
}

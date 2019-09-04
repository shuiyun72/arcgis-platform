using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
using GisPlateform.IDAL.InspectionStatistics;
using GisPlateform.Model.BaseEntity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GisPlateform.IDAL.MainTainStatistics;
using System.Data;
namespace GisPlateformV1_0.Controllers.ApiControllers.MainTain.Statistics
{
    /// <summary>
    /// 维系养护统计分析
    /// </summary>
    [WebApiFilterAttribute]
    public class MainTainStatisticsController : ApiController
    {
        private readonly IMainTainStatisticsDAL _mainTainStatisticsDAL;
        public MainTainStatisticsController(IMainTainStatisticsDAL mainTainStatisticsDAL)
        {
            _mainTainStatisticsDAL = mainTainStatisticsDAL;
        }
        /// <summary>
        ///按照上报人员统计上报事件数
        /// </summary>
        /// <param name="startTime">开始事件</param>
        /// <param name="endTime">结束事件</param>
        /// <param name="sort">排序字段默认PersonName</param>
        /// <param name="ordering">desc/asc</param>
        /// <param name="num">默认20</param>
        /// <param name="page">默认1</param>
        /// <returns></returns>
        public MessageEntity Get(DateTime? startTime = null, DateTime? endTime = null, string sort = "PersonName", string ordering = "desc", int num = 20, int page = 1)
        {
            return _mainTainStatisticsDAL.Get(startTime,endTime, sort, ordering, num, page);
        }
        /// <summary>
        ///按照事件来源统计上报数量(柱状图)
        /// </summary>
        /// <param name="startTime">开始事件</param>
        /// <param name="endTime">结束事件</param>
        /// <returns></returns>
        public MessageEntity EChatEventFromStatistics(DateTime? startTime = null, DateTime? endTime = null)
        {
            return _mainTainStatisticsDAL.EChatEventFromStatistics(startTime, endTime);
        }
        /// <summary>
        ///按照时间统计事件来源统计上报数量(折线图)
        /// </summary>
        /// <param name="startTime">开始事件</param>
        /// <param name="endTime">结束事件</param>
        /// <returns></returns>
        public MessageEntity EChatLineEventFromStatistics(DateTime? startTime = null, DateTime? endTime = null)
        {
            string EChatX = "";
            string Distinct = "";//折线图类型组，字符串
            //1.按照事件和事件来源统计数量
            DataTable eventFromdt = _mainTainStatisticsDAL.EventFromStatisticsbyDate(startTime, endTime);
            //2.查询唯一时间（事件上报时间）
            DataTable DtDatedt = _mainTainStatisticsDAL.DtDateByEventfromStatistics(startTime, endTime);
            //3.查找折线图类型(事件来源名称)
            DataTable EventFromNamedt = _mainTainStatisticsDAL.EventFromNameStatistics(startTime, endTime);
            List<dynamic> seriesList = new List<dynamic>();
            //遍历时间类别,电话上报,巡检上报等
            for (int i = 0; i < EventFromNamedt.Rows.Count; i++)
            {
                List<double> EChatValue = new List<double>();
                Distinct += EventFromNamedt.Rows[i]["EventFromName"].ToString();
                if (i != EventFromNamedt.Rows.Count - 1)
                {
                    Distinct += ",";
                }
                //使用唯一时间进行遍历查询
                for (int j = 0; j < DtDatedt.Rows.Count; j++)
                {
                    DataRow[] drEventInfoByDate = eventFromdt.Select(" EventFromName =  '" + EventFromNamedt.Rows[i]["EventFromName"].ToString() + "' and  LineDate = '" + DtDatedt.Rows[j]["LineDate"] + "'");
                    if (drEventInfoByDate.Length > 0)
                    {
                        EChatValue.Add(Convert.ToDouble(drEventInfoByDate[0]["CCount"]));
                    }
                    else
                    { EChatValue.Add(0); }
                }
                //series += "  {   name: '" + DistinctDT.Rows[i]["PersonName"].ToString() + "',   type: 'line',   data: [" + EChatValue + "],     },|";
                EchartSeries s = new EchartSeries();
                s.name = EventFromNamedt.Rows[i]["EventFromName"].ToString();
                s.type = "line";
                s.data = EChatValue;
                seriesList.Add(s);
            }
            //获取X轴坐标
            for (int x = 0; x < DtDatedt.Rows.Count; x++)
            {
                EChatX += DtDatedt.Rows[x]["LineDate"].ToString();
                if (x != DtDatedt.Rows.Count - 1)
                {
                    EChatX += ",";
                }
            }
                var returnJson = new { p1 = EChatX, p2 = Distinct, p3 = seriesList };
            return MessageEntityTool.GetMessage(1, returnJson);
        }
    }
}

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

namespace GisPlateformV1_0.Controllers.ApiControllers.PipeInspection.Statistics
{
    /// <summary>
    /// 巡检统计分析
    /// </summary>
    [WebApiFilterAttribute]
    public class InspectionStatisticsController : ApiController
    {
        private readonly IEventTypeStatisticsDAL _eventTypeStatisticsDAL;
        private readonly IUserReportStatisticsDAL _userReportStatisticsDAL;
        private readonly IEventTypeTrendStatisticsDAL _eventTypeTrendStatisticsDAL;
        public InspectionStatisticsController(IEventTypeStatisticsDAL eventTypeStatisticsDAL, IUserReportStatisticsDAL userReportStatisticsDAL, IEventTypeTrendStatisticsDAL eventTypeTrendStatisticsDAL)
        {
            _eventTypeStatisticsDAL = eventTypeStatisticsDAL;
            _eventTypeTrendStatisticsDAL = eventTypeTrendStatisticsDAL;
            _userReportStatisticsDAL = userReportStatisticsDAL;
        }

        /// <summary>
        /// 事件类型分析--table 
        /// </summary>
        /// <param name="startTime">yyyy-MM-dd(必填)</param>
        /// <param name="endTime">yyyy-MM-dd(必填)</param>
        /// <returns></returns>
        public MessageEntity GetEventTypeTable(DateTime? startTime = null, DateTime? endTime = null)
        {
            if (startTime == null || endTime == null || startTime.Value >= endTime.Value)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            endTime = endTime.Value.AddDays(1).AddSeconds(-1);

            return _eventTypeStatisticsDAL.GetTable(startTime.Value, endTime.Value);
        }

        /// <summary>
        /// 事件类型分析--pieChart
        /// </summary>
        /// <param name="startTime">yyyy-MM-dd(必填)</param>
        /// <param name="endTime">yyyy-MM-dd(必填)</param>
        /// <returns></returns>
        public MessageEntity GetEventTypePieChart(DateTime? startTime = null, DateTime? endTime = null)
        {
            if (startTime == null || endTime == null || startTime.Value > endTime.Value)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            endTime = endTime.Value.AddDays(1).AddSeconds(-1);

            return _eventTypeStatisticsDAL.GetPieChart(startTime.Value, endTime.Value);
        }

        /// <summary>
        /// 事件人员上报分析-table/pieChart/lineChart(startTime/endTime都不填的话 则统计所有时间段内事件)
        /// </summary>
        /// <param name="startTime">yyyy-MM-dd</param>
        /// <param name="endTime">yyyy-MM-dd</param>
        /// <returns></returns>
        public MessageEntity GetUserReportTable(DateTime? startTime = null, DateTime? endTime = null)
        {
            if ((startTime == null && endTime == null) || (startTime != null && endTime != null && startTime.Value <= endTime.Value))
            {
                if (endTime != null)
                    endTime = endTime.Value.AddDays(1).AddSeconds(-1);

                return _userReportStatisticsDAL.GetTable(startTime, endTime);
            }
            else
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
        }
        /// <summary>
        /// 事件类型趋势分析--Table
        /// </summary>
        /// <param name="year">年</param>
        /// <param name="startMonth">开始月</param>
        /// <param name="endMonth">结束月</param>
        /// <returns></returns>
        public MessageEntity GetEventTypeTrendTable(int year, int startMonth, int endMonth)
        {
            var monthArry = GetMonthArry(startMonth, endMonth);
            if (monthArry == null)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            var result = _eventTypeTrendStatisticsDAL.GetTable(monthArry, year.ToString(), startMonth.ToString(), endMonth.ToString());
            return result;

        }
        /// <summary>
        /// 事件类型趋势分析--LineChart
        /// </summary>
        /// <param name="year">年</param>
        /// <param name="startMonth">开始月</param>
        /// <param name="endMonth">结束月</param>
        /// <returns></returns>
        public MessageEntity GetEventTypeTrendLineChart(int year, int startMonth, int endMonth)
        {
            var monthArry = GetMonthArry(startMonth, endMonth);
            if (monthArry == null)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            var result = _eventTypeTrendStatisticsDAL.GetLineChart(monthArry, year.ToString(), startMonth.ToString(), endMonth.ToString());
            return result;

        }
        
        private string[] GetMonthArry(int startMonth, int endMonth)
        {
            if (endMonth < startMonth)
                return null;
            if (endMonth == startMonth)
                return new string[] { startMonth + "月" };
            List<string> monthList = new List<string>();
            for (int i = startMonth; i <= endMonth; i++)
            {
                monthList.Add(i + "月");
            }
            return monthList.ToArray();
        }

    }
}
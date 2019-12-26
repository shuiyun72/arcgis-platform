using System;
using System.Collections.Generic;
using System.Text;

namespace GisPlateform.CommonTools
{
    public class CalculateCycle
    {
        /// <summary>
        /// Calculates the main method.
        /// </summary>
        /// <param name="StartDay">开始时间</param>
        /// <param name="EndDay">结束时间</param>
        /// <param name="KeepDay">持续时长</param>
        /// <param name="frequency">频率</param>
        /// <param name="CycleType">周期单位格式:日 月 周 季 年</param>
        /// <param name="StartStopInfo">开始结束星期格式:1|2</param>
        /// <returns>List&lt;Dictionary&lt;System.String, System.String&gt;&gt;.</returns>
        public List<Dictionary<string, string>> CalculateMainMethod(DateTime StartDay, DateTime EndDay, int KeepDay, int frequency, string CycleType, string StartStopInfo)
        {
            List<Dictionary<string, string>> Result = new List<Dictionary<string, string>>();
            switch (CycleType)
            {
                case "日":
                    Result = CalculateCycleByDay(StartDay, EndDay, KeepDay, frequency);
                    break;
                case "周":
                    Result = CalculateCycleByWeek(StartDay, EndDay, KeepDay, frequency, StartStopInfo);
                    break;
                case "月":
                    Result = CalculateCycleByMonth(StartDay, EndDay, KeepDay, frequency, StartStopInfo);
                    break;
                case "季":
                    Result = CalculateCycleByQuarter(StartDay, EndDay, KeepDay, frequency, StartStopInfo);
                    break;
                case "年":
                    Result = CalculateCycleByYear(StartDay, EndDay, KeepDay, frequency, StartStopInfo);
                    break;
            }
            return Result;
        }
        ///
        /// <summary>
        /// 日周期计算,按照开始时间,结束时间,持续时长,频率计算时间范围内需要的次数信息
        /// </summary>
        /// <param name="StartDay">开始时间</param>
        /// <param name="EndDay">结束时间</param>
        /// <param name="KeepDay">持续时长</param>
        /// <param name="frequency">频率</param>
        /// <returns>List&lt;Dictionary&lt;System.String, System.String&gt;&gt;.</returns>
        public List<Dictionary<string, string>> CalculateCycleByDay(DateTime StartDay, DateTime EndDay, int KeepDay, int frequency)
        {
            //初始化返回的结果集
            List<Dictionary<string, string>> Result = new List<Dictionary<string, string>>();
            try
            {
                do
                {

                    //if(StartDay.DayOfWeek == DayOfWeek.Sunday || StartDay.DayOfWeek== DayOfWeek.Saturday)
                    //{
                    //    StartDay = StartDay.AddDays(KeepDay);
                    //}
                    //else
                    //{
                    //当频率大于1时 目前只支持一天两次算法  一日两次
                    if (frequency == 2)
                    {
                        //初始化dictionary键值对
                        Dictionary<string, string> dic = new Dictionary<string, string>();
                        dic.Add("StartDay", StartDay.ToString("yyyy-MM-dd") + " 00:00:00");
                        dic.Add("EndDay", StartDay.ToString("yyyy-MM-dd") + " 12:00:00");
                        Result.Add(dic);

                        Dictionary<string, string> dic2 = new Dictionary<string, string>();
                        dic2.Add("StartDay", StartDay.ToString("yyyy-MM-dd") + " 13:00:00");
                        dic2.Add("EndDay", StartDay.ToString("yyyy-MM-dd") + " 23:59:59");
                        Result.Add(dic2);
                        StartDay = StartDay.AddDays(KeepDay);
                    }
                    //n日一次
                    else
                    {
                        //初始化dictionary键值对
                        Dictionary<string, string> dic = new Dictionary<string, string>();
                        //2:添加开始时间键值对
                        dic.Add("StartDay", StartDay.ToString("yyyy-MM-dd") + " 00:00:00");
                        StartDay = StartDay.AddDays(KeepDay);
                        #region 算法一:   本月天数不够的时候,取剩余天数算法
                        //if (DateTime.Compare(StartDay, EndDay) <= 0)
                        //{
                        //    //添加结束时间键值对
                        //    dic.Add("EndDay", DateTime.Parse(StartDay.ToString("yyyy-MM-dd") + " 00:00:00").AddSeconds(-1).ToString());
                        //}
                        //else {
                        //    //添加结束时间键值对
                        //    dic.Add("EndDay", DateTime.Parse(EndDay.ToString("yyyy-MM-dd") + " 23:59:59").ToString());
                        //}
                        #endregion
                        #region  算法二:   本月天数不够的情况下,下月补齐
                        dic.Add("EndDay", DateTime.Parse(StartDay.ToString("yyyy-MM-dd") + " 00:00:00").AddSeconds(-1).ToString());
                        #endregion
                        //4:将dic添加到list中
                        Result.Add(dic);
                    }
                    //}


                } while (DateTime.Compare(StartDay, EndDay) <= 0);
                //返回结果集
                return Result;
            }
            catch
            {
                //返回结果集
                return Result;
            }
            finally
            {

            }
        }
        ///
        /// <summary>
        /// 周周期计算,按照开始时间,结束时间,持续时长,频率计算时间范围内需要的次数信息
        /// </summary>
        /// <param name="StartDay">开始时间</param>
        /// <param name="EndDay">结束时间</param>
        /// <param name="KeepDay">持续时长</param>
        /// <param name="frequency">频率</param>
        /// <param name="StartStopInfo">开始结束星期</param>
        /// <returns>List&lt;Dictionary&lt;System.String, System.String&gt;&gt;.</returns>
        public List<Dictionary<string, string>> CalculateCycleByWeek(DateTime StartDay, DateTime EndDay, int KeepDay, int frequency, string StartStopInfo)
        {
            //初始化返回的结果集
            List<Dictionary<string, string>> Result = new List<Dictionary<string, string>>();
            try
            {
                //第一步:获取到本月的第一个周的周一日期
                //1-1:获取本月第一天的日期
                string CurrentMonthFirstDay = System.DateTime.Now.ToString("yyyy-MM") + "-01" + " 00:00:00";
                //1-2:初始化本月的第一个星期一的日期,默认值为本月的第一天
                DateTime FirstWeekDate = DateTime.Parse(CurrentMonthFirstDay);
                //初始化周最后一天的日期,可以进行多次复用
                DateTime CurrentWeekEndDate;
                //获取当前系统时间
                DateTime CurrentDate =StartDay;
                //1-3:获取到本月的第一天是星期几
                int DayOfWeek = int.Parse(DateTime.Parse(CurrentMonthFirstDay).DayOfWeek.ToString("d"));
                //1-4:找到本月第一天的日期
                //当为0时是周末
                if (DayOfWeek == 0)
                {
                    FirstWeekDate = DateTime.Parse(CurrentMonthFirstDay).AddDays(1);
                }
                //当为1时就是星期一
                else if (DayOfWeek == 1)
                {
                    FirstWeekDate = DateTime.Parse(CurrentMonthFirstDay);
                }
                //当为2,3,4,5,6时需要向前推进到下周
                else
                {
                    FirstWeekDate = DateTime.Parse(CurrentMonthFirstDay).AddDays(8 - DayOfWeek);
                }
                //1-5:获取开始星期/结束星期
                string[] StartStopWeek = new string[] { };
                //1-6:判断开始星期结束星期是否为空
                if (!string.IsNullOrEmpty(StartStopInfo))
                {
                    StartStopWeek = StartStopInfo.Split('|');
                }
                //第二步:计算周期频率list
                //2-1:当未选择开始星期,结束星期时 直接进行计算周期
                if (StartStopWeek.Length == 0)
                {
                    //每个月直接按照四周进行计算
                    for (int i = 0; i < 4; i++)
                    {
                        //2-1-1:获取本周末的时间
                        CurrentWeekEndDate = FirstWeekDate.AddDays(6 + (i * 7));
                        //2-1-2:当本周结束时间早于当前系统时间是跳过不进行生成任务事件队列
                        if (DateTime.Compare(CurrentWeekEndDate, CurrentDate) < 0)
                        {
                            continue;
                        }
                        else
                        {
                            //2-1-3:初始化键值对dic
                            Dictionary<string, string> dic = new Dictionary<string, string>();
                            dic.Add("StartDay", FirstWeekDate.AddDays(i * 7).ToString("yyyy-MM-dd") + " 00:00:00");
                            dic.Add("EndDay", FirstWeekDate.AddDays(6 + (i * 7)).ToString("yyyy-MM-dd") + " 23:59:59");
                            Result.Add(dic);
                        }
                    }
                }
                //2-2:指定每周的指定天进行巡检
                else if (StartStopWeek.Length == 1)
                {
                    //获取到指定的星期几进行巡检
                    int PatroDay = int.Parse(StartStopWeek[0]);

                    //每个月直接按照四周进行计算
                    for (int i = 0; i < 4; i++)
                    {
                        //2-1-1:获取本周末的时间
                        CurrentWeekEndDate = FirstWeekDate.AddDays(6 + (i * 7));
                        DateTime CurrentPatroDate = FirstWeekDate.AddDays((PatroDay - 1) + (i * 7));
                        //2-1-2:当本周结束时间早于当前系统时间是跳过不进行生成任务事件队列
                        if (DateTime.Compare(CurrentWeekEndDate, CurrentDate) < 0 || DateTime.Compare(CurrentPatroDate, CurrentDate) < 0)
                        {
                            continue;
                        }
                        else
                        {
                            //2-1-3:初始化键值对dic
                            Dictionary<string, string> dic = new Dictionary<string, string>();
                            dic.Add("StartDay", CurrentPatroDate.ToString("yyyy-MM-dd") + " 00:00:00");
                            dic.Add("EndDay", CurrentPatroDate.ToString("yyyy-MM-dd") + " 23:59:59");
                            Result.Add(dic);
                        }
                    }
                }
                //2-3:指定每周范围进行巡检
                else if (StartStopWeek.Length == 2)
                {
                    //获取到指定范围开始星期
                    int PatroStartDay = int.Parse(StartStopWeek[0]);
                    int PatroEndDay = int.Parse(StartStopWeek[1]);


                    //每个月直接按照四周进行计算
                    for (int i = 0; i < 4; i++)
                    {
                        //2-1-1:获取本周末的时间
                        CurrentWeekEndDate = FirstWeekDate.AddDays(6 + (i * 7));
                        DateTime CurrentPatroDateStart = FirstWeekDate.AddDays((PatroStartDay - 1) + (i * 7));
                        DateTime CurrentPatroDateEnd = FirstWeekDate.AddDays((PatroEndDay - 1) + (i * 7));
                        //2-1-2:当本周结束时间早于当前系统时间是跳过不进行生成任务事件队列
                        if (DateTime.Compare(CurrentWeekEndDate, CurrentDate) < 0 || DateTime.Compare(CurrentPatroDateEnd, CurrentDate) < 0)
                        {
                            continue;
                        }
                        else
                        {
                            //2-1-3:初始化键值对dic
                            Dictionary<string, string> dic = new Dictionary<string, string>();
                            dic.Add("StartDay", CurrentPatroDateStart.ToString("yyyy-MM-dd") + " 00:00:00");
                            dic.Add("EndDay", CurrentPatroDateEnd.ToString("yyyy-MM-dd") + " 23:59:59");
                            Result.Add(dic);
                        }
                    }
                }
                //返回结果集
                return Result;
            }
            catch
            {
                //返回结果集
                return Result;
            }
            finally
            {

            }
        }

        /// <summary>
        ///季度周期计算,,按照开始时间,结束时间,持续时长,频率计算时间范围内需要的次数信息
        /// </summary>
        /// <param name="StartDay">开始时间</param>
        /// <param name="EndDay">结束时间</param>
        /// <param name="KeepDay">持续时长</param>
        /// <param name="frequency">频率</param>
        /// <param name="StartStopInfo">开始结束日期</param>
        /// <returns>List&lt;Dictionary&lt;System.String, System.String&gt;&gt;.</returns>
        public List<Dictionary<string, string>> CalculateCycleByQuarter(DateTime StartDay, DateTime EndDay, int KeepDay, int frequency, string StartStopInfo)
        {
            //初始化返回的结果集
            List<Dictionary<string, string>> Result = new List<Dictionary<string, string>>();
            try
            {
                //第一步:获取到本年的第一天
                //1-1:获取本年第一天的日期
                DateTime CurrentYearFirstDay = DateTime.Parse(System.DateTime.Now.ToString("yyyy") + "-01-01" + " 00:00:00");
                //1-2:获取当前系统时间
                DateTime CurrentDate =StartDay;
                //第二步:进行迭代计算周期计划
                for (int i = 0; i < 4; i++)
                {
                    //初始化该季度的开始时间
                    DateTime CurrentQuarterStartDate = CurrentYearFirstDay.AddMonths(3 * i);
                    //舒适化该季度的结束时间
                    DateTime CurrentQuarterEndDate = (CurrentYearFirstDay.AddMonths(3 + (3 * i))).AddDays(-1);
                    //当该季度的结束时间小于当前系统时间的时候该季度不生成任务
                    if (DateTime.Compare(CurrentQuarterEndDate, CurrentDate) < 0)
                    {
                        continue;
                    }
                    //2-1-3:初始化键值对dic
                    Dictionary<string, string> dic = new Dictionary<string, string>();
                    dic.Add("StartDay", CurrentQuarterStartDate.ToString("yyyy-MM-dd") + " 00:00:00");
                    dic.Add("EndDay", CurrentQuarterEndDate.ToString("yyyy-MM-dd") + " 23:59:59");
                    Result.Add(dic);
                }
                //返回结果集
                return Result;
            }
            catch
            {
                //返回结果集
                return Result;
            }
            finally
            {

            }
        }

        /// <summary>
        ///年度周期计算,,按照开始时间,结束时间,持续时长,频率计算时间范围内需要的次数信息
        /// </summary>
        /// <param name="StartDay">开始时间</param>
        /// <param name="EndDay">结束时间</param>
        /// <param name="KeepDay">持续时长</param>
        /// <param name="frequency">频率</param>
        /// <param name="StartStopInfo">开始结束日期</param>
        /// <returns>List&lt;Dictionary&lt;System.String, System.String&gt;&gt;.</returns>
        public List<Dictionary<string, string>> CalculateCycleByYear(DateTime StartDay, DateTime EndDay, int KeepDay, int frequency, string StartStopInfo)
        {
            //初始化返回的结果集
            List<Dictionary<string, string>> Result = new List<Dictionary<string, string>>();
            try
            {
                //第一步:获取到当前系统时间
                DateTime CurrentDate =StartDay;
                //1-1:年开始时间
                DateTime CurrentYearDateStart = CurrentDate;
                //1-2:年结束时间
                DateTime CurrentYearDateEnd = CurrentDate.AddYears(1).AddDays(-1);
                //2-1-3:初始化键值对dic
                Dictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add("StartDay", CurrentYearDateStart.ToString("yyyy-MM-dd") + " 00:00:00");
                dic.Add("EndDay", CurrentYearDateEnd.ToString("yyyy-MM-dd") + " 23:59:59");
                Result.Add(dic);

                //返回结果集
                return Result;
            }
            catch
            {
                //返回结果集
                return Result;
            }
            finally
            {

            }
        }
        /// <summary>
        ///月度周期计算,,按照开始时间,结束时间,持续时长,频率计算时间范围内需要的次数信息
        /// </summary>
        /// <param name="StartDay">开始时间</param>
        /// <param name="EndDay">结束时间</param>
        /// <param name="KeepDay">持续时长</param>
        /// <param name="frequency">频率</param>
        /// <param name="StartStopInfo">开始结束日期</param>
        /// <returns>List&lt;Dictionary&lt;System.String, System.String&gt;&gt;.</returns>
        public List<Dictionary<string, string>> CalculateCycleByMonth(DateTime StartDay, DateTime EndDay, int KeepDay, int frequency, string StartStopInfo)
        {
            //初始化返回的结果集
            List<Dictionary<string, string>> Result = new List<Dictionary<string, string>>();
            try
            {
                //第一步:获取到当前系统时间
                DateTime CurrentDate =StartDay;
                //第二步:获取本月第一天
                DateTime CurrentMonthFirstDay = DateTime.Parse(System.DateTime.Now.ToString("yyyy-MM") + "-01" + " 00:00:00");
                //第二步:获取本月最后一天
                DateTime CurrentMonthEndDay = DateTime.Parse(System.DateTime.Now.ToString("yyyy-MM") + "-01" + " 00:00:00").AddMonths(1).AddDays(-1);
                //一月一次算法
                if (frequency == 1)
                {
                    Dictionary<string, string> dic = new Dictionary<string, string>();
                    dic.Add("StartDay", CurrentMonthFirstDay.ToString("yyyy-MM-dd") + " 00:00:00");
                    dic.Add("EndDay", CurrentMonthEndDay.ToString("yyyy-MM-dd") + " 23:59:59");
                    Result.Add(dic);
                }
                //一月两次算法
                else if (frequency == 2)
                {
                    if (DateTime.Compare(CurrentMonthFirstDay.AddDays(14), CurrentDate) > 0)
                    {
                        Dictionary<string, string> dic = new Dictionary<string, string>();
                        dic.Add("StartDay", CurrentMonthFirstDay.ToString("yyyy-MM-dd") + " 00:00:00");
                        dic.Add("EndDay", CurrentMonthFirstDay.AddDays(14).ToString("yyyy-MM-dd") + " 23:59:59");
                        Result.Add(dic);
                    }
                    Dictionary<string, string> dic2 = new Dictionary<string, string>();
                    dic2.Add("StartDay", CurrentMonthFirstDay.AddDays(15).ToString("yyyy-MM-dd") + " 00:00:00");
                    dic2.Add("EndDay", CurrentMonthEndDay.ToString("yyyy-MM-dd") + " 23:59:59");
                    Result.Add(dic2);

                }
                //返回结果集
                return Result;
            }
            catch
            {
                //返回结果集
                return Result;
            }
            finally
            {

            }
        }
    }
}

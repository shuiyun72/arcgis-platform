using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
using GisPlateform.IDAL;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
namespace GisPlateformV1_0.Controllers.ApiControllers
{
    /// <summary>
    /// 考勤管理
    /// </summary>
    [WebApiFilterAttribute]
    public class AttendanceRecordController : ApiController
    {
        private readonly IAttendanceRecordDAL _attendanceRecordDAL;
        public AttendanceRecordController(IAttendanceRecordDAL attendanceRecordDAL)
        {
            _attendanceRecordDAL = attendanceRecordDAL;
        }



        /// <summary>
        ///  考勤管理列表
        /// </summary>
        /// <param name="startTime">yyyy-MM-dd(必填)</param>
        /// <param name="endTime">yyyy-MM-dd(必填)</param>
        /// <param name="deptId">部门id</param>
        /// <param name="iAdminID">登录人员id</param>
        /// <param name="sort">deptId</param>
        /// <param name="ordering">desc</param>
        /// <param name="num">50</param>
        /// <param name="page">1</param>
        /// <returns></returns>
        public MessageEntity Get(DateTime startTime, DateTime endTime, int? deptId = null,int ? iAdminID = null, string sort = "deptId", string ordering="desc", int num=50, int page=1)
        {
            endTime = endTime.AddDays(1).AddSeconds(-1);
            return _attendanceRecordDAL.Get(startTime, endTime, deptId, iAdminID, sort, ordering, num, page);
        }
        /// <summary>
        /// 考勤打卡
        /// </summary>
        /// <param name="Lwr_PersonId">用户id</param>
        /// <param name="Lwr_XY">经纬度</param>
        /// <param name="DeptId">部门id</param>
        /// <param name="Lwr_BeiZhu">备注</param>
        /// <returns></returns>
        public MessageEntity QianDao(string Lwr_PersonId, string Lwr_XY, int DeptId, string Lwr_BeiZhu="")
        {
            //初始化系统当前时间
            DateTime DatetimeNow = DateTime.Now;
            //初始化用户上传时间
            string Lwr_UpTime = DatetimeNow.ToString("yyyy-MM-dd HH:mm:ss");
            //初始化用户上传日期
            string Lwr_Date = DatetimeNow.ToString("yyyy-MM-dd");
            //初始化当天开始时间
            string DayStartTime = DatetimeNow.ToString("yyyy-MM-dd") + " 00:00:00";
            //初始化开始时间
            string Lwr_StartTime = DatetimeNow.ToString("HH:mm:ss");
            //初始化结束时间
            string Lwr_EndTime = DatetimeNow.ToString("HH:mm:ss");
            //初始化上班时间
            string Lwr_Hour = string.Empty;
            //初始化签到状态 上班签到  下班签退
            string Lwr_PersonStatus = string.Empty;
            DataTable dt=  _attendanceRecordDAL.GetQianDao(Lwr_PersonId, DayStartTime);
            //进行判断用户是签到还是签退
            if (dt!=null && dt.Rows.Count>0)
            {
                Lwr_PersonStatus = "用户下班";
                Lwr_StartTime = string.Empty;
            }
            else
            {
                Lwr_PersonStatus = "上班正常";
                Lwr_EndTime = string.Empty;
            }
            return _attendanceRecordDAL.QianDao(Lwr_PersonId, Lwr_XY, DeptId, Lwr_BeiZhu, Lwr_UpTime, Lwr_Date, Lwr_StartTime, Lwr_EndTime, Lwr_Hour, Lwr_PersonStatus);
        }

    }
}
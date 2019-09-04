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
        /// <param name="sort">deptId</param>
        /// <param name="ordering">desc</param>
        /// <param name="num">50</param>
        /// <param name="page">1</param>
        /// <returns></returns>
        public MessageEntity Get(DateTime startTime, DateTime endTime, int? deptId = null, string sort = "deptId", string ordering="desc", int num=50, int page=1)
        {
            endTime = endTime.AddDays(1).AddSeconds(-1);
            return _attendanceRecordDAL.Get(startTime, endTime, deptId, sort, ordering, num, page);
        }

    }
}
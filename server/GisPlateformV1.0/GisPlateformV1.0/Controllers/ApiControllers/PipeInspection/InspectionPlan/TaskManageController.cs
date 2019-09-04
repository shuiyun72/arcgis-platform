using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
using GisPlateform.IDAL.InspectionPlan;
using GisPlateform.Model.BaseEntity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GisPlateformV1_0.Controllers.ApiControllers.PipeInspection.InspectionPlan
{
    /// <summary>
    /// 巡检任务管理
    /// </summary>
    [RoutePrefix("api/InspectionPlan")]
    [WebApiFilterAttribute]
    public class TaskManageController : ApiController
    {
        private readonly ITaskManageDAL _taskManageDAL;
        public TaskManageController(ITaskManageDAL taskManageDAL)
        {
            _taskManageDAL = taskManageDAL;
        }
        /// <summary>
        /// 巡检计划管理查询
        /// </summary>
        /// <param name="isAssigned">派发状态 已派发:1 未派发:0 默认全部</param>
        /// <param name="serachCondition">计划名称 默认全部</param>
        /// <param name="isNomalPlan">类型 临时:0;常规:1;默认全部</param>
        /// <param name="iAdminID">巡检员id</param>
        /// <param name="startTime">yyyy-MM-dd</param>
        /// <param name="endTime">yyyy-MM-dd</param>
        /// <param name="sort">TaskId</param>
        /// <param name="ordering">desc</param>
        /// <param name="num">15</param>
        /// <param name="page">1</param>
        /// <returns></returns>
        [Route("TaskManage/GetPlanManageInfo")]
        public MessageEntity GetPlanManageInfo(int? isAssigned = null, string serachCondition = "", int? isNomalPlan = null, int? iAdminID = null, DateTime? startTime = null, DateTime? endTime = null, string sort = "TaskId", string ordering = "desc", int num = 15, int page = 1)
        {
            if ((startTime == null && endTime == null) || (startTime != null && endTime != null && startTime.Value <= endTime.Value))
            {
                if (endTime != null)
                    endTime = endTime.Value.AddDays(1).AddSeconds(-1);

                var messageEntity = _taskManageDAL.GetTaskManageInfo(serachCondition, isNomalPlan, isAssigned, null, iAdminID, startTime, endTime, sort, ordering, num, page);
                return messageEntity;
            }
            else
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }

        }
        /// <summary>
        /// 获取时间段内时间数量
        /// </summary>
        /// <param name="startTime"></param>
        /// <param name="endTime"></param>
        /// <returns></returns>
        public MessageEntity GetCount(DateTime startTime, DateTime endTime)
        {
            var messageEntity = _taskManageDAL.GetPlanListCount(startTime, endTime);

            return messageEntity;
        }



        /// <summary>
        /// 删除任务
        /// </summary>
        /// <param name="taskIds">任务id ','分割id</param>
        /// <returns></returns>
        [Route("TaskManage/Delete")]
        public MessageEntity Delete(string taskIds)
        {
            if (string.IsNullOrEmpty(taskIds))
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }

            return _taskManageDAL.Delete(taskIds.Split(','));
        }

        /// <summary>
        /// 分派任务
        /// </summary>
        /// <param name="taskIds">任务id ','分割id</param>
        /// <returns></returns>
        [Route("TaskManage/AssignTask")]
        [HttpPost]
        public MessageEntity AssignTask(string taskIds)
        {
            if (string.IsNullOrEmpty(taskIds))
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }

            return _taskManageDAL.AssignTask(taskIds.Split(','));
        }

    }
}
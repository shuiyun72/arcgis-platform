using GisPlateform.IDAL.InspectionPlan;
using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
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
    /// 巡检计划管理 需要获取token
    /// </summary>
    [WebApiFilterAttribute]
    [RoutePrefix("api/InspectionPlan")]
    public class PlanManageController : ApiController
    {
        private readonly IPlanManageDAL _planManageDAL;
        public PlanManageController(IPlanManageDAL planManageDAL)
        {
            _planManageDAL = planManageDAL;
        }

        /// <summary>
        /// 巡检计划管理查询
        /// </summary>
        /// <param name="planTypeId">路线巡检/区域巡检 默认全部</param>
        /// <param name="serachCondition">计划名称 默认全部</param>
        /// <param name="isNomalPlan">类型 临时:0;常规:1;默认全部</param>
        /// <param name="sort">PlanId</param>
        /// <param name="ordering">desc</param>
        /// <param name="num">15</param>
        /// <param name="page">1</param>
        /// <returns></returns>
        [Route("PlanManage/GetPlanManageInfo")]
        public MessageEntity GetPlanManageInfo(int? planTypeId = null, string serachCondition = "", int? isNomalPlan = null, string sort = "PlanId", string ordering = "desc", int num = 15, int page = 1)
        {
            var messageEntity = _planManageDAL.GetPlanManageInfo(planTypeId, serachCondition, isNomalPlan, null, null, null, null, sort, ordering, num, page);
            return messageEntity;
        }

        /// <summary>
        /// 巡检计划添加
        /// </summary>
        /// <param name="planName">计划名称</param>
        /// <param name="planTypeId">巡检类型</param>
        /// <param name="planTypeLB">计划类别</param>
        /// <param name="planCycleId">计划周期</param>
        /// <param name="isFeedBack">是否需要反馈 1反馈 0不反馈</param>
        /// <param name="isNomalPlan">1常规 0临时</param>
        /// <param name="moveType">1车寻 2步行</param>
        /// <param name="equipmentIdList">设备实体对应的id ','分割例如 1,3</param>
        /// <param name="equipmentNameList">设备实体对应的Name ','分割例如 阀门,消防栓</param>
        /// <param name="invalidationDate">不知道是啥</param>
        /// <param name="planAreaId">区域id</param>
        /// <param name="planLineId">路线id</param>
        /// <param name="planPath">后期添加的线路json</param>
        /// <param name="equmentInfo">后期添加的设备json</param>
        /// <returns></returns>
        [HttpPost]
        [Route("PlanManage/Post")]
        public MessageEntity Post(string planName, int planTypeId, int planTypeLB, int planCycleId, int isFeedBack, int isNomalPlan, int moveType, string equipmentIdList, string equipmentNameList,[FromBody] List<Equipment> equmentInfo , DateTime? invalidationDate, int? planAreaId = 0, int? planLineId = 0, string planPath = "" )
        {
            if (UserInfoCache.Authorize == null)
            {
                return MessageEntityTool.GetMessage(ErrorType.NotAvilebalToken);
            }

            if (string.IsNullOrEmpty(planName) || string.IsNullOrEmpty(equipmentIdList) || string.IsNullOrEmpty(equipmentNameList))
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            if (invalidationDate == null)
            {
                invalidationDate = DateTime.Now;
            }
            if (planTypeId == 1)
            {
                //区域巡检
                planLineId = 0;
            }
            else
            {
                //路线巡检
                planAreaId = 0;
            }
            //List<Equipment> equipmentList = new List<Equipment>();
            //if (!string.IsNullOrEmpty(equmentInfo))
            //{
            //    equipmentList = JsonConvert.DeserializeObject<List<Equipment>>("[" + equmentInfo + "]");
            //}
            var result = _planManageDAL.Add(planName, planTypeId, planTypeLB, equipmentIdList, planPath, planCycleId, isFeedBack, isNomalPlan, equipmentNameList, "", moveType, invalidationDate.Value, planAreaId.Value, planLineId.Value, UserInfoCache.Authorize.UserName, equmentInfo);
            return result;
        }

        /// <summary>
        /// 巡检计划编辑
        /// </summary>
        /// <param name="PlanId">id</param>
        /// <param name="planName">计划名称</param>
        /// <param name="isNomalPlan">1常规 0临时</param>
        /// <param name="moveType">1车寻 2步行</param>
        /// <returns></returns>
        [Route("PlanManage/Put")]
        public MessageEntity Put(int PlanId, string planName, int isNomalPlan, int moveType)
        {
            if (string.IsNullOrEmpty(planName))
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }

            var result = _planManageDAL.Update(new L_Plan() { PlanId = PlanId, PlanName = planName, BoolNormalPlan = isNomalPlan, MoveType = moveType });
            return result;
        }
        /// <summary>
        /// 巡检计划删除
        /// </summary>
        /// <param name="PlanId"></param>
        /// <returns></returns>
        [Route("PlanManage/Delete")]
        public MessageEntity Delete(int PlanId)
        {
            var result = _planManageDAL.Delete(PlanId);
            return result;
        }
        /// <summary>
        /// 计划分派
        /// </summary>
        /// <param name="taskName">任务名称</param>
        /// <param name="proraterDeptName">部门名称</param>
        /// <param name="proraterDeptId">部门Id</param>
        /// <param name="proraterName">分派人员</param>
        /// <param name="proraterId">分派人员Id</param>
        /// <param name="starTime">开始时间</param>
        /// <param name="endTime">结束时间</param>
        /// <param name="descript">备注</param>
        /// <param name="planId">计划Id</param>
        /// <param name="planName">计划名称</param>
        /// <returns></returns>
        [HttpPost]
        [Route("PlanManage/AssignTask")]
        public MessageEntity AssignTask(string taskName, string proraterDeptName, int proraterDeptId, string proraterName, int proraterId, DateTime starTime, DateTime endTime, string descript, int planId, string planName)
        {
            if (starTime == endTime) {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }

            L_Task task = new L_Task() {
                TaskName = taskName,
                ProraterDeptName = proraterDeptName,
                ProraterDeptId = proraterDeptId,
                ProraterName = proraterName,
                ProraterId = proraterId,
                VisitStarTime = starTime,
                VisitOverTime = endTime,
                Descript=descript,
                Operator= UserInfoCache.Authorize.UserName,
                OperateDate =DateTime.Now,
                PlanId=planId,
                PlanName= planName
            };
            return _planManageDAL.AssignTask(task);

        }

    }
}
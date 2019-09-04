using GisPlateform.IDAL;
using GisPlateform.IDAL.InspectionSettings;
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

namespace GisPlateformV1_0.Controllers.ApiControllers.InspectionSettings
{
    /// <summary>
    /// 计划类别 下面所有action的header必须要填 登陆获取Token先
    /// </summary>
    [WebApiFilterAttribute]
    public class PlanTypeController : BaseApiController
    {
        private readonly IPlanTypeDAL _planTypeDAL;
        public PlanTypeController(ICommonDAL commonDAL, IPlanTypeDAL planTypeDAL) : base(commonDAL)
        {
            _planTypeDAL = planTypeDAL;
        }

        /// <summary>
        /// 计划类别下拉框
        /// </summary>
        /// <returns></returns>
        public MessageEntity GetCommboboxList()
        {
            return _planTypeDAL.GetComboBoxList();
        }
        /// <summary>
        /// 查询计划类别
        /// </summary>
        /// <param name="planTypeId">PlanTypeId</param>
        /// <param name="sort">排序 默认PlanTypeId</param>
        /// <param name="ordering">asc/desc</param>
        /// <param name="num">每页显示行数</param>
        /// <param name="page">第几页</param>
        /// <returns></returns>
        public MessageEntity Get(int planTypeId, string sort, string ordering, int num, int page)
        {
            var messageEntity = _planTypeDAL.GetPlanTypByPlanTypeId(planTypeId, sort, ordering, num, page);
            return messageEntity;
        }

        /// <summary>
        /// 添加计划类别
        /// </summary>
        /// <param name="value">PlanTypeId/Operater/OperateDate不填  ParentTypeId计划类型  ParentTypeId不能为0</param>
        /// <returns></returns>
        public MessageEntity Post([FromBody]L_PlanType value)
        {
            if (UserInfoCache.Authorize == null)
            {
                return MessageEntityTool.GetMessage(ErrorType.NotAvilebalToken);
            }
            if (value.ParentTypeId == 0)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }

            value.Operater = int.Parse(UserInfoCache.Authorize.UserId);
            value.OperateDate = DateTime.Now;
            var messageEntity = _planTypeDAL.Add(value);
            return messageEntity;
        }

        /// <summary>
        /// 修改计划类别
        /// </summary>
        /// <param name="planTypeId">PlanTypeId</param>
        /// <param name="value">PlanTypeId/Operater/OperateDate不填  ParentTypeId计划类型  ParentTypeId不能为0</param>
        /// <returns></returns>
        public MessageEntity Put(int planTypeId, [FromBody]L_PlanType value)
        {
            if (value.ParentTypeId == 0)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            value.PlanTypeId = planTypeId;
            var messageEntity = _planTypeDAL.Update(value);
            return messageEntity;
        }

        /// <summary>
        /// 删除计划类别
        /// </summary>
        /// <param name="planTypeId">PlanTypeId</param>
        /// <returns></returns>
        public MessageEntity Delete(int planTypeId)
        {
            L_PlanType planType = new L_PlanType
            {
                PlanTypeId = planTypeId
            };
            var messageEntity = _planTypeDAL.Delete(planType);

            return messageEntity;
        }
    }
}
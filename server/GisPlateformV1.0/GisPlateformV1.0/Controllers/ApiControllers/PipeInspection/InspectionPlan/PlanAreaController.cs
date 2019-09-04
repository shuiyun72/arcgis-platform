using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
using GisPlateform.IDAL;
using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using Newtonsoft.Json;
using System;
using System.Web.Http;

namespace GisPlateformV1_0.Controllers
{
    /// <summary>
    /// 区域管理
    /// </summary>
    [WebApiFilterAttribute]
    public class PlanAreaController : BaseApiController
    {
        private readonly IPlanAreaDAL _planAreaDAL;

        /// <summary>
        /// 区域管理
        /// </summary>
        public PlanAreaController(IPlanAreaDAL planAre, ICommonDAL commonDAL) : base(commonDAL)
        {
            _planAreaDAL = planAre;
        }


        /// <summary>
        /// 获取区域
        /// </summary>
        /// <param name="sort">排序字段(默认PersonName)</param>
        /// <param name="ordering">asc/desc</param>
        /// <param name="num">默认50</param>
        /// <param name="page">默认1</param>
        /// <returns></returns>
        public MessageEntity Get(string sort= "PersonName", string ordering= "desc", int num = 50, int page = 1)
        {
            var messageEntity = _planAreaDAL.GetAllPlanAreaInfo(sort, ordering, num, page);

            return messageEntity;
        }

        /// <summary>
        /// 新增区域
        /// </summary>
        /// <param name="value">PlanAreaName:片区名称/GeoText:片区坐标/DeptId:部门Id/PersonId:人员PointId/AreaState:状态(不用传也行)</param>
        /// <returns></returns>
        public MessageEntity Post([FromBody]L_PlanArea value)
        {
            value.OperateAddTime = DateTime.Now;
            value.AreaState = 1;
            var messageEntity = _planAreaDAL.AddPlanArea(value);

            return messageEntity;
        }

        /// <summary>
        /// 根据PlanAreaId需要改区域
        /// </summary>
        /// <param name="PointId">PlanAreaId</param>
        /// <param name="value">PlanAreaName:片区名称/GeoText:片区坐标/DeptId:部门Id/PersonId:人员PointId/AreaState:状态(不用传也行)</param>
        /// <returns></returns>
        public MessageEntity Put(int PointId, [FromBody]L_PlanArea value)
        {

            if (string.IsNullOrEmpty(value.PlanAreaName))
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            value.PlanAreaId = PointId;
            var messageEntity = _planAreaDAL.UpdatePlanArea(value);

            return messageEntity;
        }

        /// <summary>
        /// 根据PlanAreaId删除区域
        /// </summary>
        /// <param name="PointId">PlanAreaId</param>
        /// <returns></returns>
        public MessageEntity Delete(int PointId)
        {
            L_PlanArea value = new L_PlanArea();
            value.PlanAreaId = PointId;
            var messageEntity = _planAreaDAL.DeletePlanArea(value);

            return messageEntity;
        }
    }
}
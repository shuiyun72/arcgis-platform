using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
using GisPlateform.IDAL.InspectionSettings;
using GisPlateform.Model.BaseEntity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GisPlateformV1_0.Controllers.ApiControllers.PipeInspection.InspectionSettings
{
    /// <summary>
    /// 计划周期
    /// </summary>
    [WebApiFilterAttribute]
    public class PlanCycleController : ApiController
    {
        private readonly IPlanCycleDAL _planCycleDAL;
        public PlanCycleController(IPlanCycleDAL planCycleDAL)
        {
            _planCycleDAL = planCycleDAL;
        }


        /// <summary>
        /// 获取计划周期数据下拉框
        /// </summary>
        /// <returns></returns>
        public MessageEntity GetCombobox()
        {
            var messageEntity = _planCycleDAL.GetComboBoxList();
            return messageEntity;
        }

       
    }
}
using GisPlateform.IDAL.InspectionSettings;
using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
namespace GisPlateformV1_0.Controllers.ApiControllers.PipeInspection.InspectionSettings
{
    /// <summary>
    /// 工作时段管理
    /// </summary>
    [WebApiFilterAttribute]
    public class WorkTimeIntervalController : ApiController
    {
        private readonly IWorkTimeIntervalDAL _workTimeInterval;
        public WorkTimeIntervalController(IWorkTimeIntervalDAL workTimeInterval)
        {
            _workTimeInterval = workTimeInterval;
        }
        /// <summary>
        /// 获取工作时段列表
        /// </summary>
        /// <param name="sort">IntervalId</param>
        /// <param name="ordering"></param>
        /// <param name="num"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        public MessageEntity Get(string sort = "IntervalId", string ordering = "desc", int num = 15, int page = 1)
        {
            var messageEntity = _workTimeInterval.Get(sort, ordering, num, page);
            return messageEntity;
        }

        /// <summary>
        /// 添加工作时段列表
        /// </summary>
        /// <param name="value">StartTime/EndTime不能为空 格式HH:mm:ss</param>
        public MessageEntity Post([FromBody]L_WorkTimeInterval value)
        {
            if (string.IsNullOrEmpty(value.StartTime) || string.IsNullOrEmpty(value.EndTime))
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            return _workTimeInterval.Add(value);
        }

        /// <summary>
        /// 修改工作时段列表
        /// </summary>
        /// <param name="intervalId">id</param>
        /// <param name="value">StartTime/EndTime不能为空 格式HH:mm:ss</param>
        public MessageEntity Put(int intervalId, [FromBody]L_WorkTimeInterval value)
        {
            if (string.IsNullOrEmpty(value.StartTime) || string.IsNullOrEmpty(value.EndTime))
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            value.IntervalId = intervalId;
            return _workTimeInterval.Update(value);
        }

        /// <summary>
        /// 删除工作时段列表
        /// </summary>
        /// <param name="intervalId">id</param>
        public MessageEntity Delete(int intervalId)
        {
            return _workTimeInterval.Delete(new L_WorkTimeInterval() { IntervalId = intervalId });
        }
    }
}
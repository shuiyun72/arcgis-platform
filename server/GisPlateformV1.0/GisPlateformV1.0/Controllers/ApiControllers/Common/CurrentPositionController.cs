using GisPlateform.IDAL;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GisPlateformV1_0.Controllers.ApiControllers.Common
{
    /// <summary>
    /// 用户手机app实时位置
    /// </summary>
    public class CurrentPositionController : ApiController
    {
        private readonly ICurrentPositonDAL _currentPositonDAL;
        public CurrentPositionController(ICurrentPositonDAL currentPositonDAL)
        {
            _currentPositonDAL = currentPositonDAL;
        }
        /// <summary>
        /// 巡检人员上报位置
        /// </summary>
        /// <param name="positionX">上报位置经度</param>
        /// <param name="positionY">上报位置纬度</param>
        /// <param name="upTime">位置上报事件</param>
        /// <param name="personId">位置上报人员</param>
        /// <param name="isOnline">是否在线0:不在线,1:在线</param>
        /// <returns></returns>
        public MessageEntity Post(string positionX, string positionY, DateTime upTime, int personId, int isOnline)
        {
            if (string.IsNullOrEmpty(positionX) || string.IsNullOrEmpty(positionY)|| isOnline>1)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }

            return _currentPositonDAL.Add(positionX, positionY, upTime.ToString(), personId, isOnline);
        }

    }
}
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
    /// 获取APP最新版本号
    /// </summary>
    public class APPVersionController : ApiController
    {
        private readonly ICellphoneManageDAL _cellphoneManageDAL;
        /// <summary>
        /// 
        /// </summary>
        /// <param name="CellphoneManageDAL"></param>
        public APPVersionController(ICellphoneManageDAL CellphoneManageDAL)
        {
            _cellphoneManageDAL = CellphoneManageDAL;
        }
        /// <summary>
        /// 获取最新版本号
        /// </summary>
        /// <returns></returns>
        public MessageEntity GetLatestVersionId()
        {
            return _cellphoneManageDAL.GetLatestVersionId();
        }
    }
}

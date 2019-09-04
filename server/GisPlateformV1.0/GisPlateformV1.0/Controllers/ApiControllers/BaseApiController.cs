using GisPlateform.IDAL;
using GisPlateform.Model;
using GisPlateformV1_0.App_Authorize;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace GisPlateformV1_0.Controllers
{
    public class BaseApiController: ApiController
    { /// <summary>
      /// 公共方法接口
      /// </summary>
        public readonly ICommonDAL CommonDAL;
        /// <summary>
        /// BaseController构造函数
        /// </summary>
        /// <param name="commonDAL"></param>
        public BaseApiController(ICommonDAL commonDAL)
        {
            CommonDAL = commonDAL;
        }

    }
}
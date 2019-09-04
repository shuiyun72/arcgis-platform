using GisPlateform.IDAL;
using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GisPlateformV1_0.Controllers
{
    public class FunctionController : ApiController
    {
        private readonly IP_FunPurviewDAL _p_FunPurviewDAL;
        /// <summary>
        /// 
        /// </summary>
        /// <param name="p_FunPurviewDAL"></param>
        public FunctionController(IP_FunPurviewDAL p_FunPurviewDAL)
        {
            _p_FunPurviewDAL = p_FunPurviewDAL;
        }
        /// <summary>
        /// 获取所有功能模块
        /// </summary>
        /// <returns></returns>
        public MessageEntity Get()
        {
            return _p_FunPurviewDAL.GetFunction();
        }

        /// <summary>
        /// 添加功能模块
        /// </summary>
        /// <param name="eventType"> string EventTypeName 事件名称
        /// <returns></returns>
        // POST api/<controller>
        public MessageEntity Post([FromBody]P_Function function)
        {
            if (function.FunctionType != 4)
            {
                if (string.IsNullOrEmpty(function.cFunName))
                {
                    return MessageEntityTool.GetMessage(ErrorType.FieldError, "非C/S端 模块URL不能为空");
                }
            }
            return _p_FunPurviewDAL.PostFunction(function);
        }

        /// <summary>
        /// 修改功能模块
        /// </summary>
        /// <param name="function"></param>
        /// <returns></returns>
        public MessageEntity Put([FromBody]P_Function function)
        {
            if (function.FunctionType != 4)
            {
                if (string.IsNullOrEmpty(function.cFunName))
                {
                    return MessageEntityTool.GetMessage(ErrorType.FieldError, "非C/S端 模块URL不能为空");
                }
            }
            if (_p_FunPurviewDAL.UpdateFunction(function, out string errorMsg))
            {
                return MessageEntityTool.GetMessage(1);
            }
            else
            {
                return MessageEntityTool.GetMessage(ErrorType.SqlError, errorMsg);
            }
        }
        /// <summary>
        /// 删除功能模块
        /// </summary>
        /// <param name="iFunId">功能模块id</param>
        public MessageEntity Delete(int iFunId)
        {
            return _p_FunPurviewDAL.DeleteFunction(iFunId);
        }
    }
}
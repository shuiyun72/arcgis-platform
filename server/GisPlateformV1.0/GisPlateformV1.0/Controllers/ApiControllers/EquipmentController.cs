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
using System.Text.RegularExpressions;
using System.Web.Http;

namespace GisPlateformV1_0.Controllers
{
    /// <summary>
    /// 设备实体
    /// </summary>
    [WebApiFilterAttribute]
    public class EquipmentController : ApiController
    {
        private readonly IEquipmentDAL _equipmentDAL;
        public EquipmentController(IEquipmentDAL equipmentDAL)
        {
            _equipmentDAL = equipmentDAL;
        }


        /// <summary>
        /// 获取设备实体数据下拉框
        /// </summary>
        /// <returns></returns>
        public MessageEntity GetCombobox()
        {
            var messageEntity = _equipmentDAL.GetComboBoxList();
            return messageEntity;
        }
        /// <summary>
        /// 根据图层和设备编号获取设备信息
        /// </summary>
        /// <param name="layerId"></param>
        /// <param name="objecketId">设备编号</param>
        /// <returns></returns>
        public MessageEntity Get(string layerId,string objecketId) {
            if(string.IsNullOrEmpty(layerId)|| string.IsNullOrEmpty(objecketId))
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            //特殊字符过滤 要单独增加通用功能 sunqi 07292019
            layerId = this.FilteSQLStr(layerId);
            objecketId = this.FilteSQLStr(objecketId);
            var messageEntity = _equipmentDAL.GetByLayerNid(layerId, objecketId);
            return messageEntity;
        }
        /// <summary>
        /// 特殊字符过滤 要单独增加通用功能 sunqi 07292019
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        private string FilteSQLStr(string str)
        {

            str = str.Replace("'", "");
            str = str.Replace("\"", "");
            str = str.Replace("&", "");
            str = str.Replace("|", "");
            str = str.Replace("*", "");
            str = str.Replace("<", "");
            str = str.Replace(">", "");
            str = str.Replace("(", "");
            str = str.Replace(")", "");
            str = str.Replace("delete", "");
            str = str.Replace("update", "");
            str = str.Replace("insert", "");

            return str;
        }
    }
}
using GisPlateform.Model.AttributePack;
using System;
using System.Runtime.Serialization;
using System.Collections.Generic;
namespace GisPlateform.Model.PipeInspectionBase_Gis_OutSide
{
    //维修养护事件来源折线图
    [Serializable]
    [DataContract]
    public class EchartSeries
    {
        /// <summary>
        /// 事件来源名称
        /// </summary>		
        [DataMember]
        public string name
        {
            set; get;
        }
        /// <summary>
        /// echart类型（折线  柱状图)
        /// </summary>		
        [DataMember]
        public string type
        {
            set; get;
        }
        /// <summary>
        /// 时间数据
        /// </summary>		
        [DataMember]
        public List<double> data
        {
            set; get;
        }
    }
}

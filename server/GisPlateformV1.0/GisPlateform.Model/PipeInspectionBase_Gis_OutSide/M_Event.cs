using System;
using System.Text;
using System.Collections.Generic;
using System.Data;
using GisPlateform.Model.AttributePack;

namespace GisPlateform.Model.PipeInspectionBase_Gis_OutSide
{
    [Serializable]
    //事件信息表，包括巡检上报，热线上报，电话手工录入
    public class M_Event
    {

        /// <summary>
        /// 事件ID
        /// </summary>		
        private int _eventid;
        [Column(FilterType = FilterType.IsPrimaryKey, PrimaryKeyType = PrimaryKeyType.Identity)]
        public int EventID
        {
            get { return _eventid; }
            set { _eventid = value; }
        }
        /// <summary>
        /// 事件编号
        /// </summary>		
        private string _eventcode;
        public string EventCode
        {
            get { return _eventcode; }
            set { _eventcode = value; }
        }
        /// <summary>
        /// 事件地址
        /// </summary>		
        private string _eventaddress;
        public string EventAddress
        {
            get { return _eventaddress; }
            set { _eventaddress = value; }
        }
        /// <summary>
        /// 上报时间
        /// </summary>		
        private DateTime _uptime;
        [Column(FilterType = FilterType.IsNotUpdate)]
        public DateTime UpTime
        {
            get { return _uptime; }
            set { _uptime = value; }
        }
        /// <summary>
        /// 上报人
        /// </summary>		
        private int _personid;
        [Column(FilterType = FilterType.IsNotUpdate)]
        public int PersonId
        {
            get { return _personid; }
            set { _personid = value; }
        }
        /// <summary>
        /// PName
        /// </summary>		
        private string _pname;
        [Column(FilterType = FilterType.IsNotUpdate)]
        public string PName
        {
            get { return _pname; }
            set { _pname = value; }
        }
        /// <summary>
        /// 所属部门
        /// </summary>		
        private int _deptid;

        public int DeptId
        {
            get { return _deptid; }
            set { _deptid = value; }
        }
        /// <summary>
        /// 事件类型编号 关联事件类型表
        /// </summary>		
        private int _eventtypeid;
        public int EventTypeId
        {
            get { return _eventtypeid; }
            set { _eventtypeid = value; }
        }
        /// <summary>
        /// 关联事件类型 中事件内容编号
        /// </summary>		
        private int _eventtypeid2;
        public int EventTypeId2
        {
            get { return _eventtypeid2; }
            set { _eventtypeid2 = value; }
        }
        /// <summary>
        /// 关联事件上报来源表编号
        /// </summary>		
        private int _eventfromid;
        public int EventFromId
        {
            get { return _eventfromid; }
            set { _eventfromid = value; }
        }
        /// <summary>
        /// 1:一般  2:紧急  3:加急
        /// </summary>		
        private int _urgencyid;
        public int UrgencyId
        {
            get { return _urgencyid; }
            set { _urgencyid = value; }
        }
        /// <summary>
        /// 2小时-抢险类   4小时-正常维修   6小时-暂缓处理
        /// </summary>		
        private int _handlerlevelid;
        public int HandlerLevelId
        {
            get { return _handlerlevelid; }
            set { _handlerlevelid = value; }
        }
        /// <summary>
        /// 派单员从一体化session中读取登陆人员编号
        /// </summary>		
        private int _dispatchperson;
        public int DispatchPerson
        {
            get { return _dispatchperson; }
            set { _dispatchperson = value; }
        }
        /// <summary>
        /// 现场照片  以｜分割每个图片地址
        /// </summary>		
        private string _eventpictures;
        public string EventPictures
        {
            get { return _eventpictures; }
            set { _eventpictures = value; }
        }
        /// <summary>
        /// 现场录音  以｜分割每个录音的地址
        /// </summary>		
        private string _eventvoices;
        public string EventVoices
        {
            get { return _eventvoices; }
            set { _eventvoices = value; }
        }
        /// <summary>
        /// EventDesc
        /// </summary>		
        private string _eventdesc;
        public string EventDesc
        {
            get { return _eventdesc; }
            set { _eventdesc = value; }
        }
        /// <summary>
        /// X坐标
        /// </summary>		
        private string _eventx;
        public string EventX
        {
            get { return _eventx; }
            set { _eventx = value; }
        }
        /// <summary>
        /// Y坐标
        /// </summary>		
        private string _eventy;
        public string EventY
        {
            get { return _eventy; }
            set { _eventy = value; }
        }
        /// <summary>
        /// 时间更新时间
        /// </summary>		
        private DateTime _eventupdatetime;
        public DateTime EventUpdateTime
        {
            get { return _eventupdatetime; }
            set { _eventupdatetime = value; }
        }
        /// <summary>
        /// 是否有效   1有效   0无效
        /// </summary>		
        private int _isvalid;
        public int IsValid
        {
            get { return _isvalid; }
            set { _isvalid = value; }
        }
        /// <summary>
        /// 设备ID
        /// </summary>		
        private string _devicesmid;
        public string Devicesmid
        {
            get { return _devicesmid; }
            set { _devicesmid = value; }
        }
        /// <summary>
        /// 设备类别ID
        /// </summary>		
        private string _devicestype;
        public string DevicesType
        {
            get { return _devicestype; }
            set { _devicestype = value; }
        }
        /// <summary>
        /// 删除状态  1已删除   0未删除
        /// </summary>		
        private string _deletestatus;
        public string DeleteStatus
        {
            get { return _deletestatus; }
            set { _deletestatus = value; }
        }
        /// <summary>
        /// TaskId
        /// </summary>		
        private int _taskid;
        public int TaskId
        {
            get { return _taskid; }
            set { _taskid = value; }
        }
        /// <summary>
        /// Remark_Back
        /// </summary>		
        private string _remark_back;
        public string Remark_Back
        {
            get { return _remark_back; }
            set { _remark_back = value; }
        }
        /// <summary>
        /// OtherSysEventId
        /// </summary>		
        private string _othersyseventid;
        public string OtherSysEventId
        {
            get { return _othersyseventid; }
            set { _othersyseventid = value; }
        }
        /// <summary>
        /// 处理时间
        /// </summary>		
        private int _exectime;
        public int ExecTime
        {
            get { return _exectime; }
            set { _exectime = value; }
        }
        /// <summary>
        /// 联系人
        /// </summary>		
        private string _linkman;
        public string LinkMan
        {
            get { return _linkman; }
            set { _linkman = value; }
        }
        /// <summary>
        /// 联系电话
        /// </summary>		
        private string _linkcall;
        public string LinkCall
        {
            get { return _linkcall; }
            set { _linkcall = value; }
        }
        /// <summary>
        /// 事件状态
        /// </summary>		
        private int _eventstatus;
        public int EventStatus
        {
            get { return _eventstatus; }
            set { _eventstatus = value; }
        }

    }
}


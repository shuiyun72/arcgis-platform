using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.Model
{
    public class AdminPassword
    {
        public int iAdminID
        {
            set;
            get;
        }
        /// <summary>
        /// 登陆名称
        /// </summary>
        public string cAdminName
        {
            set;
            get;
        }
        public string cAdminPassWord
        {
            set;
            get;
        }
        /// <summary>
        /// 旧密码  add by lsl 20190806
        /// </summary>
        public string oldcAdminPassWord
        {
            set;
            get;
        }
    }
}

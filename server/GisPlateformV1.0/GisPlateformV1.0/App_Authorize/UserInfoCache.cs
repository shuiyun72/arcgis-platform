using GisPlateform.IDAL;
using GisPlateform.Model;
using GisPlateform.SQLServerDAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GisPlateformV1_0.App_Authorize
{
    public class UserInfoCache
    {
        private static readonly ICommonDAL commonDAL = new CommonDAL();

        private static P_Admin _Admin;
        public static P_Admin SetAdminInfo
        {
            set => _Admin = value;
        }
        public static P_Admin GetAdminInfo(string userId)
        {
            if (_Admin != null)
                return _Admin;
            else
            {
                _Admin = commonDAL.GetUserInfo(userId, out string errorMsg);
                _Admin.cAdminPassWord = "";
                return _Admin;
            }
        }

        private static List<P_Function> _Functions;
        public static List<P_Function> SetFunctions
        {
            set => _Functions = value;
        }
        public static List<P_Function> GetFunctions(string userId)
        {

            return _Functions = commonDAL.GetUserAuthority(userId, -1, out string errorMsg);

        }

        public static Authorize Authorize { set; get; }

    }
}
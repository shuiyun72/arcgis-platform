using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GisPlateformV1_0.App_Authorize
{
    public class RequestCheck
    {
        public ErrorType RequestLoginStateCheck(string token, string rawUrl)
        {
            if (string.IsNullOrEmpty(token))
            {
                return ErrorType.NoLogin;
            }
            else
            {
                try
                {
                    UserInfoCache.Authorize = JwtHelper.GetJwtDecode(token);
                }
                catch {
                    return ErrorType.NotAvilebalToken;
                }
                if (UserInfoCache.Authorize.ExpireTime < DateTime.Now)
                {
                    //暂时不需要验证时间 需要打开验证权限功能就取消下面注释
                    return ErrorType.OutOfTime;
                }
                else
                {
                    //暂时不需要验证权限 需要打开验证权限功能就取消下面注释

                    if (!RequestAuthorizeCheck(UserInfoCache.Authorize.UserId, rawUrl))
                    {
                        return ErrorType.NoAuthority;
                    }
                }
            }
            return ErrorType.Success;
        }

        public bool RequestAuthorizeCheck(string userId, string rawUrl)
        {
            //首页不需要验证
            if (rawUrl.Contains("home/index") || rawUrl.Contains("/system/") || rawUrl == "/")
                return true;
            //循环验证权限集合
            foreach (P_Function item in UserInfoCache.GetFunctions(userId))
            {
                if (item.cFunUrl == null)
                    continue;
                if (item.cFunUrl.Contains(rawUrl))
                    return true;
            }
            return false;
        }
    }
}
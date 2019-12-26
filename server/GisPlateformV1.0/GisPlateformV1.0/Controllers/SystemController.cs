using GisPlateform.IDAL;
using GisPlateform.Model.BaseEntity;
using Newtonsoft.Json;
using System;
using GisPlateform.Model;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using System.Collections.Generic;
using GisPlateformV1_0.AttributePack;
using GisPlateformV1_0.App_Authorize;
using GisPlateform.CommonTools;
using System.Configuration;

namespace GisPlateformV1_0.Controllers
{
    public class SystemController : BaseApiController
    {
        private readonly IP_AdminDAL _p_AdminDAL;

        public SystemController(ICommonDAL commonDAL, IP_AdminDAL p_AdminDAL) : base(commonDAL)
        {
            _p_AdminDAL = p_AdminDAL;
        }


        /// <summary>
        /// 获取用户权限
        /// </summary>
        /// <param name="iAdminID"></param>
        /// <param name="systemType">登陆类型 1:web(默认) 3手机App 4c/s</param>
        /// <returns></returns>
        public MessageEntity GetUserAuthority(string iAdminID, int systemType = 1)
        {
            var funcs = base.CommonDAL.GetUserAuthority(iAdminID, systemType, out string msg);

            if (string.IsNullOrEmpty(msg))
            {
                return MessageEntityTool.GetMessage(funcs.Count, funcs, true, "完成", funcs.Count);
            }
            else
            {
                return MessageEntityTool.GetMessage(ErrorType.SystemError);
            }
        }

        /// <summary>
        /// 获取岗位权限
        /// </summary>
        /// <param name="iRoleID">岗位id</param>
        /// <param name="systemType">登陆类型 1:web(默认) 3手机App 4c/s</param>
        /// <returns></returns>
        public MessageEntity GetRoleAuthority(string iRoleID, int systemType = 1)
        {
            var funcs = base.CommonDAL.GetRoleAuthority(iRoleID, systemType, out string msg);

            if (string.IsNullOrEmpty(msg))
            {
                return MessageEntityTool.GetMessage(funcs.Count, funcs, true, "完成", funcs.Count);
            }
            else
            {
                return MessageEntityTool.GetMessage(ErrorType.SystemError);
            }
        }

        /// <summary>
        /// 获取错误信息枚举
        /// </summary>
        /// <returns></returns>
        public MessageEntity GetErrorEnum()
        {

            Dictionary<string, int> errorEnum = new Dictionary<string, int>();
            foreach (ErrorType item in Enum.GetValues(typeof(ErrorType)))
            {
                errorEnum.Add(item.ToString(), (int)item);
            }
            return MessageEntityTool.GetMessage(1, errorEnum, true, "", 1);
        }


        /// <summary>
        /// 登陆
        /// </summary>
        /// <param name="loginContent">登陆名称</param>
        /// <param name="password">密码</param>
        /// <param name="systemType">登陆类型 1:web 3手机App 4c/s</param>
        /// <returns></returns>
        public MessageEntity Login(string loginContent, string password, int systemType = 1)
        {
            if (string.IsNullOrEmpty(loginContent))
            {
                return MessageEntityTool.GetMessage(ErrorType.OprationError,"", "用户名不能为空");
            }
            if (string.IsNullOrEmpty(password))
            {
                return MessageEntityTool.GetMessage(ErrorType.OprationError, "", "密码不能为空");
            }
            //验证用户是否输入密码错误超过4次
            var isDayFee = base.CommonDAL.IsDayFeezing(loginContent, out string errMsg1);
            //密码输错超过4次 不允许登录
            if (isDayFee)
            {
                return MessageEntityTool.GetMessage(ErrorType.OprationError, "", "已限制登录，请在10分钟后重试!");
            }
            var admin = base.CommonDAL.GetUserInfo(loginContent, password, out string errorMsg);
            if (admin != null && admin.cAdminName != null)
            {
                #region 验证用户是否锁定
                //验证用户是否锁定，锁定不允许登录
                var islocked = base.CommonDAL.IsLocked(loginContent, out string errMsg2);
                //密码输错超过4次 不允许登录
                if (islocked)
                {
                    return MessageEntityTool.GetMessage(ErrorType.OprationError, "", "已限制登录,用户账户已被锁定");
                }
                
                #endregion
                admin.cAdminPassWord = "";
                admin.Token = CreateAuthention(admin);
                var funcs = base.CommonDAL.GetUserAuthority(admin.iAdminID.ToString(), systemType, out string userAuthorityErrorMsg);

                if (funcs != null && funcs.Count() > 0)
                {
                    admin.UserAuthority = funcs;
                }

                var result = MessageEntityTool.GetMessage(1, admin, true, "登陆成功", 1);
                //插入密码错误日冻结表中
                var funcssucess = base.CommonDAL.InsertDayFeezing(loginContent,"1");
                return result;
            }
            else if (string.IsNullOrEmpty(errorMsg))
            {
                //插入密码错误日冻结表中
                var funcs = base.CommonDAL.InsertDayFeezing(loginContent,"0");
                return MessageEntityTool.GetMessage(ErrorType.NoLogin, "", "用户名或密码错误");
            }
            else
            {
                return MessageEntityTool.GetMessage(ErrorType.SystemError, errorMsg);
            }
        }

        /// <summary>
        /// 和达第三方登陆
        /// </summary>
        /// <param name="hdAcc">用户名</param>
        /// <param name="hdStamp">时间戳</param>
        /// <param name="hdSSOKey">公钥</param> 
        /// <param name="systemType">登陆类型 1:web 3手机App 4c/s</param>
        /// <returns></returns>
        public MessageEntity HDLogin(string hdAcc, string hdStamp, string hdSSOKey, int systemType = 1)
        {
            if (string.IsNullOrEmpty(hdAcc))
            {
                return MessageEntityTool.GetMessage(ErrorType.OprationError, "", "用户名不能为空");
            }
            if (string.IsNullOrEmpty(hdStamp))
            {
                return MessageEntityTool.GetMessage(ErrorType.OprationError, "", "时间戳不能为空");
            }
            if (string.IsNullOrEmpty(hdSSOKey))
            {
                return MessageEntityTool.GetMessage(ErrorType.OprationError, "", "公钥不能为空");
            }
            string hdKey = string.Empty;
            try
            {
                hdKey = Sha1Helper.Encryption(ConfigurationManager.AppSettings["hdSalt"].ToString() + hdAcc + hdStamp);
            }
            catch (Exception e)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError, e.Message);
            }
            if (hdKey.ToLower().Equals(hdSSOKey.Trim().ToString().ToLower()))
            {
                var admin = base.CommonDAL.GetUserInfoByName(hdAcc, out string errorMsg);
                if (admin != null && admin.cAdminName != null)
                {
                    admin.cAdminPassWord = "";

                    admin.Token = CreateAuthention(admin);
                    var funcs = base.CommonDAL.GetUserAuthority(admin.iAdminID.ToString(), systemType, out string userAuthorityErrorMsg);

                    if (funcs != null && funcs.Count() > 0)
                    {
                        admin.UserAuthority = funcs;
                    }

                    var result = MessageEntityTool.GetMessage(1, admin, true, "登陆成功", 1);

                    return result;
                }
                else if (string.IsNullOrEmpty(errorMsg))
                {
                    return MessageEntityTool.GetMessage(ErrorType.NoLogin, "", "没有该用户");
                }
                else
                {
                    return MessageEntityTool.GetMessage(ErrorType.SystemError, errorMsg);
                }
            }
            else
            {
                return MessageEntityTool.GetMessage(ErrorType.NoAuthority, "", "第三方登陆验证失败");
            }
        }


        public MessageEntity Logout()
        {
            //if (base.CheckUserLoginState())
            //{
            //    HttpCookie userCookie = Request.Cookies[FormsAuthentication.FormsCookieName];
            //    FormsAuthentication.SignOut();
            //    Response.Cookies["FormsAuthentication.FormsCookieName"].Expires = DateTime.Now.AddDays(-1);
            //}
            return MessageEntityTool.GetMessage(0);
        }

        /// <summary>
        /// 保存用户加密cookie
        /// </summary>
        /// <param name = "admin" ></param>
        private string CreateAuthention(P_Admin admin)
        {
            #region 加密票据
            //FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, JsonConvert.SerializeObject(admin), DateTime.Now, DateTime.Now.AddDays(1), true, "");
            ////加密票据
            //string authTicket = FormsAuthentication.Encrypt(ticket);
            ////存储为cookie
            //Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, authTicket)
            //{
            //    Expires = ticket.Expiration,
            //});
            var payload = new Dictionary<string, object>
            {
                { "UserId",admin.iAdminID},
                { "UserName", admin.cAdminName },
                { "ExpireTime",DateTime.Now.AddDays(1)},
                { "IP",""}
            };

            return JwtHelper.SetJwtEncode(payload);

            #endregion
        }
    }
}
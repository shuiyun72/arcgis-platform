
using GisPlateform.IDAL;
using GisPlateformV1_0.AttributePack;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Web.Mvc;


namespace GisPlateformV1_0.Controllers
{
    public class HomeController : BaseController
    {
        private readonly IP_AdminDAL _p_AdminDAL;
        public HomeController(IP_AdminDAL p_AdminDAL, ICommonDAL commonDAL):base(commonDAL)
        {
            _p_AdminDAL = p_AdminDAL;
        }


        [ActionAttribute(IsCheckAuthority = false)]
        public ActionResult Index()
        {
            
            return new FilePathResult("~/index.html", "text/html");
        }
        
    }
}
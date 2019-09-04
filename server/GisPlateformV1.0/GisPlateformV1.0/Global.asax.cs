using Autofac;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using GisPlateform.IDAL;
using Autofac.Integration.Mvc;
using System.Configuration;
using System.Reflection;
using GisPlateform.Model;
using System.Web.Http;
using Newtonsoft.Json;
using Autofac.Integration.WebApi;

namespace GisPlateformV1_0
{
    public class MvcApplication : System.Web.HttpApplication
    {
        
        protected void Application_Start()
        {
            var builder = RegisterService();

            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
            GlobalConfiguration.Configure(WebApiConfig.Register);
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            var resolver = new AutofacWebApiDependencyResolver(container);
            GlobalConfiguration.Configuration.DependencyResolver = resolver;
        }


        public ContainerBuilder RegisterService()
        {

            string connectionName = ConfigurationManager.AppSettings["DBName"];
            var builder = new ContainerBuilder();
            var baseType = typeof(IDependency);
            //var assemblys = AppDomain.CurrentDomain.GetAssemblies().ToList();
            Assembly[] assemblys = new Assembly[System.Web.Compilation.BuildManager.GetReferencedAssemblies().Count];
            System.Web.Compilation.BuildManager.GetReferencedAssemblies().CopyTo(assemblys, 0);

            var filterAssemblys = assemblys.ToList();
            filterAssemblys.RemoveAll(p => (!p.ManifestModule.Name.EndsWith("IDAL.dll") && p.ManifestModule.Name.EndsWith("DAL.dll") && !p.FullName.Contains(connectionName)));

            builder.RegisterControllers(filterAssemblys.ToArray());
            builder.RegisterApiControllers(filterAssemblys.ToArray());

            builder.RegisterAssemblyTypes(filterAssemblys.ToArray())
                   .Where(t => baseType.IsAssignableFrom(t) && t != baseType)
                   .AsImplementedInterfaces().InstancePerLifetimeScope();
            
            return builder;
        }
    }
}

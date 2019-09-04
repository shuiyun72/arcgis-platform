using System.Web.Http;
using WebActivatorEx;
using GisPlateformV1_0;
using Swashbuckle.Application;

using System.Reflection;

[assembly: PreApplicationStartMethod(typeof(SwaggerConfig), "Register")]

namespace GisPlateformV1_0
{
    public class SwaggerConfig
    {
        public static void Register()
        {
            var thisAssembly = typeof(SwaggerConfig).Assembly;

            GlobalConfiguration.Configuration
                .EnableSwagger(c =>
                    {
                        c.CustomProvider((defaultProvider) => new SwaggerControllerDescProvider(defaultProvider, GetXmlCommentsPath()));
                        c.SingleApiVersion("v1", "Master");
                        c.IncludeXmlComments(GetXmlCommentsPath());
                        c.OperationFilter<GlobalHttpHeaderFilter>();
                    })
                 .EnableSwaggerUi(c =>
                 {
                     c.InjectJavaScript(System.Reflection.Assembly.GetExecutingAssembly(), "GisPlateformV1_0.swagger.js");
                 });

        }

        protected static string GetXmlCommentsPath()
        {
            return System.String.Format(@"{0}\bin\GisPlateformV1.xml", System.AppDomain.CurrentDomain.BaseDirectory);
        }

    }
}

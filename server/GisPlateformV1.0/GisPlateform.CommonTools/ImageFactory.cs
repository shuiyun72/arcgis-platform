using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
namespace GisPlateform.CommonTools
{
    public class ImageFactory
    {


        public bool SaveBase64Img(string base64Img, string fullPath)
        {
            try
            {

                byte[] arr = Convert.FromBase64String(base64Img);
                MemoryStream ms = new MemoryStream(arr);
                Bitmap bmp = new Bitmap(ms);
                string path = Path.GetDirectoryName(fullPath);
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                bmp.Save(fullPath);
                ms.Close();
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string getPictureUrl([FromBody]string[] base64Image)
        {
            string eventPictures = string.Empty;
            DateTime dateNow = DateTime.Now;
            ImageFactory imageFactory = new ImageFactory();
            Random random = new Random();
            if (base64Image != null && base64Image.Length > 0)
            {
                foreach (string item in base64Image)
                {
                    string[] arr = item.Split('|');
                    string imageStream = arr[0];//base64编码的图片
                    string formate = arr[1];//图片格式带点
                    if (imageStream == "")
                    {
                        return null;
                    }
                    string relativeDir = "/upload/EventsImg/" + dateNow.Year + "/" + dateNow.Month + "/" + dateNow.Day;
                    string imageName = string.Format("{0:yyyyMMddHHmmss}", dateNow);
                    string relativePath = string.Format("{0}/{1}{2}", relativeDir, imageName + random.Next(1, 100), formate);
                    try
                    {
                        if (imageFactory.SaveBase64Img(imageStream, System.Web.HttpContext.Current.Server.MapPath(relativePath)))
                        {
                            eventPictures += relativePath + '|';
                        }
                    }
                    catch (Exception e)
                    {
                        return e.ToString();
                    }
                    return eventPictures;
                }
            }
            return null;
        }
    }
}

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
  public  class FileFactory
    {
        public string getFileUrl([FromBody]string[] base64Image)
        {
            string eventPictures = string.Empty;
            DateTime dateNow = DateTime.Now;
            FileFactory fileFactory = new FileFactory();
            Random random = new Random();
            if (base64Image != null && base64Image.Length > 0)
            {
                foreach (string item in base64Image)
                {
                    string[] arr = item.Split('|');
                    string imageStream = arr[0];//base64编码的文件
                    string formate = arr[1];//文件格式带点
                    if (imageStream == "")
                    {
                        return null;
                    }
                    string relativeDir = "/upload/EventsImg/" + dateNow.Year + "/" + dateNow.Month + "/" + dateNow.Day;
                    string imageName = string.Format("{0:yyyyMMddHHmmss}", dateNow);
                    string relativePath = string.Format("{0}/{1}{2}", relativeDir, imageName + random.Next(1, 100), formate);
                    try
                    {
                        if (fileFactory.UploadFile(imageStream, System.Web.HttpContext.Current.Server.MapPath(relativePath)))
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
        public bool UploadFile(string base64String, string fullPath)
        {
           
            try
            {
                using (MemoryStream ms = new MemoryStream(Convert.FromBase64String(base64String)))
                {//有时候为了避免流指针定位错误，显式定义一下指针位置到也可以
                    ms.Seek(0, SeekOrigin.Begin);
                    string path = Path.GetDirectoryName(fullPath);
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }
                    using (Stream fs = new FileStream(fullPath, FileMode.Create))
                    {
                        ms.WriteTo(fs);
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }

}

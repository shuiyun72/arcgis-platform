using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL
{
    public interface ICellphoneManageDAL : IDependency
    {
        MessageEntity Get( string sort, string ordering, int num, int page);
        MessageEntity GetLatestVersionId();
        MessageEntity UploadApk(string FileName,string VersionId);
        MessageEntity getCount(string VersionId);
    }
}

using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using System.Collections.Generic;

namespace GisPlateform.IDAL
{
    public interface IDepartmentDAL : IDependency
    {
        MessageEntity Get(string sort, string ordering, int num, int page);
        MessageEntity Add(P_Department department);
        MessageEntity Update(P_Department department);
        MessageEntity Delete(P_Department department);
        List<dynamic> GetDeptInfoList(out string errorMsg);

    }
}

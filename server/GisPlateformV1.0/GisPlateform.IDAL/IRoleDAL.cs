using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL
{
    public interface IRoleDAL :IDependency
    {
        MessageEntity Get(string roleName, string sort, string ordering, int num, int page);
        MessageEntity Add(P_Role role);
        MessageEntity Update(P_Role role);
        MessageEntity Delete(P_Role role);
    }
}

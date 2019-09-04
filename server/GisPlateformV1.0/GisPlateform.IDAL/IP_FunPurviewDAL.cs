using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using System.Collections.Generic;

namespace GisPlateform.IDAL
{
    public interface IP_FunPurviewDAL : IDependency
    {
        bool RefreshFunPurview(List<P_FunPurview> funPurview, out string errorMsg);
        bool UpdateFunction(P_Function function, out string errorMsg);
        MessageEntity PostFunction(P_Function function);
        MessageEntity DeleteFunction(int funId);
        MessageEntity GetFunction();
    }
}

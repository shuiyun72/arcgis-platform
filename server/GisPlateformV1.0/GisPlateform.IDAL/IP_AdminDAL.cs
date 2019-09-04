using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;

namespace GisPlateform.IDAL
{
    public interface IP_AdminDAL : IDependency
    {

        List<P_Admin> GetList();

        /// <summary>
        /// 根据主键获得P_Admin
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        P_Admin GetEntity(string id);

        MessageEntity GetListByPage( string sort, string ordering, int num, int page);

        /// <summary>
        /// 根据主键获得P_Admin的关联项
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        P_Admin GetEntityWithRefence(string id);

        int Insert(P_Admin p_Admin);

    }
}

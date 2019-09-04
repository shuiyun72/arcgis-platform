using GisPlateform.IDAL;
using GisPlateform.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.PostgreSQLDAL
{
    public class P_AdminDAL : IDAL.IP_AdminDAL
    {
        public p_Admin GetEntity(string id)
        {
            return new p_Admin() { cAdminName = "PostgreSQLDAL" };
        }

        public p_Admin GetEntityWithRefence(string id)
        {
            throw new NotImplementedException();
        }

        public List<p_Admin> GetList()
        {
            throw new NotImplementedException();
        }

        public int Insert(p_Admin p_Admin)
        {
            throw new NotImplementedException();
        }

        public int InsertEntity(object entity)
        {
            throw new NotImplementedException();
        }
        
    }
}

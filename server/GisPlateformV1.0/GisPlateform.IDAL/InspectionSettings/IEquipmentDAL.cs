using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL.InspectionSettings
{
    public interface IEquipmentDAL:IDependency
    {
        MessageEntity GetComboBoxList();
        MessageEntity GetByLayerNid(string layerId, string objecketId);
    }
}

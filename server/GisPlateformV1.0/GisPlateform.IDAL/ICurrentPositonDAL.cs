using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.IDAL
{
    public interface ICurrentPositonDAL : IDependency
    {
        MessageEntity Add(string positionX, string positionY, string upTime, int personId, int isOnline);
    }
}

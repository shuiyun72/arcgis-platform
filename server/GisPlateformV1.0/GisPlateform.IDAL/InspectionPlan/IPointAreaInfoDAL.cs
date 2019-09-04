using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;


namespace GisPlateform.IDAL
{
    public interface IPointAreaInfoDAL : IDependency
    {
        MessageEntity GetAllPointAreaInfo(string planAreaId, string sort, string ordering, int num, int page);

        MessageEntity UpdatePointTableByPointId(PointAreaInfo pointTable);
        MessageEntity AddPointArea(PointAreaInfo pointTable);
        MessageEntity DeletePointArea(PointAreaInfo pointTable);
    }
}

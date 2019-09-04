using Dapper;
using GisPlateform.CommonTools;
using GisPlateform.Database;
using GisPlateform.IDAL;
using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Text;
using System.Web.Hosting;
using static Dapper.SqlMapper;

namespace GisPlateform.SQLServerDAL
{
    public class PipeDAL : IPipeDAL
    {
        public List<string> GetCaliber(out string errMessge)
        {
            List<string> calibers;
            errMessge = "";
            string query = @" SELECT caliber
FROM
(
    SELECT CONVERT(NUMERIC, caliber) AS caliber
    FROM PIPETABLE
    UNION ALL
    SELECT CONVERT(NUMERIC, caliber) AS caliber
    FROM POINTTABLE WHERE caliber IS NOT NULL 
) t
GROUP BY t.caliber
ORDER BY t.caliber ";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
                {
                    calibers = conn.Query<string>(query).ToList();
                    return calibers;
                }
            }
            catch (Exception e)
            {
                errMessge = e.Message;
                return null;
            }
        }

        public List<string> Getinstallation_addresses(out string errMessge)
        {
            List<string> installation_address;
            errMessge = "";
            string query = @" SELECT Installation_address
FROM
(
    SELECT Installation_address AS Installation_address
    FROM PIPETABLE WHERE Installation_address IS NOT NULL AND Installation_address!=''
    UNION ALL
    SELECT Installation_address AS Installation_address
    FROM POINTTABLE WHERE Installation_address IS NOT NULL AND Installation_address!=''
) t
GROUP BY t.Installation_address
ORDER BY t.Installation_address ";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
                {
                    installation_address = conn.Query<string>(query).ToList();
                    return installation_address;
                }
            }
            catch (Exception e)
            {
                errMessge = e.Message;
                return null;
            }
        }

        public List<Object> GetLayers(out string errorMsg)
        {
            List<Object> equipment_types = new List<Object>();
            errorMsg = "";
            equipment_types.Add(new { cnName = "水表", layerId = "WATERMETER" });
            equipment_types.Add(new { cnName = "水表井", layerId = "WATERMETERWELL" });
            equipment_types.Add(new { cnName = "阀门井", layerId = "VALVEWELL" });
            equipment_types.Add(new { cnName = "阀门", layerId = "VALVE" });
            equipment_types.Add(new { cnName = "检修井", layerId = "SERVICINGWELL" });
            equipment_types.Add(new { cnName = "消火栓", layerId = "FIREHYDRANT" });
            equipment_types.Add(new { cnName = "消防井", layerId = "FIREFIGHTINGWELL" });
            equipment_types.Add(new { cnName = "弯头", layerId = "ELBOW" });
            equipment_types.Add(new { cnName = "四通", layerId = "CROSS" });
            equipment_types.Add(new { cnName = "三通", layerId = "TEE" });
            equipment_types.Add(new { cnName = "变材", layerId = "MATERIALCHANGE" });
            equipment_types.Add(new { cnName = "变径", layerId = "CALIBERCHANGE" });
            equipment_types.Add(new { cnName = "排气阀", layerId = "EXHAUSTVALVE" });
            equipment_types.Add(new { cnName = "管网", layerId = "PIPE" });
            return equipment_types;
        }

        public List<string> GetMaterial_science(out string errMessge)
        {
            List<string> material_sciences;
            errMessge = "";
            string query = " SELECT Material_science FROM PIPETABLE  WHERE Material_science IS NOT NULL AND Material_science != '' GROUP BY Material_science";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
                {
                    material_sciences = conn.Query<string>(query).ToList();
                    return material_sciences;
                }
            }
            catch (Exception e)
            {
                errMessge = e.Message;
                return null;
            }
        }

        public List<PointTable> GetPipeAndPointByPage(string layer, string installation_address, string material_science, string minCaliber, string maxCaliber, DateTime? startCompletion_date, DateTime? endCompletion_date, string sort, string ordering, int num, int page, out string errMessge, out MessageEntity result)
        {

            string query = @"SELECT *
FROM
(
    SELECT OBJECTID,
           equipment_number,
           '' AS material_science,
           caliber,
           elevation,
           depth,
           0 AS startingpoint_elevation,
           0 AS endpoint_elevation,
           Installation_address,
           construction_unit,
           management_unit,
           completion_date,
           laying_age,
           0 AS startingpoint_depth,
           0 AS endpoint_depth,
           embedding_mode,
           coordinate_x,
           coordinate_y,
           equipment_type,
           switch_type,
           0 AS startingpoint_x,
           0 AS startingpoint_y,
           0 AS endpoint_x,
           0 AS endpoint_y,
           Interface_form,
           remarks,
           0 AS length,
           Coversize,
           CoverMaterial
    FROM POINTTABLE
    UNION
    SELECT OBJECTID,
           equipment_number,
           material_science,
           caliber,
           0 AS elevation,
           0 AS depth,
           startingpoint_elevation,
           endpoint_elevation,
           Installation_address,
           construction_unit,
           management_unit,
           completion_date,
           laying_age,
           startingpoint_depth,
           endpoint_depth,
           embedding_mode,
           0 AS coordinate_x,
           0 AS coordinate_y,
           '管网' AS equipment_type,
           '' AS switch_type,
           startingpoint_x,
           startingpoint_y,
           endpoint_x,
           endpoint_y,
           Interface_form,
           remarks,
           length,
           '' AS Coversize,
           '' AS CoverMaterial
    FROM PIPETABLE
) t
WHERE 1 = 1  ";

            string sqlWhere = "";
            if (!string.IsNullOrEmpty(layer) && layer != "全部")
            {
                sqlWhere += $" and equipment_type = '{layer}' ";
            }

            if (!string.IsNullOrEmpty(installation_address) && installation_address != "全部")
            {
                sqlWhere += $" and installation_address like '%{installation_address}%' ";
            }

            if (!string.IsNullOrEmpty(material_science) && material_science != "全部")
            {
                sqlWhere += $" and material_science = '{material_science}' ";
            }

            if (!string.IsNullOrEmpty(minCaliber) && minCaliber != "全部")
            {
                sqlWhere += $" and Caliber = '{minCaliber}' ";
            }

            if (startCompletion_date.HasValue && endCompletion_date.HasValue)
                sqlWhere += $" and completion_date >= '{startCompletion_date}' and completion_date <= '{endCompletion_date}' ";


            var pointTables = DapperExtentions.EntityForSqlToPager<PointTable>(query + sqlWhere, sort, ordering, num, page, out result);
            if (result.ErrorType != (int)ErrorType.Success)
            {
                errMessge = result.ExceptionMsg;
            }
            else
            {
                errMessge = "";
            }

            return pointTables;

        }



        public List<dynamic> GetPipeAndPointStatistics(string layer, string installation_address, string material_science, string caliber, DateTime? startCompletion_date, DateTime? endCompletion_date, string sort, string ordering, string[] groupFields, out string errMessge, out MessageEntity result)
        {
            string query = @"SELECT {0}
FROM
(
    SELECT OBJECTID,
           equipment_number,
           '' AS material_science,
           caliber,
           elevation,
           depth,
           0 AS startingpoint_elevation,
           0 AS endpoint_elevation,
           Installation_address,
           construction_unit,
           management_unit,
           completion_date,
           laying_age,
           0 AS startingpoint_depth,
           0 AS endpoint_depth,
           embedding_mode,
           coordinate_x,
           coordinate_y,
           equipment_type,
           switch_type,
           0 AS startingpoint_x,
           0 AS startingpoint_y,
           0 AS endpoint_x,
           0 AS endpoint_y,
           Interface_form,
           remarks,
           0 AS length,
           Coversize,
           CoverMaterial
    FROM POINTTABLE
    UNION
    SELECT OBJECTID,
           equipment_number,
           material_science,
           caliber,
           0 AS elevation,
           0 AS depth,
           startingpoint_elevation,
           endpoint_elevation,
           Installation_address,
           construction_unit,
           management_unit,
           completion_date,
           laying_age,
           startingpoint_depth,
           endpoint_depth,
           embedding_mode,
           0 AS coordinate_x,
           0 AS coordinate_y,
           '管网' AS equipment_type,
           '' AS switch_type,
           startingpoint_x,
           startingpoint_y,
           endpoint_x,
           endpoint_y,
           Interface_form,
           remarks,
           length,
           '' AS Coversize,
           '' AS CoverMaterial
    FROM PIPETABLE
) t
WHERE 1 = 1 {1}  {2}";
            string sqlWhere = "";
            string selectItem = "";
            string groupItem = "";


            if (!string.IsNullOrEmpty(layer) && layer != "全部")
            {
                sqlWhere += $" and equipment_type = '{layer}' ";
                //selectItem += " ,equipment_type  ";
                //groupItem += " ,equipment_type ";
            }

            if (!string.IsNullOrEmpty(installation_address) && installation_address != "全部")
            {
                sqlWhere += $" and installation_address like '%{installation_address}%' ";
                //selectItem += " ,installation_address ";
                //groupItem += " ,installation_address ";
            }

            if (!string.IsNullOrEmpty(material_science) && material_science != "全部")
            {
                sqlWhere += $" and material_science = '{material_science}' ";
                //selectItem += " ,material_science  ";
                //groupItem += " ,material_science ";
            }

            if (!string.IsNullOrEmpty(caliber) && caliber != "全部")
            {
                sqlWhere += $" and Caliber = '{caliber}' ";
                //selectItem += " ,Caliber ";
                //groupItem += " ,Caliber ";
            }

            if (groupFields == null || groupFields.Length == 0)
            {
                selectItem = " equipment_type,installation_address ,material_science , Caliber   ,COUNT(0) AS records ";
                groupItem = " group by equipment_type,installation_address,material_science,Caliber ";
            }
            else
            {
                foreach (string field in groupFields)
                {
                    if (!string.IsNullOrEmpty(field))
                    {
                        selectItem += "," + field;
                        groupItem += "," + field;
                    }
                }
                selectItem = selectItem.Remove(0, 1);
                selectItem += " ,COUNT(0) AS records ";
                groupItem = groupItem.Remove(0, 1);
                groupItem = groupItem.Insert(0, " group by ");
            }


            if (startCompletion_date.HasValue && endCompletion_date.HasValue)
                sqlWhere += $" and completion_date >= '{startCompletion_date}' and completion_date <= '{endCompletion_date}' ";



            query = string.Format(query, selectItem, sqlWhere, groupItem);

            var pointTables = DapperExtentions.EntityForSqlToPager<dynamic>(query, sort, ordering, int.MaxValue, 1, out result);
            if (result.ErrorType != (int)ErrorType.Success)
            {
                errMessge = result.ExceptionMsg;
            }
            else
            {
                errMessge = "";
            }

            return pointTables;
        }

        public Dictionary<string, List<dynamic>> GetRealatedValveAndPipeByPipeId(int[] pipeIds, out string errorMsg)
        {
            Dictionary<string, List<dynamic>> result = new Dictionary<string, List<dynamic>>();
            errorMsg = string.Empty;
            string pipeField = @"OBJECTID
      ,equipment_number
      ,material_science
      ,caliber
      ,length
      ,startingpoint_elevation
      ,endpoint_elevation
      ,Installation_address
      ,pipeground
      ,management_unit
      ,completion_date
      ,laying_age
      ,startingpoint_depth
      ,endpoint_depth
      ,embedding_mode
      ,equipment_type
      ,Interface_form
      ,remarks
      ,pipelinetype
      ,businessarea
      ,ownedwater
      ,Enabled
      ,PID 
      ,Shape";
            string vavleField = @" OBJECTID
      ,equipment_number
      ,material_science
      ,caliber
      ,elevation
      ,depth
      ,Installation_address
      ,management_unit
      ,completion_date
      ,laying_age
      ,embedding_mode
      ,coordinate_x
      ,coordinate_y
      ,Interface_form
      ,remarks
      ,coversize
      ,coverMaterial
      ,businessarea
      ,switchtype
      ,switchingstate
      ,equipment_type
      ,Enabled
      ,PID 
      ,Shape ";
            string vavleWellField = @" OBJECTID
      ,equipment_number
      ,material_science
      ,caliber
      ,elevation
      ,depth
      ,Installation_address
      ,management_unit
      ,completion_date
      ,laying_age
      ,embedding_mode
      ,coordinate_x
      ,coordinate_y
      ,Interface_form
      ,remarks
      ,coversize
      ,coverMaterial
      ,businessarea
      ,switchtype
      ,switchingstate
      ,equipment_type
      ,Enabled
      ,Shape ";
            string query = " SELECT LineID,NodesPID,LinesPID,NodesPID2 FROM NetWorkAnalystResult  WHERE LineID IN @ids";
            try
            {
                using (IDbConnection conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GISDB))
                {
                    var valueAndPipeList = conn.Query<dynamic>(query, new { ids = pipeIds }).ToList();
                    string vavleQuerySql = "";
                    string pipeQuerySql = "";
                    string vavleWellQuerySql = "";
                    int i = 1;
                    foreach (var valueAndPipe in valueAndPipeList)
                    {
                        if (valueAndPipe != null)
                        {
                            if (i == 1)
                            {
                                if (valueAndPipe.NodesPID != null && valueAndPipe.NodesPID != "")
                                {
                                    vavleQuerySql = $@"SELECT   {vavleField}  FROM VALVE WHERE PID in ({valueAndPipe.NodesPID}) ";


                                }
                                if (valueAndPipe.LinesPID != null && valueAndPipe.LinesPID != "")
                                {
                                    pipeQuerySql = $@"SELECT  {pipeField} FROM PIPE WHERE PID in ({valueAndPipe.LinesPID}) ";

                                }
                                if (valueAndPipe.NodesPID2 != null && valueAndPipe.NodesPID2 != "")
                                {
                                    vavleWellQuerySql = $@"SELECT  {vavleWellField} FROM VALVEWELL WHERE PID in ({valueAndPipe.NodesPID2}) ";

                                }
                            }
                            else
                            {
                                if (valueAndPipe.NodesPID != null && valueAndPipe.NodesPID != "")
                                {
                                    vavleQuerySql += $@" union all SELECT  {vavleField} FROM VALVE WHERE PID in ({valueAndPipe.NodesPID}) ";
                                }
                                if (valueAndPipe.LinesPID != null && valueAndPipe.LinesPID != "")
                                {
                                    pipeQuerySql += $@" union all  SELECT {pipeField} FROM PIPE WHERE PID in ({valueAndPipe.LinesPID}) ";
                                }
                                if (valueAndPipe.NodesPID2 != null && valueAndPipe.NodesPID2 != "")
                                {
                                    vavleWellQuerySql += $@" union all  SELECT  {vavleWellField} FROM VALVEWELL WHERE PID in ({valueAndPipe.NodesPID2}) ";

                                }
                            }
                            i++;
                        }
                    }
                    if (!string.IsNullOrEmpty(vavleQuerySql))
                    {
                        var valvesInfo = conn.Query<dynamic>(vavleQuerySql).ToList();
                        result.Add("valvesInfo", valvesInfo);
                    }
                    if (!string.IsNullOrEmpty(pipeQuerySql))
                    {
                        var pipesInfo = conn.Query<dynamic>(pipeQuerySql).ToList();
                        result.Add("pipesInfo", pipesInfo);
                    }
                    if (!string.IsNullOrEmpty(vavleWellQuerySql))
                    {
                        var vavleWellInfo = conn.Query<dynamic>(vavleWellQuerySql).ToList();
                        result.Add("vavleWellInfo", vavleWellInfo);
                    }
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return null;
            }

            return result;
        }

        public string GetCurveHeng(DataSet sender)
        {
            string iconPath = HostingEnvironment.MapPath("~/severImg/regular.png");
            //DataTable dt1 = JsonConvert.DeserializeObject<DataTable>(dataStr);
            //ds.Tables.Add(dt1);

            CurveHeng curveImg = new CurveHeng();//定义一个画图类实例
            curveImg.Title = "";
            curveImg.Width = 800;
            curveImg.Height = 600;
            curveImg.TextColor = Color.Red;
            curveImg.IconPath = iconPath;
            curveImg.DS = sender;

            //string imgPath = "ChartImages/" + "MyCurve.jpg";
            //DeleteDiskFile(imgPath);//先删除图片
            string savePath = HostingEnvironment.MapPath("~/upload/ChartImages/regular.png");
            CurveHeng.CreateChartByCurve(curveImg, savePath, ImageFormat.Jpeg);
            //this.pic.ImageUrl = imgPath;
            //this.pic.Visible = true;
            Random rnd = new Random();
            int number = rnd.Next(0, 100000);

            return $"/upload/ChartImages/regular.png?{number}";
        }

        public Pipe Get(string latitude, string longitude,out string errMessge)
        {
            errMessge = "";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GISDB))
            {
                
                string query = $@"SELECT TOP(1) *,
       geometry::STGeomFromText('POINT({latitude} {longitude})', 4547).STDistance(Shape) AS distance
FROM [PIPE]
WHERE Shape IS NOT NULL
ORDER BY distance;";
                try
                {
                    var b = conn.Query<Pipe>(query, new { latitude , longitude }).SingleOrDefault();
                    return b;
                }
                catch (Exception e)
                {
                    errMessge = e.Message;
                    return new Pipe();
                }
            }
        }
    }
}
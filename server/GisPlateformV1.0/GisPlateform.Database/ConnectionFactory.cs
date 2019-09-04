using Npgsql;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace GisPlateform.Database
{
    public class ConnectionFactory
    {
        private static readonly string gisPlateformString = ConfigurationManager.AppSettings["GisPlateform"];
        private static readonly string pipeInspection_Smart_Water = ConfigurationManager.AppSettings["PipeInspection_Smart_Water"];
        private static readonly string pipeInspectionBase_Gis_DB = ConfigurationManager.AppSettings["PipeInspectionBase_Gis_DB"];
        private static readonly string pipeInspectionBase_Gis_OutSide = ConfigurationManager.AppSettings["PipeInspectionBase_Gis_OutSide"];
        private static readonly string pipeInspectionSmartNet = ConfigurationManager.AppSettings["PipeInspectionSmartNet"];
        private static readonly string GISDB = ConfigurationManager.AppSettings["GISDB"];

        private static readonly string DBName = ConfigurationManager.AppSettings["DBName"];

        public enum DBConnNames {
            GisPlateform,
            PipeInspection_Smart_Water,
            PipeInspectionBase_Gis_DB,
            PipeInspectionBase_Gis_OutSide,
            PipeInspectionSmartNet,
            GISDB
        }
        public static IDbConnection GetDBConn(DBConnNames dbConnName)
        {
            return CreateConnection(ConfigurationManager.AppSettings[dbConnName.ToString()]);
        }
        
        private static IDbConnection CreateConnection(string connString)
        {
            IDbConnection conn = null;
            switch (DBName)
            {
                case "SQLServer":
                    conn = new SqlConnection(connString);
                    break;
                case "PostgreSQL":
                    conn = new NpgsqlConnection(connString);
                    break;
                default:
                    conn = new SqlConnection(connString);
                    break;
            }

            conn.Open();
            return conn;
        }

        public static IDisposable GetDBConn(object dBConnName)
        {
            throw new NotImplementedException();
        }
    }
}

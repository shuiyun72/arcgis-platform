using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL;
using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace GisPlateform.SQLServerDAL
{
    class P_FunPurviewDAL : BaseDAL, IP_FunPurviewDAL
    {


        public bool RefreshFunPurview(List<P_FunPurview> funPurview, out string errorMsg)
        {
            errorMsg = "";

            if (funPurview.Count < 1)
            {
                errorMsg = "funPurview为空";
                return false;
            }

            string deleteSql = "DELETE FROM P_FunPurview WHERE iPurviewID = @iPurviewID and iPurviewType=@iPurviewType;";
            string insertSql = @"INSERT INTO P_FunPurview (iPurviewID,iFunID,iPurviewType)  VALUES(@iPurviewID,@iFunID,@iPurviewType); ";
            using (var conn= ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                using (var transaction = conn.BeginTransaction())
                {
                    
                    try
                    {
                        conn.Execute(deleteSql, funPurview.FirstOrDefault(), transaction);
                        conn.Execute(insertSql, funPurview, transaction);
                        transaction.Commit();
                        return true;
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        errorMsg = e.Message;
                    }
                }

            }

            return false;
        }

        public bool UpdateFunction(P_Function function, out string errorMsg)
        {
            errorMsg = "";
           

            string updateSql = @"UPDATE P_Function
   SET cFunName = @cFunName
      ,cFunIcon = @cFunIcon
      ,cFunSmallIcon = @cFunSmallIcon
      ,cFunUrl =@cFunUrl
      ,Params = @Params
      ,cFunOnClick = @cFunOnClick
      ,iFunOrder = @iFunOrder
      ,iFunMenuIsShow = @iFunMenuIsShow
      ,cFunMenuOrder = @cFunMenuOrder
      ,Type = @Type
      ,SqlId = @SqlId
      ,System_Type = @System_Type
      ,cFunWidth = @cFunWidth
      ,cFunHeight = @cFunHeight
      ,cFunPosition = @cFunPosition
      ,FunctionType = @FunctionType
 WHERE  iFunID = @iFunID ";
            using (var conn= ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                //conn.Open();
                using (var transaction = conn.BeginTransaction())
                {
                   
                    try
                    {
                        conn.Execute(updateSql, function,transaction);
                        transaction.Commit();
                        return true;
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        errorMsg = e.Message;
                    }
                }

            }

            return false;

        }

        public MessageEntity GetFunction() {
            string errorMsg = "";
            string query = " select * from P_Function ";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
                {
                    List<dynamic> eventType = conn.Query<dynamic>(query).ToList();

                    return MessageEntityTool.GetMessage(eventType.Count(), eventType, true, "", eventType.Count());
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
        }

        public MessageEntity PostFunction(P_Function function)
        {
            base.InsertEntity(function, ConnectionFactory.DBConnNames.GisPlateform, out MessageEntity messageEntity);
            return messageEntity;
        }

        public MessageEntity DeleteFunction(int funId)
        {
            base.DeleteEntity(new P_Function { iFunID=funId }, ConnectionFactory.DBConnNames.GisPlateform, out MessageEntity messageEntity);
            return messageEntity;
        }
    }
}

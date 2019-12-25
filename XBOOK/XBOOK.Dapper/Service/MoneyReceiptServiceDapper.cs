using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Dapper.Service
{
    public class MoneyReceiptServiceDapper: IMoneyReceiptDapper
    {
        private readonly IConfiguration _configuration;
        public MoneyReceiptServiceDapper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<MoneyReceiptViewModel>> GetMoneyReceipt(MoneyReceiptRequest request)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@searchString", request.Keyword);
                dynamicParameters.Add("@fromDate", request.StartDate);
                dynamicParameters.Add("@toDate", request.EndDate);
                dynamicParameters.Add("@Currency", request.Currency);

                try
                {
                    return await sqlConnection.QueryAsync<MoneyReceiptViewModel>(
                        "MoneyReceiptList", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }
    }
}

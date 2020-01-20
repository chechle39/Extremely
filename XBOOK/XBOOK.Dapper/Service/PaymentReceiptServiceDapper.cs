using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;


namespace XBOOK.Dapper.Service
{
    public class PaymentReceiptServiceDapper : IPaymentReceiptServiceDapper
    {
        private readonly IConfiguration _configuration;
        public PaymentReceiptServiceDapper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<PaymentReceiptViewModel>> GetPaymentReceipt(MoneyReceiptRequest request)
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
                    return await sqlConnection.QueryAsync<PaymentReceiptViewModel>(
                        "PaymentReceiptList", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }
    }
}

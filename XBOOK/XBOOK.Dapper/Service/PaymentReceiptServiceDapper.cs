using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;


namespace XBOOK.Dapper.Service
{
    public class PaymentReceiptServiceDapper : IPaymentReceiptServiceDapper
    {

        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public PaymentReceiptServiceDapper(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<IEnumerable<PaymentReceiptViewModel>> GetPaymentReceipt(MoneyReceiptRequest request)
        {
            var Code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString(Code)))
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

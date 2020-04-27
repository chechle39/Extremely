using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.EntitiesDBCommon;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Dapper.Service
{
    public class MoneyReceiptServiceDapper: IMoneyReceiptDapper
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MoneyReceiptServiceDapper(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<MoneyReceiptViewModel>> GetMoneyReceipt(MoneyReceiptRequest request)
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

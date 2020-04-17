using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Dapper.Service
{
    public class MoneyReceiptServiceDapper: IMoneyReceiptDapper
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserCommonRepository _userCommonRepository;
        public MoneyReceiptServiceDapper(IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IUserCommonRepository userCommonRepository)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _userCommonRepository = userCommonRepository;
        }

        public async Task<IEnumerable<MoneyReceiptViewModel>> GetMoneyReceipt(MoneyReceiptRequest request)
        {
            var code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")).ToList()[0].Value;
            var findUser = await _userCommonRepository.FindUserCommon(code);
            using (var sqlConnection = new SqlConnection(findUser.ConnectionString))
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

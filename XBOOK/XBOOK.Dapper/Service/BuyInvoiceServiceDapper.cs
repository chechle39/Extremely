using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Service
{
    public class BuyInvoiceServiceDapper: IBuyInvoiceServiceDapper
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserCommonRepository _userCommonRepository;
        public BuyInvoiceServiceDapper(IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IUserCommonRepository userCommonRepository)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _userCommonRepository = userCommonRepository;
        }

        public async Task<IEnumerable<BuyInvoiceViewModel>> GetBuyInvoice(SaleInvoiceListRequest request)
        {
            var code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")).ToList()[0].Value;
            var findUser = await _userCommonRepository.FindUserCommon(code);
            using (var sqlConnection = new SqlConnection(findUser.ConnectionString))
            {
                if (!string.IsNullOrEmpty(request.StartDate) && !string.IsNullOrEmpty(request.EndDate))
                {
                    //DateTime start = DateTime.ParseExact(request.StartDate, "MM/dd/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                    //DateTime end = DateTime.ParseExact(request.EndDate, "MM/dd/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@searchString", request.Keyword);
                    dynamicParameters.Add("@fromDate", request.StartDate);
                    dynamicParameters.Add("@toDate", request.EndDate);
                    dynamicParameters.Add("@isIssueDate", request.isIssueDate);
                    return await sqlConnection.QueryAsync<BuyInvoiceViewModel>(
                       "GetBuyInvoiceList", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
                else
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@searchString", request.Keyword);
                    dynamicParameters.Add("@fromDate", null);
                    dynamicParameters.Add("@toDate", null);
                    dynamicParameters.Add("@isIssueDate", request.isIssueDate);
                    return await sqlConnection.QueryAsync<BuyInvoiceViewModel>(
                       "GetBuyInvoiceList", dynamicParameters, commandType: CommandType.StoredProcedure);
                }

            }
        }
    }
}

using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Dapper.Service
{
    public class TaxBuyInvoiceServiceDapper : ITaxBuyInvoiceServiceDapper
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;
        private readonly IUserCommonRepository _userCommonRepository;

        public TaxBuyInvoiceServiceDapper(IHttpContextAccessor httpContextAccessor, IMemoryCache cache, IUserCommonRepository userCommonRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _cache = cache;
            _userCommonRepository = userCommonRepository;
        }

        public async Task<IEnumerable<TaxBuyInvoiceViewModel>> GetTaxBuyInvoiceAsync(SaleInvoiceListRequest request)
        {
            var connect = new XBOOK.Dapper.helpers.connect(_httpContextAccessor, _cache, _userCommonRepository);
            var connectString = connect.ConnectString();
            using (var sqlConnection = new SqlConnection(connectString))
            {
                if (!string.IsNullOrEmpty(request.StartDate) && !string.IsNullOrEmpty(request.EndDate))
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@searchString", request.Keyword);
                    dynamicParameters.Add("@fromDate", request.StartDate);
                    dynamicParameters.Add("@toDate", request.EndDate);
                    dynamicParameters.Add("@isIssueDate", request.isIssueDate);
                    dynamicParameters.Add("@getDebtOnly", request.getDebtOnly);
                    return await sqlConnection.QueryAsync<TaxBuyInvoiceViewModel>(
                       "GetTaxInvoiceList", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
                else
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@searchString", request.Keyword);
                    dynamicParameters.Add("@fromDate", null);
                    dynamicParameters.Add("@toDate", null);
                    dynamicParameters.Add("@isIssueDate", request.isIssueDate);
                    dynamicParameters.Add("@getDebtOnly", request.getDebtOnly);
                    return await sqlConnection.QueryAsync<TaxBuyInvoiceViewModel>(
                      "GetTaxBuyInvoiceList", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
            }
        }

    }
}

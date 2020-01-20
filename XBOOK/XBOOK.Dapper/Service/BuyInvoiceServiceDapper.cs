using Dapper;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Service
{
    public class BuyInvoiceServiceDapper: IBuyInvoiceServiceDapper
    {
        private readonly IConfiguration _configuration;

        public BuyInvoiceServiceDapper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<BuyInvoiceViewModel>> GetBuyInvoice(SaleInvoiceListRequest request)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
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

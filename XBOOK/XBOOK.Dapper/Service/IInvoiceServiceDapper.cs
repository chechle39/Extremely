using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Service
{
    public class InvoiceServiceDapper : IInvoiceServiceDapper
    {
        private readonly IConfiguration _configuration;

        public InvoiceServiceDapper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<InvoiceViewModel>> GetInvoiceAsync(SaleInvoiceListRequest request)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                if(!string.IsNullOrEmpty(request.StartDate) && !string.IsNullOrEmpty(request.EndDate))
                {
                    //DateTime start = DateTime.ParseExact(request.StartDate, "MM/dd/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                    //DateTime end = DateTime.ParseExact(request.EndDate, "MM/dd/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@searchString", request.Keyword);
                    dynamicParameters.Add("@fromDate", request.StartDate);
                    dynamicParameters.Add("@toDate", request.EndDate);
                    dynamicParameters.Add("@isIssueDate", request.isIssueDate);
                    return await sqlConnection.QueryAsync<InvoiceViewModel>(
                       "GetInvoiceList", dynamicParameters, commandType: CommandType.StoredProcedure);
                }else
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@searchString", request.Keyword);
                    dynamicParameters.Add("@fromDate", null);
                    dynamicParameters.Add("@toDate", null);
                    dynamicParameters.Add("@isIssueDate", request.isIssueDate);
                    return await sqlConnection.QueryAsync<InvoiceViewModel>(
                       "GetInvoiceList", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
               
            }
        }
    }
}

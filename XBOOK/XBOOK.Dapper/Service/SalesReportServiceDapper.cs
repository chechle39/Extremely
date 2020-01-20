using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Service
{
    public class SalesReportServiceDapper : ISalesReportServiceDapper
    {
        private readonly IConfiguration _configuration;
        public SalesReportServiceDapper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<SalesReportViewodel>> GetISalesDataReportServiceDapperAsync(SalesReportModelSearchRequest request)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {

                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    var results = new List<SalesReportGroupViewModel>();
                    dynamicParameters.Add("@productName", request.ProductName);
                    dynamicParameters.Add("@fromDate", request.StartDate);
                    dynamicParameters.Add("@toDate", request.EndDate);
                    dynamicParameters.Add("@Currency", request.Client);
                    return await sqlConnection.QueryAsync<SalesReportViewodel>(
                       "Book_SalesReport", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
            }
        }
        public async Task<IEnumerable<SalesReportGroupViewModel>> GetISalesReportServiceDapperAsync(SalesReportModelSearchRequest request)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {

                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    var results = new List<SalesReportGroupViewModel>();
                    dynamicParameters.Add("@productName", request.ProductName);
                    dynamicParameters.Add("@fromDate", request.StartDate);
                    dynamicParameters.Add("@toDate", request.EndDate);
                    dynamicParameters.Add("@Currency", request.Client);
                    var res = await sqlConnection.QueryAsync<SalesReportViewodel>(
                       "Book_SalesReport", dynamicParameters, commandType: CommandType.StoredProcedure);
                    List<SalesReportViewodel> salesReportViewodel = res.ToList();
                    var results1 = from p in salesReportViewodel
                                   group p by p.ProductName into g
                                   select new { productName = g.Key, SalesReportListData = g.ToList(), TotalAmount = g.Sum(x => x.Amount), TotalDiscount = g.Sum(x => x.Discount), TotalPayment = g.Sum(x => x.Payment) };
                    foreach (var item in results1)
                    {
                        var yy = new SalesReportGroupViewModel()
                        {
                            productName = item.productName,
                            TotalDiscount = item.TotalDiscount,
                            totalAmount = item.TotalAmount,
                            totalPayment = item.TotalPayment,
                            SalesReportListData = item.SalesReportListData,
                        };
                        results.Add(yy);
                    }
                    return results;
                }
                
            }
        }
    }
}

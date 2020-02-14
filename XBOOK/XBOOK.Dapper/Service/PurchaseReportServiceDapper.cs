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
    public class PurchaseReportServiceDapper : IPurchaseReportDapper
    {
        private readonly IConfiguration _configuration;
        public PurchaseReportServiceDapper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<PurchaseReportViewModel>> GetAllPurchaseReportAsync(PurchaseReportSerchRequest request)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {

                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();                   
                    dynamicParameters.Add("@supplier", request.Supplier);
                    dynamicParameters.Add("@fromDate", request.StartDate);
                    dynamicParameters.Add("@toDate", request.EndDate);
                    dynamicParameters.Add("@productServices", request.ProductName);
                    return await sqlConnection.QueryAsync<PurchaseReportViewModel>(
                       "Book_PurchaseReport", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
            }
        }
        public async Task<IEnumerable<PurchaseReportGroupViewModel>> GetPurchaseReportGroupAsync(PurchaseReportSerchRequest request)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {

                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    var results = new List<PurchaseReportGroupViewModel>();
                    dynamicParameters.Add("@supplier", request.Supplier);
                    dynamicParameters.Add("@fromDate", request.StartDate);
                    dynamicParameters.Add("@toDate", request.EndDate);
                    dynamicParameters.Add("@productServices", request.ProductName);
                    var res = await sqlConnection.QueryAsync<PurchaseReportViewModel>(
                       "Book_PurchaseReport", dynamicParameters, commandType: CommandType.StoredProcedure);
                    List<PurchaseReportViewModel> salesReportViewodel = res.ToList();
                    var results1 = from p in salesReportViewodel
                                   group p by p.ProductName into g
                                   select new { productName = g.Key, PurchaseReportListData = g.ToList(), TotalAmount = g.Sum(x => x.Amount), TotalDiscount = g.Sum(x => x.Discount), TotalPayment = g.Sum(x => x.Payment) };
                    foreach (var item in results1)
                    {
                        var yy = new PurchaseReportGroupViewModel()
                        {
                            productName = item.productName,
                            TotalDiscount = item.TotalDiscount,
                            totalAmount = item.TotalAmount,
                            totalPayment = item.TotalPayment,
                            PurchaseReportListData = item.PurchaseReportListData,
                        };
                        results.Add(yy);
                    }
                    return results;
                }
                
            }
        }

    }
}

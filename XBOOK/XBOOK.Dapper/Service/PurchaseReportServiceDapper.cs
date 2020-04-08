using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Service
{
    public class PurchaseReportServiceDapper : IPurchaseReportDapper
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public PurchaseReportServiceDapper(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<PurchaseReportViewModel>> GetAllPurchaseReportAsync(PurchaseReportSerchRequest request)
        {
            var Code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString(Code)))
            {
                string deltaFrom = request.StartDate;
                DateTime fromDate = DateTime.Parse(deltaFrom, new CultureInfo("en-GB"));
                string deltaTo = request.EndDate;
                DateTime toDate = DateTime.Parse(deltaTo, new CultureInfo("en-GB"));

                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    if (request.Product != null && request.Client != null)
                    {
                        dynamicParameters.Add("@productName", request.Product);
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                        dynamicParameters.Add("@supplierName", request.Client);
                    }
                    else if (request.Product == null && request.Client != null)
                    {
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                        dynamicParameters.Add("@supplierName", request.Client);
                    }
                    else if (request.Client == null && request.Product != null)
                    {
                        dynamicParameters.Add("@productName", request.Product);
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                    }
                    else
                    {
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                    }
                    try
                    {
                        return await sqlConnection.QueryAsync<PurchaseReportViewModel>(
                          "Book_PurchaseReport", dynamicParameters, commandType: CommandType.StoredProcedure);
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                    
                }
            }
        }
        public async Task<IEnumerable<PurchaseReportGroupViewModel>> GetPurchaseReportGroupAsync(PurchaseReportSerchRequest request)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                string deltaFrom = request.StartDate;
                DateTime fromDate = DateTime.Parse(deltaFrom, new CultureInfo("en-GB"));
                string deltaTo = request.EndDate;
                DateTime toDate = DateTime.Parse(deltaTo, new CultureInfo("en-GB"));
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    var results = new List<PurchaseReportGroupViewModel>();
                    if (request.Product != null && request.Client != null)
                    {
                        dynamicParameters.Add("@productName", request.Product);
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                        dynamicParameters.Add("@supplierName", request.Client);
                    }
                    else if (request.Product == null && request.Client != null)
                    {
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                        dynamicParameters.Add("@supplierName", request.Client);
                    }
                    else if (request.Client == null && request.Product != null)
                    {
                        dynamicParameters.Add("@productName", request.Product);
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                    }
                    else
                    {
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                    }
                   
                        var res = await sqlConnection.QueryAsync<PurchaseReportViewModel>(
                      "Book_PurchaseReport", dynamicParameters, commandType: CommandType.StoredProcedure);
                        List<PurchaseReportViewModel> salesReportViewodel = res.ToList();
                        var results1 = from p in salesReportViewodel
                                       group p by p.ProductName into g
                                       select new { productName = g.Key, PurchaseReportListData = g.ToList(), TotalAmount = g.Sum(x => x.Amount), TotalDiscount = g.Sum(x => x.Discount), TotalQuantity = g.Sum(x => x.Quantity) };
                        foreach (var item in results1)
                        {
                            var yy = new PurchaseReportGroupViewModel()
                            {
                                productName = item.productName,
                                TotalDiscount = item.TotalDiscount,
                                totalAmount = item.TotalAmount,
                                totalQuantity = item.TotalQuantity,
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

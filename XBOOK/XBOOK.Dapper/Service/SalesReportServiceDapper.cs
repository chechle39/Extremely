using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Service
{
    public class SalesReportServiceDapper : ISalesReportServiceDapper
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;
        private readonly IUserCommonRepository _userCommonRepository;

        public SalesReportServiceDapper(IHttpContextAccessor httpContextAccessor, IMemoryCache cache, IUserCommonRepository userCommonRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _cache = cache;
            _userCommonRepository = userCommonRepository;
        }
        public async Task<IEnumerable<SalesReportViewModel>> GetISalesDataReportServiceDapperAsync(SalesReportModelSearchRequest request)
        {
            var connect = new XBOOK.Dapper.helpers.connect(_httpContextAccessor, _cache, _userCommonRepository);
            var connectString = connect.ConnectString();
            using (var sqlConnection = new SqlConnection(connectString))
            {
                string deltaFrom = request.StartDate;
                DateTime fromDate = DateTime.Parse(deltaFrom, new CultureInfo("en-GB"));
                string deltaTo = request.EndDate;
                DateTime toDate = DateTime.Parse(deltaTo, new CultureInfo("en-GB"));
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    var results = new List<SalesReportGroupViewModel>();
                    if (request.Product != null && request.Client != null)
                    {
                        dynamicParameters.Add("@productName", request.Product);
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                        dynamicParameters.Add("@clientName", request.Client);
                    }
                    else if (request.Product == null && request.Client != null)
                    {
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                        dynamicParameters.Add("@clientName", request.Client);
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
                    return await sqlConnection.QueryAsync<SalesReportViewModel>(
                       "Book_SalesReport", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
            }
        }
        public async Task<IEnumerable<SalesReportGroupViewModel>> GetISalesReportServiceDapperAsync(SalesReportModelSearchRequest request)
        {
            var connect = new XBOOK.Dapper.helpers.connect(_httpContextAccessor, _cache, _userCommonRepository);
            var connectString = connect.ConnectString();
            using (var sqlConnection = new SqlConnection(connectString))
            {
                string deltaFrom = request.StartDate;
                DateTime fromDate = DateTime.Parse(deltaFrom, new CultureInfo("en-GB"));
                string deltaTo = request.EndDate;
                DateTime toDate = DateTime.Parse(deltaTo, new CultureInfo("en-GB"));
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    var results = new List<SalesReportGroupViewModel>();
                    if (request.Product != null && request.Client != null)
                    {
                        dynamicParameters.Add("@productName", request.Product);
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                        dynamicParameters.Add("@clientName", request.Client);
                    }
                    else if (request.Product == null && request.Client != null)
                    {
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                        dynamicParameters.Add("@clientName", request.Client);
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


                    var res = await sqlConnection.QueryAsync<SalesReportViewModel>(
                       "Book_SalesReport", dynamicParameters, commandType: CommandType.StoredProcedure);
                    List<SalesReportViewModel> salesReportViewodel = res.ToList();
                    var results1 = from p in salesReportViewodel
                                   group p by p.ProductName into g
                                   select new { productName = g.Key, SalesReportListData = g.ToList(), TotalQuantity = g.Sum(x => x.Quantity), TotalDiscount = g.Sum(x => x.Discount), TotalAmount = g.Sum(x => x.Amount) };
                    foreach (var item in results1)
                    {
                        var yy = new SalesReportGroupViewModel()
                        {
                            productName = item.productName,
                            TotalDiscount = item.TotalDiscount,
                            totalAmount = item.TotalAmount,
                            TotalQuantity = item.TotalQuantity,
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

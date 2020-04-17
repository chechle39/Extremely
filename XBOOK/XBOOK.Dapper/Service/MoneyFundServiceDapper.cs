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
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Service
{
    public class MoneyFundServiceDapper : IMoneyFundServiceDapper
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserCommonRepository _userCommonRepository;
        public MoneyFundServiceDapper(IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IUserCommonRepository userCommonRepository)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _userCommonRepository = userCommonRepository;
        }

        public async Task<IEnumerable<MoneyFundViewModel>> GetIMoneyFundDapperReportServiceDapperAsync(MoneyFundRequest request)
        {
            var code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")).ToList()[0].Value;
            var findUser = await _userCommonRepository.FindUserCommon(code);
            using (var sqlConnection = new SqlConnection(findUser.ConnectionString))
            {
                string deltaFrom = request.StartDate;
                DateTime fromDate = DateTime.Parse(deltaFrom, new CultureInfo("en-GB"));
                string deltaTo = request.EndDate;
                DateTime toDate = DateTime.Parse(deltaTo, new CultureInfo("en-GB"));
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();                              
                    dynamicParameters.Add("@fromDate", fromDate);
                    dynamicParameters.Add("@toDate", toDate);
                    dynamicParameters.Add("@currency", request.Currency); 
                    return await sqlConnection.QueryAsync<MoneyFundViewModel>(
                       "Book_CashBalance", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
            }
        }

        public async Task<IEnumerable<MoneyFundViewModelGroupViewModel>> GetIMoneyFundDapperServiceDapperAsync(MoneyFundRequest request)
        {
            var code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")).ToList()[0].Value;
            var findUser = await _userCommonRepository.FindUserCommon(code);
            using (var sqlConnection = new SqlConnection(findUser.ConnectionString))
            {
                string deltaFrom = request.StartDate;
                DateTime fromDate = DateTime.Parse(deltaFrom, new CultureInfo("en-GB"));
                string deltaTo = request.EndDate;
                DateTime toDate = DateTime.Parse(deltaTo, new CultureInfo("en-GB"));
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    var results = new List<MoneyFundViewModelGroupViewModel>();                   
                    dynamicParameters.Add("@fromDate", fromDate);
                    dynamicParameters.Add("@toDate", toDate);
                    dynamicParameters.Add("@currency", request.Currency);
                    var res = await sqlConnection.QueryAsync<MoneyFundViewModel>(
                       "Book_CashBalance", dynamicParameters, commandType: CommandType.StoredProcedure);
                    List<MoneyFundViewModel> salesReportViewodel = res.ToList();
                    var results1 = from p in salesReportViewodel
                                   group p by p.CashType into g
                                   select new { CashType = g.Key, MoneyFundDataListData = g.ToList(), totalReceive = g.Sum(x => x.Receive), TotalPay = g.Sum(x => x.Pay), totalClosingBalance = g.Sum(x => x.ClosingBalance) };
                    foreach (var item in results1)
                    {
                        var yy = new MoneyFundViewModelGroupViewModel()
                        {
                            CashType = item.CashType,
                            totalReceive = item.totalReceive,
                            TotalPay = item.TotalPay,
                            totalClosingBalance = item.totalClosingBalance,
                            MoneyFundData = item.MoneyFundDataListData,
                        };
                        results.Add(yy);
                    }
                    return results;
                }

            }
        }

    }
}

﻿using Dapper;
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
    public class MoneyFundServiceDapper : IMoneyFundServiceDapper
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MoneyFundServiceDapper(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<MoneyFundViewModel>> GetIMoneyFundDapperReportServiceDapperAsync(MoneyFundRequest request)
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
                    dynamicParameters.Add("@fromDate", fromDate);
                    dynamicParameters.Add("@toDate", toDate);                  
                    return await sqlConnection.QueryAsync<MoneyFundViewModel>(
                       "Book_MoneyFund", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
            }
        }

        public async Task<IEnumerable<MoneyFundViewModelGroupViewModel>> GetIMoneyFundDapperServiceDapperAsync(MoneyFundRequest request)
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
                    var results = new List<MoneyFundViewModelGroupViewModel>();                   
                    dynamicParameters.Add("@fromDate", fromDate);
                    dynamicParameters.Add("@toDate", toDate);                   
                    var res = await sqlConnection.QueryAsync<MoneyFundViewModel>(
                       "Book_MoneyFund", dynamicParameters, commandType: CommandType.StoredProcedure);
                    List<MoneyFundViewModel> salesReportViewodel = res.ToList();
                    var results1 = from p in salesReportViewodel
                                   group p by p.MoneyFund into g
                                   select new { MoneyFund = g.Key, MoneyFundDataListData = g.ToList(), totalCollectMoney = g.Sum(x => x.CollectMoney), TotalPayMoney = g.Sum(x => x.PayMoney), totalResidualFund = g.Sum(x => x.ResidualFund) };
                    foreach (var item in results1)
                    {
                        var yy = new MoneyFundViewModelGroupViewModel()
                        {
                            MoneyFund = item.MoneyFund,
                            totalCollectMoney = item.totalCollectMoney,
                            TotalPayMoney = item.TotalPayMoney,
                            totalResidualFund = item.totalResidualFund,
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
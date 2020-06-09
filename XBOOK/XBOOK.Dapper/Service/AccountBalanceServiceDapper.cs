using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
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
using XBOOK.Data.EntitiesDBCommon;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Service
{
    public class AccountBalanceServiceDapper : IAccountBalanceServiceDapper
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;
        private readonly IUserCommonRepository _userCommonRepository;

        public AccountBalanceServiceDapper( IHttpContextAccessor httpContextAccessor, IMemoryCache cache, IUserCommonRepository userCommonRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _cache = cache;
            _userCommonRepository = userCommonRepository;
        }

        public async Task<IEnumerable<AccountBalanceViewModel>> GetAccountBalanceAcountAsync(AccountBalanceAccNumberSerchRequest request)
        {
            var connect = new XBOOK.Dapper.helpers.connect(_httpContextAccessor, _cache, _userCommonRepository);
            var connectString = connect.ConnectString();
            using (var sqlConnection = new SqlConnection(connectString))
            {
                if (!string.IsNullOrEmpty(request.StartDate) && !string.IsNullOrEmpty(request.EndDate))
                {
                    string deltaFrom = request.StartDate;
                    DateTime fromDate = DateTime.Parse(deltaFrom, new CultureInfo("en-GB"));
                    string deltaTo = request.EndDate;
                    DateTime toDate = DateTime.Parse(deltaTo, new CultureInfo("en-GB"));
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@Currency", request.Currency);
                    dynamicParameters.Add("@fromDate", fromDate);
                    dynamicParameters.Add("@toDate", toDate);
                    var res = await sqlConnection.QueryAsync<AccountBalanceViewModel>(
                       "Book_AccountBalance", dynamicParameters, commandType: CommandType.StoredProcedure);
                    return res.Where(x => x.accNumber == request.accountNumber);
                }
                else
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@Currency", null);
                    dynamicParameters.Add("@fromDate", null);
                    dynamicParameters.Add("@toDate", null);
                    var res = await sqlConnection.QueryAsync<AccountBalanceViewModel>(
                      "Book_AccountBalance", dynamicParameters, commandType: CommandType.StoredProcedure);
                    return res.Where(x => x.accNumber == request.accountNumber);
                }
            }
        }

        public async Task<IEnumerable<AccountBalanceViewModel>> GetAccountBalanceAsync(AccountBalanceSerchRequest request)
        {
            var connect = new XBOOK.Dapper.helpers.connect(_httpContextAccessor, _cache, _userCommonRepository);
            var connectString = connect.ConnectString();
            using (var sqlConnection = new SqlConnection(connectString))
            {
                string deltaFrom = request.StartDate;
                DateTime fromDate = DateTime.Parse(deltaFrom, new CultureInfo("en-GB"));
                string deltaTo = request.EndDate;
                DateTime toDate = DateTime.Parse(deltaTo,new CultureInfo("en-GB"));
               
                if (!string.IsNullOrEmpty(request.StartDate) && !string.IsNullOrEmpty(request.EndDate))
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();                  
                    dynamicParameters.Add("@Currency", request.Currency);
                    dynamicParameters.Add("@fromDate", fromDate);
                    dynamicParameters.Add("@toDate", toDate);
                    return await sqlConnection.QueryAsync<AccountBalanceViewModel>(
                       "Book_AccountBalance", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
                else
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();                   
                    dynamicParameters.Add("@Currency", null);
                    dynamicParameters.Add("@fromDate", null);
                    dynamicParameters.Add("@toDate", null);
                    return await sqlConnection.QueryAsync<AccountBalanceViewModel>(
                       "Book_AccountBalance", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
            }
        }
    }
}

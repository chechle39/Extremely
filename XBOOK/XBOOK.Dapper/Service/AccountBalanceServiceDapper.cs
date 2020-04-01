using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Service
{
    public class AccountBalanceServiceDapper : IAccountBalanceServiceDapper
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public AccountBalanceServiceDapper(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<AccountBalanceViewModel>> GetAccountBalanceAcountAsync(AccountBalanceAccNumberSerchRequest request)
        {
            var Code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString(Code)))
            {
                if (!string.IsNullOrEmpty(request.StartDate) && !string.IsNullOrEmpty(request.EndDate))
                {
                    string deltaFrom = request.StartDate;
                    DateTime fromDate = DateTime.Parse(deltaFrom, new CultureInfo("en-GB"));
                    string deltaTo = request.EndDate;
                    DateTime toDate = DateTime.Parse(deltaTo, new CultureInfo("en-GB"));
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@accountNumber", request.accountNumber);                  
                    dynamicParameters.Add("@fromDate", fromDate);
                    dynamicParameters.Add("@toDate", toDate);
                    dynamicParameters.Add("@Currency", request.Currency);
                    return await sqlConnection.QueryAsync<AccountBalanceViewModel>(
                       "AccountBalance", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
                else
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@accountNumber", request.accountNumber);
                    dynamicParameters.Add("@fromDate", null);
                    dynamicParameters.Add("@toDate", null);
                    dynamicParameters.Add("@Currency", null);
                    return await sqlConnection.QueryAsync<AccountBalanceViewModel>(
                       "AccountBalance", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
            }
        }

        public async Task<IEnumerable<AccountBalanceViewModel>> GetAccountBalanceAsync(AccountBalanceSerchRequest request)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
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

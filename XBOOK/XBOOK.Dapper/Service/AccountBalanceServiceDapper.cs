using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
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
        public AccountBalanceServiceDapper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<AccountBalanceViewModel>> GetAccountBalanceAcountAsync(AccountBalanceAccNumberSerchRequest request)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {

                if (!string.IsNullOrEmpty(request.StartDate) && !string.IsNullOrEmpty(request.EndDate))
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@accountNumber", request.accountNumber);                  
                    dynamicParameters.Add("@fromDate", request.StartDate);
                    dynamicParameters.Add("@toDate", request.EndDate);
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

                if (!string.IsNullOrEmpty(request.StartDate) && !string.IsNullOrEmpty(request.EndDate))
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@Currency", request.Currency);
                    dynamicParameters.Add("@fromDate", request.StartDate);
                    dynamicParameters.Add("@toDate", request.EndDate);
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

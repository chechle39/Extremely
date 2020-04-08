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
    public class AccountDetailServiceDapper : IAccountDetailServiceDapper
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public AccountDetailServiceDapper(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<AccountDetailGroupViewModel>> GetAccountDetailAsync(AccountDetailSerchRequest request)
        {
            //var Code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                string deltaFrom = request.StartDate;
                DateTime fromDate = DateTime.Parse(deltaFrom, new CultureInfo("en-GB"));
                string deltaTo = request.EndDate;
                DateTime toDate = DateTime.Parse(deltaTo, new CultureInfo("en-GB"));
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    var results = new List<AccountDetailGroupViewModel>();
                    if (request.accountNumber != null && request.client != null)
                    {
                        dynamicParameters.Add("@accountNumber", request.accountNumber);
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                        dynamicParameters.Add("@Client", request.client);
                    }
                    else if (request.accountNumber == null && request.client != null)
                    {
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                        dynamicParameters.Add("@Client", request.client);
                    }
                    else if (request.client == null && request.accountNumber != null)
                    {
                        dynamicParameters.Add("@accountNumber", request.accountNumber);
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                    }
                    else
                    {
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                    }
                    var res = await sqlConnection.QueryAsync<AccountDetailViewModel>(
                    "Book_AccountDetail", dynamicParameters, commandType: CommandType.StoredProcedure);                   
                    List<AccountDetailViewModel> salesReportViewodel = res.ToList();
                    var results1 = from p in salesReportViewodel
                                   group p by p.companyName into g
                                   select new { companyName = g.Key, accountNumber = g.Key, SalesReportListData = g.ToList(),  totaCredit = g.Sum(x => x.Credit), totalDebit = g.Sum(x => x.Debit), totalCreditClosing = g.Sum(x => x.CreditClosing), totalDebitClosing = g.Sum(x => x.DebitClosing), totalDebitOpening = g.Sum(x => x.DebitOpening), totalCreditOpening = g.Sum(x => x.CreditOpening) };
                    foreach (var item in results1)
                    {
                        var yy = new AccountDetailGroupViewModel()
                        {                       
                            companyName = item.companyName,
                            totalDebit = item.totalDebit,
                            accountNumber = item.SalesReportListData[0].accountNumber,
                            accountName = item.SalesReportListData[0].accountName,
                            totalCredit = item.totaCredit,
                            totalDebitClosing = item.totalDebitClosing,
                            totalCreditClosing = item.totalCreditClosing,
                            totalCreditOpening = item.totalCreditOpening,
                            totalDebitOpening = item.totalDebitOpening,
                            AccountDetailViewModel = item.SalesReportListData
                        };
                        results.Add(yy);
                    }
                    return results;
                }

            }
        }

        public async Task<IEnumerable<AccountDetailViewModel>> GetAccountDetailReportAsync(AccountDetailSerchRequest request)
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
                    if (request.accountNumber != null && request.client != null)
                    {
                        dynamicParameters.Add("@accountNumber", request.accountNumber);
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                        dynamicParameters.Add("@Client", request.client);
                    }
                    else if (request.accountNumber == null && request.client != null)
                    {
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                        dynamicParameters.Add("@Client", request.client);
                    }
                    else if (request.client == null && request.accountNumber != null)
                    {
                        dynamicParameters.Add("@accountNumber", request.accountNumber);
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                    }
                    else
                    {
                        dynamicParameters.Add("@fromDate", fromDate);
                        dynamicParameters.Add("@toDate", toDate);
                    }
                    return await sqlConnection.QueryAsync<AccountDetailViewModel>(
                       "Book_AccountDetail", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
            }
        }

    }
}

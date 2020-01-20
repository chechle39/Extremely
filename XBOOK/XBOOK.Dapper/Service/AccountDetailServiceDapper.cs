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
    public class AccountDetailServiceDapper : IAccountDetailServiceDapper
    {
        private readonly IConfiguration _configuration;
        public AccountDetailServiceDapper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<AccountDetailGroupViewModel>> GetAccountDetailAsync(AccountDetailSerchRequest request)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {

                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    var results = new List<AccountDetailGroupViewModel>();
                    dynamicParameters.Add("@accountName", request.accountNumber);
                    dynamicParameters.Add("@fromDate", request.StartDate);
                    dynamicParameters.Add("@toDate", request.EndDate);
                    dynamicParameters.Add("@Client", request.client);
                    var res = await sqlConnection.QueryAsync<AccountDetailViewModel>(
                    "Book_AccountDetail", dynamicParameters, commandType: CommandType.StoredProcedure);                   
                    List<AccountDetailViewModel> salesReportViewodel = res.ToList();
                    var results1 = from p in salesReportViewodel
                                   group p by p.companyName into g
                                   select new { companyName = g.Key, accountNumber = g.Key, SalesReportListData = g.ToList(),  totaCredit = g.Sum(x => x.Credit), totalDebit = g.Sum(x => x.Debit), totalCreditClosing = g.Sum(x => x.CreditClosing), totalDebitClosing = g.Sum(x => x.DebitClosing) };
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

                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@accountName", request.accountNumber);
                    dynamicParameters.Add("@fromDate", request.StartDate);
                    dynamicParameters.Add("@toDate", request.EndDate);
                    dynamicParameters.Add("@Client", request.client);
                    return await sqlConnection.QueryAsync<AccountDetailViewModel>(
                       "Book_AccountDetail", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
            }
        }

    }
}

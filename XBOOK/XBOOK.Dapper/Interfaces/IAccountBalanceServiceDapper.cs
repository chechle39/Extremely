using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Interfaces
{
    public interface IAccountBalanceServiceDapper
    {
        Task<IEnumerable<AccountBalanceViewModel>> GetAccountBalanceAsync(AccountBalanceSerchRequest request);
        Task<IEnumerable<AccountBalanceViewModel>> GetAccountBalanceAcountAsync(AccountBalanceAccNumberSerchRequest request);
    }
}

using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IAccountBalanceRepository : IRepository<AccountBalance>
    {
      
        Task<IEnumerable<AccountBalanceViewModel>> GetAllAccountBalanceAsync(AccountBalanceSerchRequest request);
    }
}

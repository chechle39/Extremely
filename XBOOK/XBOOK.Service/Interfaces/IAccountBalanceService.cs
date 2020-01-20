using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IAccountBalanceService
    {
        
        Task<IEnumerable<AccountBalanceViewModel>> GetAllAccountBalanceAsync(AccountBalanceSerchRequest request);
     

    }
}

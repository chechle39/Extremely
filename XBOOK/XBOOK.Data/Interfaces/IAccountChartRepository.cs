using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IAccountChartRepository
    {
        Task<bool> CreateAccountChartAsync(AccountChartViewModel accountChartViewModel);
        Task<bool> DeleteAccount(Acc accountNumber);
        Task<bool> Update(AccountChartViewModel accountChartViewModel);

    }
}

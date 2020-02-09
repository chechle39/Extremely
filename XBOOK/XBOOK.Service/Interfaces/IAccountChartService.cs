using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Service;

namespace XBOOK.Service.Interfaces
{
    public interface IAcountChartService
    {
        Task<List<AccountChartViewModel>> GetAllAccount();
        Task<List<TreeNode>> GetAllTreeAccountAsync();
        Task<bool> CreateAccountChartAsync(AccountChartViewModel accountChartViewModel);
        Task<bool> DeleteAccount(Acc accountNumber);
        Task<bool> Update(AccountChartViewModel accountChartViewModel);

    }
}

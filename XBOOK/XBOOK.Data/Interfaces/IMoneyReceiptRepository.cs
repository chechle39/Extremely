using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IMoneyReceiptRepository
    {
        Task<bool> CreateMoneyReceipt(MoneyReceiptViewModel request);
        Task<bool> Deleted(List<requestDeleted> request);
        Task<MoneyReceiptViewModel> GetLastMoneyReceipt();
        Task<bool> Update(MoneyReceiptViewModel request);
        Task<MoneyReceiptViewModel> GetMoneyByIdAsync(MoneyReceiptID request);
        Task<MoneyReceiptByIdViewModel> GetMoneyByIdObject(long id);
    }
}

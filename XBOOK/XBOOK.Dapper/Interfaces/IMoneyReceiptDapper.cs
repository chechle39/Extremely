using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Dapper.Interfaces
{
    public interface IMoneyReceiptDapper
    {
        Task<IEnumerable<MoneyReceiptViewModel>> GetMoneyReceipt(MoneyReceiptRequest request);
    }
}

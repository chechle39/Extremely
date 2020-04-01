using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IPaymentRepository
    {
        Task<bool> DeletedPaymentAsync(string request);
        Task<bool> UpdatePaymentByReceiptNumbe (MoneyReceiptViewModel request);
    }
}

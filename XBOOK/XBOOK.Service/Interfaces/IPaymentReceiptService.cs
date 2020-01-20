using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IPaymentReceiptService
    {
        Task<bool> CreatePaymentReceipt(PaymentReceiptViewModel request);
        Task<bool> DeletedPaymentReceipt(List<requestDeleted> request);
        Task<PaymentReceiptViewModel> GetLastPaymentReceipt();
        Task<bool> CreatePaymentReceiptPaymentAsync(PaymentReceiptPayment request);
        Task<bool> Update(PaymentReceiptViewModel request);
    }
}

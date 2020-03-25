using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IPaymentReceiptRepository
    {
        Task<bool> CreatePayMentReceipt(PaymentReceiptViewModel request);
        Task<bool> Deleted(List<requestDeleted> request);
        Task<PaymentReceiptViewModel> GetLastPayMentReceipt();
        Task<bool> Update(PaymentReceiptViewModel request);
        Task<PaymentReceiptViewModel> GetPayMentId(long Id);
        Task<PaymentReceiptByIdViewModel> GetPaymentReceiptById(long id);
    }
}

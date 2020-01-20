using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Dapper.Interfaces
{
    public interface IPaymentReceiptServiceDapper
    {
        Task<IEnumerable<PaymentReceiptViewModel>> GetPaymentReceipt(MoneyReceiptRequest request);

    }
}

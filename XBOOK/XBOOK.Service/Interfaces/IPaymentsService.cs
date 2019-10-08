using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IPaymentsService
    {
        bool SavePayMent(PaymentViewModel saleInvoiceViewModel);
        Task RemovePayMent(long id);
        Task UpdatePayMent(PaymentViewModel id);
        Task<IEnumerable<PaymentViewModel>> GetAllPayments();
        Task<PaymentViewModel> GetPaymentByIdAsync(long id);
        Task<IEnumerable<PaymentViewModel>> GetAllPaymentsByInv(long id);
    }
}

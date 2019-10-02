using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Service.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IPaymentsService
    {
        Task SavePayMent(PaymentViewModel saleInvoiceViewModel);
        Task RemovePayMent(long id);
        Task UpdatePayMent(PaymentViewModel id);
        Task<IEnumerable<PaymentViewModel>> GetAllPayments();
        Task<PaymentViewModel> GetPaymentByIdAsync(long id);
        Task<IEnumerable<PaymentViewModel>> GetAllPaymentsByInv(long id);
    }
}

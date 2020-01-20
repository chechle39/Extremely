using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IPayments2Service
    {
        bool SavePayMent(Payment2ViewModel saleInvoiceViewModel);
        Task RemovePayMent(long id);
        Task UpdatePayMent(Payment2ViewModel request);
        Task<IEnumerable<Payment2ViewModel>> GetAllPayments();
        Task<Payment2ViewModel> GetPaymentByIdAsync(long id);
        Task<IEnumerable<Payment2ViewModel>> GetAllPaymentsByInv(long id);
    }
}

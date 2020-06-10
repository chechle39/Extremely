using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace Xbook.TaxInvoice.Interfaces
{
    public interface ILibTaxSaleDetailInvoiceRepository
    {
        Task<bool> CreateTaxSaleIvDetail(TaxInvDetailViewModel request);
        bool RemoveAll(List<TaxInvDetailViewModel> request);
        bool UpdateTaxSaleInvDetail(TaxInvDetailViewModel rs);
        Task<bool> RemoveSale(List<Deleted> id);
    }
}

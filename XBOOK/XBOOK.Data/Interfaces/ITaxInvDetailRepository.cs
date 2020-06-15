using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface ITaxInvDetailRepository
    {
        Task<bool> CreateTaxInvDetail(TaxInvDetailViewModel taxInvDetailViewModel);
        Task<bool> UpdateTaxInvDetail(TaxInvDetailViewModel taxInvDetailViewModel);
        Task<bool> RemoveTaxSale(long id);
        Task<bool> RemoveTaxSaleInvByTaxInvoiceID(Deleted taxInvoiceId);
    }
}

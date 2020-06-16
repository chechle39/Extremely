using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace Xbook.TaxInvoice.Interfaces
{
    public interface ILibTaxBuyDetailInvoiceRepository
    {
        Task<bool> CreateTaxBuyIvDetail(TaxInvDetailViewModel request);
        bool RemoveAll(List<TaxInvDetailViewModel> request);
        bool UpdateTaxBuyInvDetail(TaxInvDetailViewModel rs);
        Task<bool> RemoveSale(List<Deleted> id);
        Task<TaxBuyInvDetail> GetTaxBuyInvoiceBySaleInvDetailId(long Id);
        Task<bool> RemoveTaxSale(long id);
    }
}

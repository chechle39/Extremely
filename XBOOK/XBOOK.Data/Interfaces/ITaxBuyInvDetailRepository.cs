using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface ITaxBuyInvDetailRepository
    {
        Task<bool> CreateTaxInvDetail(TaxBuyInvDetailViewModel taxInvDetailViewModel);
        Task<bool> UpdateTaxInvDetail(TaxBuyInvDetailViewModel taxInvDetailViewModel);
        Task<bool> RemoveTaxSaleInvByTaxInvoiceID(Deleted taxInvoiceId);
    }
}

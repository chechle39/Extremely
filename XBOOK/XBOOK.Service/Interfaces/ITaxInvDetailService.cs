using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ITaxInvDetailService
    {
        Task<bool> CreateTaxInvDetail(TaxInvDetailViewModel taxInvDetailViewModel);
        Task<bool> UpdateTaxInvDetail(TaxInvDetailViewModel taxInvDetailViewModel);
        Task<TaxSaleInvDetail> GetTaxInvoiceBySaleInvDetailId(long Id);
    }
}

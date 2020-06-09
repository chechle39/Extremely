using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface ITaxSaleInvoiceDetailRepository : IRepository<TaxSaleInvDetail>
    {
        bool CreateTaxSaleIvDetail(TaxInvDetailViewModel request);
        bool RemoveAll(List<TaxInvDetailViewModel> request);
        bool UpdateTaxSaleInvDetail(TaxInvDetailViewModel rs);
        Task<bool> RemoveSale(List<Deleted> id);

    }
}

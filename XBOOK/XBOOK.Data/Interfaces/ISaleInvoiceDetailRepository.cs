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
    public interface ISaleInvoiceDetailRepository : IRepository<SaleInvDetail>
    {
        bool CreateSaleIvDetail(SaleInvDetailViewModel request);
        bool RemoveAll(List<SaleInvDetailViewModel> request);
        bool UpdateSaleInvDetail(SaleInvDetailViewModel rs);
        Task<bool> RemoveSale(List<Deleted> id);

    }
}

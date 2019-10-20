using System;
using System.Collections.Generic;
using System.Text;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface ISaleInvoiceDetailRepository : IRepository<SaleInvDetail>
    {
        bool CreateSaleIvDetail(SaleInvDetailViewModel request);
        bool RemoveAll(List<SaleInvDetailViewModel> request);
        bool UpdateSaleInvDetail(SaleInvDetailViewModel rs);

    }
}

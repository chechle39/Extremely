using System.Collections.Generic;
using XBOOK.Service.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ISaleInvDetailService
    {
        bool CreateSaleInvDetail(SaleInvDetailViewModel saleInvoiceViewModel);
        IEnumerable<SaleInvDetailViewModel> GetAllSaleInvoiceDetail();
    }
}

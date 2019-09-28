using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Service.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ISaleInvDetailService
    {
        Task CreateSaleInvDetail(SaleInvDetailViewModel saleInvoiceViewModel);
        Task<IEnumerable<SaleInvDetailViewModel>> GetAllSaleInvoiceDetail();
    }
}

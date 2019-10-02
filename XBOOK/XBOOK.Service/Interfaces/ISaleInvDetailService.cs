using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Service.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ISaleInvDetailService
    {
        Task CreateSaleInvDetail(SaleInvDetailViewModel saleInvoiceViewModel);
        bool CreateListSaleDetail(List<SaleInvDetailViewModel> saleInvoiceViewModel);
        Task<IEnumerable<SaleInvDetailViewModel>> GetAllSaleInvoiceDetail();
        Task UpdateListSaleDetail(List<SaleInvDetailViewModel> saleInvoiceViewModel);
    }
}

using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IBuyDetailInvoiceService
    {
        Task<bool> CreateBuyInvDetail(BuyInvDetailViewModel buyInvoiceViewModel);
        Task<bool> CreateListBuyDetail(List<BuyInvDetailViewModel> buyInvoiceViewModel);
        Task<bool> UpdateListBuyDetail(List<BuyInvDetailViewModel> buyInvoiceViewModel);
        Task Deleted(long id);

    }
}

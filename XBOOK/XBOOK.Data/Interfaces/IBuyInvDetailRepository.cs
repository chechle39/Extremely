using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IBuyInvDetailRepository
    {
        Task<bool> CreateListBuyDetail(List<BuyInvDetailViewModel> buyInvoiceViewModel);
        Task<bool> UpdateListBuyDetail(List<BuyInvDetailViewModel> buyInvoiceViewModel);
        Task<bool> Deleted(long id);
        Task<bool> UpdateBuyInvDetail(BuyInvDetailViewModel rs);
        Task<bool> CreateBuyIvDetail(BuyInvDetailViewModel request);
    }
}

using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IBuyInvDetailRepository
    {
        List<BuyInvDetail> CreateListBuyDetail(List<BuyInvDetailViewModel> buyInvoiceViewModel);
        Task<bool> UpdateListBuyDetail(List<BuyInvDetailViewModel> buyInvoiceViewModel);
        Task<bool> Deleted(List<Deleted> id);
        Task<bool> UpdateBuyInvDetail(BuyInvDetailViewModel rs);
        BuyInvDetail CreateBuyIvDetail(BuyInvDetailViewModel request);
    }
}

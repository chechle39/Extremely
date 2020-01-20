using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class BuyDetailInvoiceService : IBuyDetailInvoiceService
    {
        private readonly IUnitOfWork _uow;
        private readonly IBuyInvDetailRepository _buyInvDetailRepository;

        public BuyDetailInvoiceService(IUnitOfWork uow, IBuyInvDetailRepository buyInvDetailRepository)
        {
            _uow = uow;
            _buyInvDetailRepository = buyInvDetailRepository;
        }

        public async Task<bool> CreateBuyInvDetail(BuyInvDetailViewModel buyInvoiceViewModel)
        {
            var data = await _buyInvDetailRepository.CreateBuyIvDetail(buyInvoiceViewModel);
            return data;
        }

        public async Task<bool> CreateListBuyDetail(List<BuyInvDetailViewModel> buyInvoiceViewModel)
        {
            var data = await _buyInvDetailRepository.CreateListBuyDetail(buyInvoiceViewModel);
            return data;
        }

        public async Task Deleted(long id)
        {
            await _buyInvDetailRepository.Deleted(id);
        }

        public async Task<bool> UpdateListBuyDetail(List<BuyInvDetailViewModel> buyInvoiceViewModel)
        {
            var data = await _buyInvDetailRepository.UpdateListBuyDetail(buyInvoiceViewModel);
            return data;
        }
    }
}

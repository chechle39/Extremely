using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xbook.TaxInvoice.Repositories;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class BuyDetailInvoiceService : IBuyDetailInvoiceService
    {
        private readonly IUnitOfWork _uow;
        private readonly IBuyInvDetailRepository _buyInvDetailRepository;
        private readonly IRepository<BuyInvDetail> _buyInvDetailUowRepository;
        private readonly LibTaxBuyDetailInvoiceRepository _libTaxSaleDetailInvoiceRepository;
        private readonly LibTaxBuyInvoiceRepository _libTaxBuyInvoiceRepository;
        private readonly IBuyInvoiceRepository _buyInvoiceRepository;
        public BuyDetailInvoiceService(IUnitOfWork uow, 
            IBuyInvDetailRepository buyInvDetailRepository,
             ITaxBuyInvDetailRepository taxBuyInvDetailRepository,
            IBuyInvoiceRepository buyInvoiceRepository,
            XBookContext db)
        {
            _uow = uow;
            _buyInvDetailRepository = buyInvDetailRepository;
            _buyInvDetailUowRepository = _uow.GetRepository<IRepository<BuyInvDetail>>();
            _libTaxSaleDetailInvoiceRepository = new LibTaxBuyDetailInvoiceRepository(db);
            _libTaxBuyInvoiceRepository = new LibTaxBuyInvoiceRepository(db, _uow);
            _buyInvoiceRepository = buyInvoiceRepository;
        }

        public async Task<bool> CreateBuyInvDetail(BuyInvDetailViewModel buyInvoiceViewModel)
        {
            var data =  _buyInvDetailRepository.CreateBuyIvDetail(buyInvoiceViewModel);
            return await Task.FromResult(true);
        }

        public async Task<bool> CreateListBuyDetail(BuyInvDetailSave buyInvoiceViewModel)
        {
            var data =  _buyInvDetailRepository.CreateListBuyDetail(buyInvoiceViewModel.BuyInvDetailViewModel);
            if (buyInvoiceViewModel.Check == true)
            {
                foreach (var item in data)
                {
                    CreateTaxDetail(item);

                }
            }
            return await Task.FromResult(true);
        }

        public async Task Deleted(List<Deleted> id)
        {
            await _buyInvDetailRepository.Deleted(id);
        }

        public async Task<bool> UpdateListBuyDetail(List<BuyInvDetailViewModel> buyInvoiceViewModel)
        {
            var data = await _buyInvDetailRepository.UpdateListBuyDetail(buyInvoiceViewModel);
            return data;
        }
        public async Task<IEnumerable<BuyInvDetailViewModel>> getBuyInvoiceDetailByInvoiceId(List<long> listId)
        {
            return await _buyInvDetailUowRepository
                                    .AsQueryable()
                                    .AsNoTracking()
                                    .Where(item => listId.Contains(item.invoiceID))
                                    .ProjectTo<BuyInvDetailViewModel>()
                                    .ToListAsync();
        }

        private void CreateTaxDetail(BuyInvDetail saleDetailData)
        {
            var invData = _buyInvoiceRepository.GetBuyInvoiceById(saleDetailData.invoiceID).Result;

            var libTaxInv = _libTaxBuyInvoiceRepository.GetTaxBuyInvoiceBySaleInvId(invData.ToList()[0].TaxInvoiceNumber).Result;
            if (libTaxInv != null)
            {
                var taxSaleInvoiceModelRequest = new TaxInvDetailViewModel()
                {
                    amount = saleDetailData.amount,
                    description = saleDetailData.description,
                    ID = 0,
                    price = saleDetailData.price,
                    productID = saleDetailData.productID,
                    productName = saleDetailData.productName,
                    qty = saleDetailData.qty,
                    InvoiceID = libTaxInv.ToList()[0].invoiceID,
                    vat = saleDetailData.vat,
                    SaleInvDetailID = saleDetailData.ID,
                };

                var save = _libTaxSaleDetailInvoiceRepository.CreateTaxBuyIvDetail(taxSaleInvoiceModelRequest).Result;
                try
                {
                    _uow.SaveChanges();
                } catch (Exception ex)
                {

                }
                
            }
        }
    }
}

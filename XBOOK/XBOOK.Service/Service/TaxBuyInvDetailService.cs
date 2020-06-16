using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xbook.TaxInvoice.Repositories;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class TaxBuyInvDetailService : ITaxBuyInvDetailService
    {
        private readonly IUnitOfWork _uow;
        private readonly ITaxBuyInvDetailRepository _taxBuyInvDetailRepository;
        private readonly IBuyInvoiceRepository _buyInvoiceRepository;
        private readonly LibTaxSaleDetailInvoiceRepository _libTaxSaleDetailInvoiceRepository;
        private readonly LibTaxBuyInvoiceRepository _libTaxBuyInvoiceRepository;
        public TaxBuyInvDetailService(
            IUnitOfWork uow,
            ITaxBuyInvDetailRepository taxBuyInvDetailRepository,
            IBuyInvoiceRepository buyInvoiceRepository,
            XBookContext db
           )
        {
            _uow = uow;
            _taxBuyInvDetailRepository = taxBuyInvDetailRepository;
            _buyInvoiceRepository = buyInvoiceRepository;
            _libTaxSaleDetailInvoiceRepository = new LibTaxSaleDetailInvoiceRepository(db);
            _libTaxBuyInvoiceRepository = new LibTaxBuyInvoiceRepository(db, _uow);
        }
        public async Task<bool> CreateTaxInvDetail(TaxBuyInvDetailViewModel item)
        {
            var productUOW = _uow.GetRepository<IRepository<Product>>();
            // var getIvTaxId =  GetTaxInvoiceId(saleInvoiceViewModel).Result;
            TaxBuyInvDetailViewModel saleDetailData = null;
            if (item.productName.Split("(").Length > 1)
            {
                saleDetailData = new TaxBuyInvDetailViewModel
                {
                    amount = item.price * item.qty,
                    qty = item.qty,
                    price = item.price,
                    description = item.description,
                    ID = item.ID,
                    taxInvoiceID = item.taxInvoiceID,
                    productID = item.productID,
                    productName = item.productName.Split("(")[0],
                    vat = item.vat
                };
            }
            else
            {
                saleDetailData = new TaxBuyInvDetailViewModel
                {
                    amount = item.price * item.qty,
                    qty = item.qty,
                    price = item.price,
                    description = item.description,
                    ID = item.ID,
                    taxInvoiceID = item.taxInvoiceID,
                    productID = item.productID,
                    productName = item.productName,
                    vat = item.vat
                };
            }

            if (saleDetailData.productID > 0)
            {
                try
                {
                    _uow.BeginTransaction();
                    var saveModel = _taxBuyInvDetailRepository.CreateTaxInvDetail(saleDetailData);
                    _uow.SaveChanges();
                    _uow.CommitTransaction();
                    // await CreateTaxDetail(saveModel, getIvTaxId.taxInvoiceID);
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
            else
            if (saleDetailData.productID == 0 && !string.IsNullOrEmpty(saleDetailData.productName))
            {
                saleDetailData = new TaxBuyInvDetailViewModel
                {
                    amount = item.price * item.qty,
                    qty = item.qty,
                    price = item.price,
                    description = item.description,
                    ID = item.ID,
                    taxInvoiceID = item.taxInvoiceID,
                    productID = item.productID,
                    productName = item.productName,
                    vat = item.vat
                };
                ProductViewModel product = null;
                if (saleDetailData.productName.Split("(").Length > 1)
                {
                    product = new ProductViewModel()
                    {
                        description = saleDetailData.description,
                        productID = saleDetailData.productID,
                        productName = saleDetailData.productName.Split("(")[0],
                        unitPrice = saleDetailData.price,
                        Unit = saleDetailData.productName.Split("(")[1].Split(")")[0],
                        categoryID = (saleDetailData.productName.Split("(")[1].Split(")")[0] != null) ? 1 : 2,
                    };
                }
                else
                {
                    product = new ProductViewModel()
                    {
                        description = saleDetailData.description,
                        productID = saleDetailData.productID,
                        productName = saleDetailData.productName,
                        unitPrice = saleDetailData.price,
                        Unit = null,
                        categoryID = 2,
                    };
                }

                _uow.BeginTransaction();
                var productModel = Mapper.Map<ProductViewModel, Product>(product);
                productUOW.AddData(productModel);
                _uow.SaveChanges();
                _uow.CommitTransaction();
                TaxBuyInvDetailViewModel saleDetailPrd = null;
                if (item.productName.Split("(").Length > 1)
                {
                    saleDetailPrd = new TaxBuyInvDetailViewModel
                    {
                        amount = item.price * item.qty,
                        qty = item.qty,
                        price = item.price,
                        description = item.description,
                        ID = item.ID,
                        taxInvoiceID = item.taxInvoiceID,
                        productID = productModel.productID,
                        productName = item.productName.Split("(")[0],
                        vat = item.vat
                    };
                }
                else
                {
                    saleDetailPrd = new TaxBuyInvDetailViewModel
                    {
                        amount = item.price * item.qty,
                        qty = item.qty,
                        price = item.price,
                        description = item.description,
                        ID = item.ID,
                        taxInvoiceID = item.taxInvoiceID,
                        productID = productModel.productID,
                        productName = item.productName,
                        vat = item.vat
                    };
                }
                _uow.BeginTransaction();
                var saveData = _taxBuyInvDetailRepository.CreateTaxInvDetail(saleDetailPrd);
                _uow.SaveChanges();
                _uow.CommitTransaction();
                //  await CreateTaxDetail(saveData, getIvTaxId.taxInvoiceID);
            }

            return await Task.FromResult(true);
        }

        public Task<bool> UpdateTaxInvDetail(TaxBuyInvDetailViewModel taxInvDetailViewModel)
        {
            throw new NotImplementedException();
        }
    }
}

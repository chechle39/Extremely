using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class TaxInvDetailService : ITaxInvDetailService
    {
        private readonly IUnitOfWork _uow;
        private readonly ITaxInvDetailRepository _taxInvDetailRepository;
        IProductRepository _iProductRepository;
        public TaxInvDetailService(
            IUnitOfWork uow,
            ITaxInvDetailRepository taxInvDetailRepository,
            IProductRepository iProductRepository)
        {
            _uow = uow;
            _taxInvDetailRepository = taxInvDetailRepository;
            _iProductRepository = iProductRepository;
        }
        public async Task<bool> CreateTaxInvDetail(TaxInvDetailViewModel item)
        {
            var productUOW = _uow.GetRepository<IRepository<Product>>();
            // var getIvTaxId =  GetTaxInvoiceId(saleInvoiceViewModel).Result;
            TaxInvDetailViewModel saleDetailData = null;
            if (item.productName.Split("(").Length > 1)
            {
                saleDetailData = new TaxInvDetailViewModel
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
                saleDetailData = new TaxInvDetailViewModel
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
                    var saveModel = _taxInvDetailRepository.CreateTaxInvDetail(saleDetailData);
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
                saleDetailData = new TaxInvDetailViewModel
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
                TaxInvDetailViewModel saleDetailPrd = null;
                if (item.productName.Split("(").Length > 1)
                {
                    saleDetailPrd = new TaxInvDetailViewModel
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
                    saleDetailPrd = new TaxInvDetailViewModel
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
                var saveData = _taxInvDetailRepository.CreateTaxInvDetail(saleDetailPrd);
                _uow.SaveChanges();
                _uow.CommitTransaction();
                //  await CreateTaxDetail(saveData, getIvTaxId.taxInvoiceID);
            }

            return await Task.FromResult(true);
        }

        public async Task<TaxSaleInvDetail> GetTaxInvoiceBySaleInvDetailId(long Id)
        {
            return await _taxInvDetailRepository.GetTaxInvoiceBySaleInvDetailId(Id);
        }

        public async Task<bool> UpdateTaxInvDetail(TaxInvDetailViewModel taxInvDetailViewModel)
        {
            var save = await _taxInvDetailRepository.UpdateTaxInvDetail(taxInvDetailViewModel);
            _uow.SaveChanges();
            return save;
        }
    }
}

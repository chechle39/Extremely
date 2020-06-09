using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class SaleInvDetailService : ISaleInvDetailService
    {
        private readonly IRepository<SaleInvDetail> _saleInvDetailUowRepository;
        private readonly IUnitOfWork _uow;
        private readonly IProductRepository _iProductRepository;
        private readonly ISaleInvoiceDetailRepository _iSaleInvoiceDetailRepository;
        private readonly XBookContext _context;
        private readonly ITaxInvDetailService _taxInvDetailService;
        private readonly ISaleInvoiceRepository _saleInvoiceRepository;
        private readonly ITaxSaleInvoiceRepository _taxSaleInvoiceRepository;
        public SaleInvDetailService(
            IUnitOfWork uow, 
            IProductRepository iProductRepository, 
            XBookContext context, 
            ISaleInvoiceDetailRepository iSaleInvoiceDetailRepository,
             ITaxInvDetailService taxInvDetailService,
             ISaleInvoiceRepository saleInvoiceRepository,
             ITaxSaleInvoiceRepository taxSaleInvoiceRepository
            )
        {
            _uow = uow;
            _saleInvDetailUowRepository = _uow.GetRepository<IRepository<SaleInvDetail>>();
            _iProductRepository = iProductRepository;
            _context = context;
            _iSaleInvoiceDetailRepository = iSaleInvoiceDetailRepository;
            _taxInvDetailService = taxInvDetailService;
            _saleInvoiceRepository = saleInvoiceRepository;
            _taxSaleInvoiceRepository = taxSaleInvoiceRepository;
        }

        public async Task<bool> CreateListSaleDetail(List<SaleInvDetailViewModel> saleInvoiceViewModel)
        {
            var productUOW = _uow.GetRepository<IRepository<Product>>();
           // var getIvTaxId =  GetTaxInvoiceId(saleInvoiceViewModel).Result;
            foreach (var item in saleInvoiceViewModel)
            {
                SaleInvDetailViewModel saleDetailData = null;
                if (item.ProductName.Split("(").Length > 1)
                {
                    saleDetailData = new SaleInvDetailViewModel
                    {
                        Amount = item.Price * item.Qty,
                        Qty = item.Qty,
                        Price = item.Price,
                        Description = item.Description,
                        Id = item.Id,
                        InvoiceId = item.InvoiceId,
                        ProductId = item.ProductId,
                        ProductName = item.ProductName.Split("(")[0],
                        Vat = item.Vat
                    };
                }
                else
                {
                    saleDetailData = new SaleInvDetailViewModel
                    {
                        Amount = item.Price * item.Qty,
                        Qty = item.Qty,
                        Price = item.Price,
                        Description = item.Description,
                        Id = item.Id,
                        InvoiceId = item.InvoiceId,
                        ProductId = item.ProductId,
                        ProductName = item.ProductName,
                        Vat = item.Vat
                    };
                }

                if (saleDetailData.ProductId > 0)
                {
                    try
                    {
                           _uow.BeginTransaction();
                        var saveModel = _iSaleInvoiceDetailRepository.CreateSaleIvDetail(saleDetailData);
                        _uow.SaveChanges();
                             _uow.CommitTransaction();
                       // await CreateTaxDetail(saveModel, getIvTaxId.taxInvoiceID);
                    } catch (Exception ex)
                    {

                    }
                
                }
                else
                if (saleDetailData.ProductId == 0 && !string.IsNullOrEmpty(saleDetailData.ProductName))
                {
                    saleDetailData = new SaleInvDetailViewModel
                    {
                        Amount = item.Price * item.Qty,
                        Qty = item.Qty,
                        Price = item.Price,
                        Description = item.Description,
                        Id = item.Id,
                        InvoiceId = item.InvoiceId,
                        ProductId = item.ProductId,
                        ProductName = item.ProductName,
                        Vat = item.Vat
                    };
                    ProductViewModel product = null;
                    if (saleDetailData.ProductName.Split("(").Length > 1)
                    {
                        product = new ProductViewModel()
                        {
                            description = saleDetailData.Description,
                            productID = saleDetailData.ProductId,
                            productName = saleDetailData.ProductName.Split("(")[0],
                            unitPrice = saleDetailData.Price,
                            Unit = saleDetailData.ProductName.Split("(")[1].Split(")")[0],
                            categoryID = (saleDetailData.ProductName.Split("(")[1].Split(")")[0] != null) ? 1 : 2,
                        };
                    }
                    else
                    {
                        product = new ProductViewModel()
                        {
                            description = saleDetailData.Description,
                            productID = saleDetailData.ProductId,
                            productName = saleDetailData.ProductName,
                            unitPrice = saleDetailData.Price,
                            Unit = null,
                            categoryID = 2,
                        };
                    }

                    _uow.BeginTransaction();
                    _iProductRepository.SaveProduct(product);
                    _uow.SaveChanges();
                    _uow.CommitTransaction();
                    var serchData = _iProductRepository.GetLDFProduct();
                    SaleInvDetailViewModel saleDetailPrd = null;
                    if (item.ProductName.Split("(").Length > 1)
                    {
                        saleDetailPrd = new SaleInvDetailViewModel
                        {
                            Amount = item.Price * item.Qty,
                            Qty = item.Qty,
                            Price = item.Price,
                            Description = item.Description,
                            Id = item.Id,
                            InvoiceId = item.InvoiceId,
                            ProductId = serchData.LastOrDefault().productID,
                            ProductName = item.ProductName.Split("(")[0],
                            Vat = item.Vat
                        };
                    }
                    else
                    {
                        saleDetailPrd = new SaleInvDetailViewModel
                        {
                            Amount = item.Price * item.Qty,
                            Qty = item.Qty,
                            Price = item.Price,
                            Description = item.Description,
                            Id = item.Id,
                            InvoiceId = item.InvoiceId,
                            ProductId = serchData.LastOrDefault().productID,
                            ProductName = item.ProductName,
                            Vat = item.Vat
                        };
                    }
                    _uow.BeginTransaction();
                    var saveData = _iSaleInvoiceDetailRepository.CreateSaleIvDetail(saleDetailPrd);
                    _uow.SaveChanges();
                    _uow.CommitTransaction();
                  //  await CreateTaxDetail(saveData, getIvTaxId.taxInvoiceID);
                }
            }
            return await Task.FromResult(true);
        }

        //private async Task<TaxSaleInvoice> GetTaxInvoiceId(List<SaleInvDetailViewModel> saleInvoiceViewModel)
        //{
        //    var getIvTax = await _taxSaleInvoiceRepository.GetTaxInvoiceBySaleInvId(saleInvoiceViewModel[0].InvoiceId);
        //    return getIvTax.ToList()[0];
        //}

        public async Task CreateSaleInvDetail(SaleInvDetailViewModel saleInvoiceViewModel)
        {
            var saleInvoiceDetailCreate = Mapper.Map<SaleInvDetailViewModel, SaleInvDetail>(saleInvoiceViewModel);
            await _saleInvDetailUowRepository.Add(saleInvoiceDetailCreate);
        }

        public async Task Deleted(List<Deleted> id)
        {
            await _iSaleInvoiceDetailRepository.RemoveSale(id);
            _uow.SaveChanges();
        }

        public async Task<IEnumerable<SaleInvDetailViewModel>> GetAllSaleInvoiceDetail()
        {
            return await _saleInvDetailUowRepository.GetAll().ProjectTo<SaleInvDetailViewModel>().ToListAsync();
        }

        public async Task UpdateListSaleDetail(List<SaleInvDetailViewModel> saleInvoiceViewModel)
        {
            var saleDetail = new List<SaleInvDetailViewModel>();
            foreach (var item in saleInvoiceViewModel)
            {
                var saleDetailData = new SaleInvDetailViewModel
                {
                    Amount = item.Price * item.Qty,
                    Qty = item.Qty,
                    Price = item.Price,
                    Description = item.Description,
                    Id = item.Id,
                    InvoiceId = item.InvoiceId,
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    Vat = item.Vat,
                };
                saleDetail.Add(saleDetailData);
            }
            var saleInvoiceDetailCreate = Mapper.Map<List<SaleInvDetailViewModel>, List<SaleInvDetail>>(saleDetail);
            await _saleInvDetailUowRepository.Update(saleInvoiceDetailCreate);
        }

        //private async Task CreateTaxDetail(SaleInvDetail saleDetailData, long id)
        //{
        //    var taxSaleInvoiceModelRequest = new TaxInvDetailViewModel()
        //    {
        //        amount = saleDetailData.amount,
        //        description = saleDetailData.description,
        //        ID = 0,
        //        price = saleDetailData.price,
        //        productID = saleDetailData.productID,
        //        productName = saleDetailData.productName,
        //        qty = saleDetailData.qty,
        //        SaleInvoiceDetailId = saleDetailData.ID,
        //        taxInvoiceID = 0,
        //        vat = saleDetailData.vat
        //    };
        //    taxSaleInvoiceModelRequest.taxInvoiceID = id;
        //    await _taxInvDetailService.CreateTaxInvDetail(taxSaleInvoiceModelRequest);
        //}
    }
}

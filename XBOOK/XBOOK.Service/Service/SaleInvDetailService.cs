﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
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
    public class SaleInvDetailService : ISaleInvDetailService
    {
        private readonly IRepository<SaleInvDetail> _saleInvDetailUowRepository;
        private readonly IUnitOfWork _uow;
        private readonly IProductRepository _iProductRepository;
        private readonly ISaleInvoiceDetailRepository _iSaleInvoiceDetailRepository;
        private readonly XBookContext _context;
        public SaleInvDetailService(IUnitOfWork uow, IProductRepository iProductRepository, XBookContext context, ISaleInvoiceDetailRepository iSaleInvoiceDetailRepository)
        {
            _uow = uow;
            _saleInvDetailUowRepository = _uow.GetRepository<IRepository<SaleInvDetail>>();
            _iProductRepository = iProductRepository;
            _context = context;
            _iSaleInvoiceDetailRepository = iSaleInvoiceDetailRepository;
        }

        public  bool CreateListSaleDetail(List<SaleInvDetailViewModel> saleInvoiceViewModel)
        {
            var productUOW = _uow.GetRepository<IRepository<Product>>();
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
                }else
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
             
                if(saleDetailData.ProductId > 0)
                {
                    _uow.BeginTransaction();
                    _iSaleInvoiceDetailRepository.CreateSaleIvDetail(saleDetailData);
                    _uow.SaveChanges();
                    _uow.CommitTransaction();
                }
                else 
                if(saleDetailData.ProductId == 0 && !string.IsNullOrEmpty(saleDetailData.ProductName))
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
                    }else
                    {
                        product = new ProductViewModel()
                        {
                            description = saleDetailData.Description,
                            productID = saleDetailData.ProductId,
                            productName = saleDetailData.ProductName,
                            unitPrice = saleDetailData.Price,
                            Unit = null,
                            categoryID =  2,
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

                    try
                    {
                        _uow.BeginTransaction();
                        _iSaleInvoiceDetailRepository.CreateSaleIvDetail(saleDetailPrd);
                        _uow.SaveChanges();
                        _uow.CommitTransaction();
                    }
                    catch(Exception ex)
                    {

                    }
                }
            }
            return true;
            //var saleInvoiceDetailCreate = Mapper.Map<List<SaleInvDetailViewModel>, List<SaleInvDetail>>(saleDetail);
        }

        public async Task CreateSaleInvDetail(SaleInvDetailViewModel saleInvoiceViewModel)
        {
            var saleInvoiceDetailCreate = Mapper.Map<SaleInvDetailViewModel, SaleInvDetail>(saleInvoiceViewModel);
            await _saleInvDetailUowRepository.Add(saleInvoiceDetailCreate);
        }

        public async Task Deleted(long id)
        {
           await  _iSaleInvoiceDetailRepository.Remove(id);
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
                    Vat = item.Vat
                };
                saleDetail.Add(saleDetailData);
            }
            var saleInvoiceDetailCreate = Mapper.Map<List<SaleInvDetailViewModel>, List<SaleInvDetail>>(saleDetail);
            await _saleInvDetailUowRepository.Update(saleInvoiceDetailCreate);
        }
    }
}

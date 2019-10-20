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
                if(saleDetailData.ProductId > 0)
                {
                    _iSaleInvoiceDetailRepository.CreateSaleIvDetail(saleDetailData);
                    _uow.SaveChanges();
                }
                else 
                if(saleDetailData.ProductId == 0 && !string.IsNullOrEmpty(saleDetailData.ProductName))
                {
                    var product = new ProductViewModel()
                    {
                        description = saleDetailData.Description,
                        productID = saleDetailData.ProductId,
                        productName = saleDetailData.ProductName,
                        unitPrice = saleDetailData.Price
                    };
                    var productCreate = Mapper.Map<ProductViewModel, Product>(product);
                    productUOW.Add(productCreate);
                    var serchData = _iProductRepository.GetLDFProduct();
                    var saleDetailPrd = new SaleInvDetailViewModel
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

                    //var saleInvoiceDetailCreate = Mapper.Map<SaleInvDetailViewModel, SaleInvDetail>(saleDetailPrd);
                    //_saleInvDetailUowRepository.Add(saleInvoiceDetailCreate);
                    try
                    {
                        _iSaleInvoiceDetailRepository.CreateSaleIvDetail(saleDetailPrd);
                        _uow.SaveChanges();
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

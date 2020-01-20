using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class BuyInvDetailRepository: Repository<BuyInvDetail>, IBuyInvDetailRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IProductRepository _productRepository;
        private readonly ISaleInvoiceDetailRepository _saleInvoiceDetailRepository;
        public BuyInvDetailRepository(DbContext context, IUnitOfWork uow, IProductRepository productRepository, ISaleInvoiceDetailRepository saleInvoiceDetailRepository) : base(context)
        {
            _uow = uow;
            _productRepository = productRepository;
            _saleInvoiceDetailRepository = saleInvoiceDetailRepository;
        }

        public async Task<bool> CreateBuyIvDetail(BuyInvDetailViewModel request)
        {
            var buyInvoiceDetailCreate = Mapper.Map<BuyInvDetailViewModel, BuyInvDetail>(request);
            var createData = Entities.Add(buyInvoiceDetailCreate);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<bool> CreateListBuyDetail(List<BuyInvDetailViewModel> buyInvoiceViewModel)
        {
            var productUOW = _uow.GetRepository<IRepository<Product>>();
            foreach (var item in buyInvoiceViewModel)
            {
                BuyInvDetailViewModel buyDetailData = null;
                if (item.productName.Split("(").Length > 1)
                {
                    buyDetailData = new BuyInvDetailViewModel
                    {
                        amount = item.price * item.qty,
                        qty = item.qty,
                        price = item.price,
                        description = item.description,
                        ID = item.ID,
                        invoiceID = item.invoiceID,
                        productID = item.productID,
                        productName = item.productName.Split("(")[0],
                        vat = item.vat
                    };
                }
                else
                {
                    buyDetailData = new BuyInvDetailViewModel
                    {
                        amount = item.price * item.qty,
                        qty = item.qty,
                        price = item.price,
                        description = item.description,
                        ID = item.ID,
                        invoiceID = item.invoiceID,
                        productID = item.productID,
                        productName = item.productName,
                        vat = item.vat
                    };
                }
                var buyInvoiceDetailCreate = Mapper.Map<BuyInvDetailViewModel, BuyInvDetail>(buyDetailData);
                if (buyDetailData.productID > 0)
                {
                    try
                    {
                        _uow.BeginTransaction();
                        Entities.Add(buyInvoiceDetailCreate);
                        _uow.SaveChanges();
                        _uow.CommitTransaction();
                    } catch (Exception ex)
                    {

                    }
                   
                }
                else
                if (buyDetailData.productID == 0 && !string.IsNullOrEmpty(buyDetailData.productName))
                {
                    buyDetailData = new BuyInvDetailViewModel
                    {
                        amount = item.price * item.qty,
                        qty = item.qty,
                        price = item.price,
                        description = item.description,
                        ID = item.ID,
                        invoiceID = item.invoiceID,
                        productID = item.productID,
                        productName = item.productName,
                        vat = item.vat
                    };
                    ProductViewModel product = null;
                    if (buyDetailData.productName.Split("(").Length > 1)
                    {
                        product = new ProductViewModel()
                        {
                            description = buyDetailData.description,
                            productID = buyDetailData.productID,
                            productName = buyDetailData.productName.Split("(")[0],
                            unitPrice = buyDetailData.price,
                            Unit = buyDetailData.productName.Split("(")[1].Split(")")[0],
                            categoryID = (buyDetailData.productName.Split("(")[1].Split(")")[0] != null) ? 1 : 2,
                        };
                    }
                    else
                    {
                        product = new ProductViewModel()
                        {
                            description = buyDetailData.description,
                            productID = buyDetailData.productID,
                            productName = buyDetailData.productName,
                            unitPrice = buyDetailData.price,
                            Unit = null,
                            categoryID = 2,
                        };
                    }
                    _uow.BeginTransaction();
                    _productRepository.SaveProduct(product);
                    _uow.SaveChanges();
                    _uow.CommitTransaction();
                    var serchData = _productRepository.GetLDFProduct();
                    BuyInvDetailViewModel buyDetailPrd = null;
                    if (item.productName.Split("(").Length > 1)
                    {
                        buyDetailPrd = new BuyInvDetailViewModel
                        {
                            amount = item.price * item.qty,
                            qty = item.qty,
                            price = item.price,
                            description = item.description,
                            ID = item.ID,
                            invoiceID = item.invoiceID,
                            productID = serchData.LastOrDefault().productID,
                            productName = item.productName.Split("(")[0],
                            vat = item.vat
                        };
                    }
                    else
                    {
                        buyDetailPrd = new BuyInvDetailViewModel
                        {
                            amount = item.price * item.qty,
                            qty = item.qty,
                            price = item.price,
                            description = item.description,
                            ID = item.ID,
                            invoiceID = item.invoiceID,
                            productID = serchData.LastOrDefault().productID,
                            productName = item.productName,
                            vat = item.vat
                        };
                    }
                    _uow.BeginTransaction();
                    var rs = Mapper.Map<BuyInvDetailViewModel, BuyInvDetail>(buyDetailPrd);
                    Entities.Add(rs);
                    _uow.SaveChanges();
                    _uow.CommitTransaction();
                }
            }
            return await Task.FromResult(true);
        }

        public async Task<bool> Deleted(long id)
        {
            Entities.Remove(Entities.Find(id));
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<bool> UpdateBuyInvDetail(BuyInvDetailViewModel rs)
        {
            var dataRm = Mapper.Map<BuyInvDetailViewModel, BuyInvDetail>(rs);
            var buy = new BuyInvDetail()
            {
                amount = rs.amount,
                ID = rs.ID,
                invoiceID = rs.invoiceID,
                description = rs.description,
                price = rs.price,
                productID = rs.productID,
                productName = rs.productName,
                qty = rs.qty,
                vat = rs.vat
            };
            try
            {
                Entities.Update(buy);
                _uow.SaveChanges();
            }
            catch (Exception ex)
            {

            }
           
            return await Task.FromResult(true);
        }

        public async Task<bool> UpdateListBuyDetail(List<BuyInvDetailViewModel> buyInvoiceViewModel)
        {
            var buyDetail = new List<BuyInvDetailViewModel>();
            foreach (var item in buyInvoiceViewModel)
            {
                var buyInvoiceDetail = new BuyInvDetailViewModel
                {
                    amount = item.price * item.qty,
                    qty = item.qty,
                    price = item.price,
                    description = item.description,
                    ID = item.ID,
                    invoiceID = item.invoiceID,
                    productID = item.productID,
                    productName = item.productName,
                    vat = item.vat,
                };
                buyDetail.Add(buyInvoiceDetail);
            }
            var buyInvoiceDetailCreate = Mapper.Map<List<BuyInvDetailViewModel>, List<BuyInvDetail>>(buyDetail);
            foreach(var item in buyInvoiceDetailCreate)
            {
               Entities.Update(item);
            }
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }
    }
}

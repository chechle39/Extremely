﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using XBOOK.Common.Method;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class BuyInvoiceRepository: Repository<BuyInvoice>, IBuyInvoiceRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly ISupplierRepository _supplierRepository;
        private readonly IBuyInvDetailRepository _buyInvDetailRepository;
        private readonly IProductRepository _productRepository;

        public BuyInvoiceRepository(XBookContext context, IUnitOfWork uow, ISupplierRepository supplierRepository, IBuyInvDetailRepository buyInvDetailRepository, IProductRepository productRepository) : base(context)
        {
            _uow = uow;
            _supplierRepository = supplierRepository;
            _buyInvDetailRepository = buyInvDetailRepository;
            _productRepository = productRepository;
        }

        public async Task<BuyInvoice> CreateBuyInvoice(BuyInvoiceModelRequest BuyInvoiceViewModel)
        {
            var buyInvoie = await Entities.ProjectTo<BuyInvoiceViewModel>().LastOrDefaultAsync();
            var supplierUOW = _uow.GetRepository<IRepository<Supplier>>();
            var buyInvoiceCreate = new BuyInvoice();
            if (BuyInvoiceViewModel.supplierID != 0)
            {
                var buyInvoiceModelRequest = new BuyInvoiceModelRequest()
                {
                    Address = BuyInvoiceViewModel.Address,
                    AmountPaid = BuyInvoiceViewModel.AmountPaid,
                    supplierName = BuyInvoiceViewModel.supplierName,
                    ContactName = BuyInvoiceViewModel.ContactName,
                    Discount = BuyInvoiceViewModel.Discount,
                    DiscRate = BuyInvoiceViewModel.DiscRate,
                    DueDate = BuyInvoiceViewModel.DueDate,
                    Email = BuyInvoiceViewModel.Email,
                    InvoiceId = BuyInvoiceViewModel.InvoiceId,
                    InvoiceNumber = buyInvoie != null ? (BuyInvoiceViewModel.InvoiceNumber == buyInvoie.InvoiceNumber ? MethodCommon.InputString(buyInvoie.InvoiceNumber) : BuyInvoiceViewModel.InvoiceNumber) : (BuyInvoiceViewModel.InvoiceNumber),
                    InvoiceSerial = BuyInvoiceViewModel.InvoiceSerial,
                    IssueDate = BuyInvoiceViewModel.IssueDate,
                    Note = BuyInvoiceViewModel.Note,
                    Reference = BuyInvoiceViewModel.Reference,
                    Status = BuyInvoiceViewModel.Status,
                    SubTotal = BuyInvoiceViewModel.SubTotal,
                    Tag = BuyInvoiceViewModel.Tag,
                    TaxCode = BuyInvoiceViewModel.TaxCode,
                    Term = BuyInvoiceViewModel.Term,
                    VatTax = BuyInvoiceViewModel.VatTax,
                    supplierID = BuyInvoiceViewModel.supplierID,
                    TaxInvoiceNumber = BuyInvoiceViewModel.TaxInvoiceNumber
                };
                buyInvoiceCreate = Mapper.Map<BuyInvoiceModelRequest, BuyInvoice>(buyInvoiceModelRequest);
                _uow.BeginTransaction();
                Entities.Add(buyInvoiceCreate);
                _uow.SaveChanges();
                _uow.CommitTransaction();
            }
            else if (BuyInvoiceViewModel.supplierID == 0 && BuyInvoiceViewModel.supplierName != null)
            {
                var supplierViewModel = new SupplierCreateRequest()
                {
                    Address = BuyInvoiceViewModel.Address,
                    supplierName = BuyInvoiceViewModel.supplierName,
                    Email = BuyInvoiceViewModel.Email,
                    ContactName = BuyInvoiceViewModel.ContactName,
                    Note = BuyInvoiceViewModel.Note,
                    Tag = BuyInvoiceViewModel.Tag,
                    TaxCode = BuyInvoiceViewModel.TaxCode,
                    supplierID = BuyInvoiceViewModel.supplierID
                };
                await _supplierRepository.CreateSupplier(supplierViewModel);
                _uow.SaveChanges();
                var serchData = supplierUOW.GetAll().ProjectTo<SupplierViewModel>().Where(x => x.supplierName == BuyInvoiceViewModel.supplierName).ToList();
                var buyInvoiceModelRequest = new BuyInvoiceModelRequest()
                {
                    Address = BuyInvoiceViewModel.Address,
                    AmountPaid = BuyInvoiceViewModel.AmountPaid,
                    supplierName = BuyInvoiceViewModel.supplierName,
                    ContactName = BuyInvoiceViewModel.ContactName,
                    Discount = BuyInvoiceViewModel.Discount,
                    DiscRate = BuyInvoiceViewModel.DiscRate,
                    DueDate = BuyInvoiceViewModel.DueDate,
                    Email = BuyInvoiceViewModel.Email,
                    InvoiceId = BuyInvoiceViewModel.InvoiceId,
                    InvoiceNumber = buyInvoie != null ? (BuyInvoiceViewModel.InvoiceNumber == buyInvoie.InvoiceNumber ? MethodCommon.InputString(buyInvoie.InvoiceNumber) : BuyInvoiceViewModel.InvoiceNumber) : (BuyInvoiceViewModel.InvoiceNumber),
                    InvoiceSerial = BuyInvoiceViewModel.InvoiceSerial,
                    IssueDate = BuyInvoiceViewModel.IssueDate,
                    Note = BuyInvoiceViewModel.Note,
                    Reference = BuyInvoiceViewModel.Reference,
                    Status = BuyInvoiceViewModel.Status,
                    SubTotal = BuyInvoiceViewModel.SubTotal,
                    Tag = BuyInvoiceViewModel.Tag,
                    TaxCode = BuyInvoiceViewModel.TaxCode,
                    Term = BuyInvoiceViewModel.Term,
                    VatTax = BuyInvoiceViewModel.VatTax,
                    supplierID = serchData[0].supplierID,
                    TaxInvoiceNumber = BuyInvoiceViewModel.TaxInvoiceNumber
                };
                buyInvoiceCreate = Mapper.Map<BuyInvoiceModelRequest, BuyInvoice>(buyInvoiceModelRequest);
                 Entities.Add(buyInvoiceCreate);
                _uow.SaveChanges();
            }

            return buyInvoiceCreate;
        }

        public async Task<bool> DeleteBuyInvoice(List<Deleted> request)
        {
            foreach(var item in request)
            {
                var data = Entities.Find(item.id);
                Entities.Remove(data);
            }
            return await Task.FromResult(true);

        }

        public async Task<BuyInvoiceViewModel> GetALlDF()
        {
            var data = await Entities.ProjectTo<BuyInvoiceViewModel>().LastOrDefaultAsync();
            return data;
        }

        public async Task<IEnumerable<BuyInvoiceViewModel>> GetBuyInvoiceById(long id)
        {
            var data = await Entities.ProjectTo<BuyInvoiceViewModel>().Where(x => x.InvoiceId == id).ToListAsync();

            return data;
        }

        public async Task<BuyInvoiceViewModel> GetLastBuyInvoice()
        {
            var lastInvoice = new BuyInvoiceViewModel();
            if (Entities.Count() > 1)
            {
                var data = await Entities.ProjectTo<BuyInvoiceViewModel>().OrderByDescending(xx => xx.InvoiceId).Take(1).LastOrDefaultAsync();
                data.InvoiceNumber = MethodCommon.InputString(data.InvoiceNumber);
                return data;
            }
            else if (Entities.Count() == 1)
            {
                var data = await Entities.ProjectTo<BuyInvoiceViewModel>().ToListAsync();
                data[0].InvoiceNumber = MethodCommon.InputString(data[0].InvoiceNumber);
                return data[0];
            }
            else
            {
                return lastInvoice;
            }
        }

        public async Task<bool> Update(BuyInvoiceViewModel buyInvoiceViewModel)
        {
            if (buyInvoiceViewModel.supplierID > 0)
            {
                _uow.BeginTransaction();
                var buyInvoice = Mapper.Map<BuyInvoiceViewModel, BuyInvoice>(buyInvoiceViewModel);
                Entities.Update(buyInvoice);
                _uow.SaveChanges();
                _uow.CommitTransaction();
                if (buyInvoiceViewModel.SupplierData.Count() > 0)
                {
                    var requetsCl = new SupplierCreateRequest
                    {
                        Address = buyInvoiceViewModel.SupplierData[0].address,
                        supplierID = buyInvoiceViewModel.SupplierData[0].supplierID,
                        supplierName = buyInvoiceViewModel.SupplierData[0].supplierName,
                        ContactName = buyInvoiceViewModel.SupplierData[0].contactName,
                        Email = buyInvoiceViewModel.SupplierData[0].email,
                        // Note = saleInvoiceViewModel.ClientData[0].Note,
                        Tag = buyInvoiceViewModel.SupplierData[0].Tag,
                        TaxCode = buyInvoiceViewModel.SupplierData[0].taxCode,
                    };
                    _uow.BeginTransaction();
                    await _supplierRepository.UpdateSupplier(requetsCl);
                    _uow.SaveChanges();
                    _uow.CommitTransaction();
                }
                if (buyInvoiceViewModel.BuyInvDetailView.Count() > 0)
                {
                    for (int i = 0; i < buyInvoiceViewModel.BuyInvDetailView.Count; i++)
                    {
                        if (buyInvoiceViewModel.BuyInvDetailView[i].ID > 0)
                        {
                            BuyInvDetailViewModel rs = null;
                            if (buyInvoiceViewModel.BuyInvDetailView[i].productName.Split("(").Length > 1)
                            {
                                rs = new BuyInvDetailViewModel
                                {
                                    amount = buyInvoiceViewModel.BuyInvDetailView[i].amount,
                                    productName = Regex.Replace(buyInvoiceViewModel.BuyInvDetailView[i].productName.Split("(")[0], @"\s+$", ""),
                                    description = buyInvoiceViewModel.BuyInvDetailView[i].description,
                                    ID = buyInvoiceViewModel.BuyInvDetailView[i].ID,
                                    invoiceID = buyInvoiceViewModel.BuyInvDetailView[i].invoiceID,
                                    price = buyInvoiceViewModel.BuyInvDetailView[i].price,
                                    productID = buyInvoiceViewModel.BuyInvDetailView[i].productID,
                                    qty = buyInvoiceViewModel.BuyInvDetailView[i].qty,
                                    vat = buyInvoiceViewModel.BuyInvDetailView[i].vat
                                };
                            }
                            else
                            {
                                rs = new BuyInvDetailViewModel
                                {
                                    amount = buyInvoiceViewModel.BuyInvDetailView[i].amount,
                                    productName = buyInvoiceViewModel.BuyInvDetailView[i].productName,
                                    description = buyInvoiceViewModel.BuyInvDetailView[i].description,
                                    ID = buyInvoiceViewModel.BuyInvDetailView[i].ID,
                                    invoiceID = buyInvoiceViewModel.BuyInvDetailView[i].invoiceID,
                                    price = buyInvoiceViewModel.BuyInvDetailView[i].price,
                                    productID = buyInvoiceViewModel.BuyInvDetailView[i].productID,
                                    qty = buyInvoiceViewModel.BuyInvDetailView[i].qty,
                                    vat = buyInvoiceViewModel.BuyInvDetailView[i].vat
                                };
                            }
                            await _buyInvDetailRepository.UpdateBuyInvDetail(rs);
                        }
                        else
                        {
                            if (buyInvoiceViewModel.BuyInvDetailView[i].productID == 0)
                            {
                                ProductViewModel product = null; ;
                                if (buyInvoiceViewModel.BuyInvDetailView[i].productName.Split("(").Length > 1)
                                {
                                    product = new ProductViewModel()
                                    {
                                        description = buyInvoiceViewModel.BuyInvDetailView[i].description,
                                        productID = buyInvoiceViewModel.BuyInvDetailView[i].productID,
                                        productName = buyInvoiceViewModel.BuyInvDetailView[i].productName.Split("(")[0],
                                        unitPrice = buyInvoiceViewModel.BuyInvDetailView[i].price,
                                        Unit = buyInvoiceViewModel.BuyInvDetailView[i].productName.Split("(")[1].Split(")")[0],
                                        categoryID = 1
                                    };
                                }
                                else
                                {
                                    product = new ProductViewModel()
                                    {
                                        description = buyInvoiceViewModel.BuyInvDetailView[i].description,
                                        productID = buyInvoiceViewModel.BuyInvDetailView[i].productID,
                                        productName = buyInvoiceViewModel.BuyInvDetailView[i].productName.Split("(")[0],
                                        unitPrice = buyInvoiceViewModel.BuyInvDetailView[i].price,
                                        Unit = null,
                                        categoryID = 2
                                    };
                                }

                                var productUOW = _uow.GetRepository<IRepository<Product>>();
                                var productCreate = Mapper.Map<ProductViewModel, Product>(product);
                                _uow.BeginTransaction();
                                productUOW.AddData(productCreate);
                                _uow.SaveChanges();
                                _uow.CommitTransaction();
                            };
                           // var serchData = _productRepository.GetLDFProduct();
                            var buyDetailPrd = new BuyInvDetailViewModel
                            {
                                amount = buyInvoiceViewModel.BuyInvDetailView[i].price * buyInvoiceViewModel.BuyInvDetailView[i].qty,
                                qty = buyInvoiceViewModel.BuyInvDetailView[i].qty,
                                price = buyInvoiceViewModel.BuyInvDetailView[i].price,
                                description = buyInvoiceViewModel.BuyInvDetailView[i].description,
                                ID = buyInvoiceViewModel.BuyInvDetailView[i].ID,
                                invoiceID = buyInvoiceViewModel.BuyInvDetailView[i].invoiceID,
                                productID = buyInvoiceViewModel.BuyInvDetailView[i].productID > 0 ? buyInvoiceViewModel.BuyInvDetailView[i].productID : _productRepository.GetLDFProduct().LastOrDefault().productID,
                                productName = buyInvoiceViewModel.BuyInvDetailView[i].productName.Split("(")[0],
                                vat = buyInvoiceViewModel.BuyInvDetailView[i].vat
                            };
                            var save = _buyInvDetailRepository.CreateBuyIvDetail(buyDetailPrd);

                        }
                    }
                }
            }
            else if (buyInvoiceViewModel.supplierID == 0 && buyInvoiceViewModel.SupplierData.Count() > 0)
            {
                var requetsCl = new SupplierCreateRequest
                {
                    Address = buyInvoiceViewModel.SupplierData[0].address,
                    supplierID = buyInvoiceViewModel.SupplierData[0].supplierID,
                    supplierName = buyInvoiceViewModel.SupplierData[0].supplierName,
                    ContactName = buyInvoiceViewModel.SupplierData[0].contactName,
                    Email = buyInvoiceViewModel.SupplierData[0].email,
                    Note = buyInvoiceViewModel.SupplierData[0].note,
                    Tag = buyInvoiceViewModel.SupplierData[0].Tag,
                    TaxCode = buyInvoiceViewModel.SupplierData[0].taxCode,
                };
                var supplierdata = await _supplierRepository.CreateSupplier(requetsCl);
                _uow.SaveChanges();
                var buyInvoiceList = _uow.GetRepository<IRepository<BuyInvoice>>();
                var buyInvoice = Mapper.Map<BuyInvoiceViewModel, BuyInvoice>(buyInvoiceViewModel);
                buyInvoice.supplierID = supplierdata.supplierID;
                await buyInvoiceList.Update(buyInvoice);
                _uow.SaveChanges();
            }
            return await Task.FromResult(true);
        }

        public async Task<bool> UpdateItem(long id, decimal sum)
        {
            var invoiceById = await Entities.AsNoTracking().Where(x => x.invoiceID == id).ToListAsync();
            var saleInRq = new BuyInvoice()
            {
                amountPaid = invoiceById[0].amountPaid - sum,
                supplierID = invoiceById[0].supplierID,
                discount = invoiceById[0].discount,
                discRate = invoiceById[0].discRate,
                dueDate = invoiceById[0].dueDate,
                invoiceID = invoiceById[0].invoiceID,
                invoiceNumber = invoiceById[0].invoiceNumber,
                invoiceSerial = invoiceById[0].invoiceSerial,
                issueDate = invoiceById[0].issueDate,
                note = invoiceById[0].note,
                reference = invoiceById[0].reference,
                status = invoiceById[0].status,
                subTotal = invoiceById[0].subTotal,
                term = invoiceById[0].term,
                vatTax = invoiceById[0].vatTax,
            };
            Entities.Update(saleInRq);
            return true;
        }

        public async Task<bool> UpdateItemTaxNum(long id, string tax)
        {
            var invoiceById = await Entities.AsNoTracking().Where(x => x.invoiceID == id).ToListAsync();
            var saleInRq = new BuyInvoice()
            {
                amountPaid = invoiceById[0].amountPaid,
                supplierID = invoiceById[0].supplierID,
                discount = invoiceById[0].discount,
                discRate = invoiceById[0].discRate,
                dueDate = invoiceById[0].dueDate,
                invoiceID = invoiceById[0].invoiceID,
                invoiceNumber = invoiceById[0].invoiceNumber,
                invoiceSerial = invoiceById[0].invoiceSerial,
                issueDate = invoiceById[0].issueDate,
                note = invoiceById[0].note,
                reference = invoiceById[0].reference,
                status = invoiceById[0].status,
                subTotal = invoiceById[0].subTotal,
                term = invoiceById[0].term,
                vatTax = invoiceById[0].vatTax,
                TaxInvoiceNumber = tax
            };
            Entities.Update(saleInRq);

            return await Task.FromResult(true);
        }

        public bool UpdateSaleInvEn(Invoice request, decimal sum)
        {
            var invoiceById = Entities.AsNoTracking().Where(x => x.invoiceID == request.InvoiceId).ToListAsync();
            var saleInRq = new BuyInvoice()
            {
                amountPaid = sum,
                supplierID = invoiceById.Result[0].supplierID,
                discount = invoiceById.Result[0].discount,
                discRate = invoiceById.Result[0].discRate,
                dueDate = invoiceById.Result[0].dueDate,
                invoiceID = invoiceById.Result[0].invoiceID,
                invoiceNumber = invoiceById.Result[0].invoiceNumber,
                invoiceSerial = invoiceById.Result[0].invoiceSerial,
                issueDate = invoiceById.Result[0].issueDate,
                note = invoiceById.Result[0].note,
                reference = invoiceById.Result[0].reference,
                status = invoiceById.Result[0].status,
                subTotal = invoiceById.Result[0].subTotal,
                term = invoiceById.Result[0].term,
                vatTax = invoiceById.Result[0].vatTax,
            };
            Entities.Update(saleInRq);
            return true;
        }

    }

   
}

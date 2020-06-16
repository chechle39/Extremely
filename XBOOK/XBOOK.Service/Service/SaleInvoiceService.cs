using AutoMapper;
using AutoMapper.QueryableExtensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using XAccLib.GL;
using Xbook.TaxInvoice.Repositories;
using XBOOK.Common.Method;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class SaleInvoiceService : ISaleInvoiceService
    {
        private readonly IRepository<SaleInvoice> _saleInvoiceUowRepository;
        private readonly IClientRepository _ClientRepository;
        private readonly ISaleInvoiceRepository _SaleInvoiceRepository;
        private readonly IUnitOfWork _uow;
        public readonly IClientService _iClientService;
        public readonly ISaleInvDetailService _iSaleInvDetailService;
        private readonly ISaleInvoiceDetailRepository _SaleInvoiceDetailRepository;
        private readonly IProductRepository _iProductRepository;
        private readonly XBookContext _context;
        private readonly LibTaxSaleInvoiceRepository _libTaxSaleInvoiceRepository;
        public readonly Invoice_TaxInvoiceRepository _invoice_TaxInvoiceRepository;
        private readonly LibTaxSaleDetailInvoiceRepository _libTaxSaleDetailInvoiceRepository;
        public SaleInvoiceService(
            IProductRepository iProductRepository, 
            ISaleInvoiceRepository saleInvoiceRepository, 
            XBookContext context, 
            IUnitOfWork uow, 
            IClientRepository ClientRepository, 
            IClientService iClientService, 
            ISaleInvDetailService iSaleInvDetailService, 
            ISaleInvoiceDetailRepository saleInvoiceDetailRepository)
        {
            _context = context;
            _iClientService = iClientService;
            _iSaleInvDetailService = iSaleInvDetailService;
            _uow = uow;
            _ClientRepository = ClientRepository;
            _saleInvoiceUowRepository = _uow.GetRepository<IRepository<SaleInvoice>>();
            _SaleInvoiceDetailRepository = saleInvoiceDetailRepository;
            _SaleInvoiceRepository = saleInvoiceRepository;
            _iProductRepository = iProductRepository;
             _libTaxSaleInvoiceRepository = new LibTaxSaleInvoiceRepository(_context,_uow);
            _invoice_TaxInvoiceRepository = new Invoice_TaxInvoiceRepository(_context, _SaleInvoiceRepository);
            _libTaxSaleDetailInvoiceRepository = new LibTaxSaleDetailInvoiceRepository(_context);
        }

        async Task<bool> ISaleInvoiceService.CreateSaleInvoice(SaleInvoiceModelRequest saleInvoiceViewModel)
        {
            var saleInvoie = _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().LastOrDefault();
            var clientUOW = _uow.GetRepository<IRepository<Client>>();
            var saleInvoiceModelRequest = new SaleInvoiceModelRequest();
            var saveInv = new SaleInvoice();
            if (saleInvoiceViewModel.ClientId != 0)
            {
                saleInvoiceModelRequest = new SaleInvoiceModelRequest()
                {
                    Address = saleInvoiceViewModel.Address,
                    AmountPaid = saleInvoiceViewModel.AmountPaid,
                    ClientName = saleInvoiceViewModel.ClientName,
                    ContactName = saleInvoiceViewModel.ContactName,
                    Discount = saleInvoiceViewModel.Discount,
                    DiscRate = saleInvoiceViewModel.DiscRate,
                    DueDate = saleInvoiceViewModel.DueDate,
                    Email = saleInvoiceViewModel.Email,
                    InvoiceId = saleInvoiceViewModel.InvoiceId,
                    InvoiceNumber = saleInvoie != null ? (saleInvoiceViewModel.InvoiceNumber == saleInvoie.InvoiceNumber ? MethodCommon.InputString(saleInvoie.InvoiceNumber) : saleInvoiceViewModel.InvoiceNumber) : (saleInvoiceViewModel.InvoiceNumber),
                    InvoiceSerial = saleInvoiceViewModel.InvoiceSerial,
                    IssueDate = saleInvoiceViewModel.IssueDate,
                    Note = saleInvoiceViewModel.Note,
                    Reference = saleInvoiceViewModel.Reference,
                    Status = saleInvoiceViewModel.Status,
                    SubTotal = saleInvoiceViewModel.SubTotal,
                    Tag = saleInvoiceViewModel.Tag,
                    TaxCode = saleInvoiceViewModel.TaxCode,
                    Term = saleInvoiceViewModel.Term,
                    VatTax = saleInvoiceViewModel.VatTax,
                    ClientId = saleInvoiceViewModel.ClientId,
                    TaxInvoiceNumber = saleInvoiceViewModel.TaxInvoiceNumber,
                    Check = saleInvoiceViewModel.Check
                };
                var saleInvoiceCreate = Mapper.Map<SaleInvoiceModelRequest, SaleInvoice>(saleInvoiceModelRequest);
                _uow.BeginTransaction();

                saveInv = _SaleInvoiceRepository.SaveSaleInvoice(saleInvoiceCreate);
                _uow.SaveChanges();
                _uow.CommitTransaction();
            }
            else if (saleInvoiceViewModel.ClientId == 0 && saleInvoiceViewModel.ClientName != null)
            {
                var ClientViewModel = new ClientCreateRequet()
                {
                    Address = saleInvoiceViewModel.Address,
                    ClientName = saleInvoiceViewModel.ClientName,
                    Email = saleInvoiceViewModel.Email,
                    ContactName = saleInvoiceViewModel.ContactName,
                    Note = saleInvoiceViewModel.Note,
                    Tag = saleInvoiceViewModel.Tag,
                    TaxCode = saleInvoiceViewModel.TaxCode,
                    ClientID = saleInvoiceViewModel.ClientId
                };
                _iClientService.CreateClient(ClientViewModel);

                var serchData = clientUOW.GetAll().ProjectTo<ClientViewModel>().Where(x => x.ClientName == saleInvoiceViewModel.ClientName).ToList();
                saleInvoiceModelRequest = new SaleInvoiceModelRequest()
                {
                    Address = saleInvoiceViewModel.Address,
                    AmountPaid = saleInvoiceViewModel.AmountPaid,
                    ClientName = saleInvoiceViewModel.ClientName,
                    ContactName = saleInvoiceViewModel.ContactName,
                    Discount = saleInvoiceViewModel.Discount,
                    DiscRate = saleInvoiceViewModel.DiscRate,
                    DueDate = saleInvoiceViewModel.DueDate,
                    Email = saleInvoiceViewModel.Email,
                    InvoiceId = saleInvoiceViewModel.InvoiceId,
                    InvoiceNumber = saleInvoie != null ? (saleInvoiceViewModel.InvoiceNumber == saleInvoie.InvoiceNumber ? MethodCommon.InputString(saleInvoie.InvoiceNumber) : saleInvoiceViewModel.InvoiceNumber) : (saleInvoiceViewModel.InvoiceNumber),
                    InvoiceSerial = saleInvoiceViewModel.InvoiceSerial,
                    IssueDate = saleInvoiceViewModel.IssueDate,
                    Note = saleInvoiceViewModel.Note,
                    Reference = saleInvoiceViewModel.Reference,
                    Status = saleInvoiceViewModel.Status,
                    SubTotal = saleInvoiceViewModel.SubTotal,
                    Tag = saleInvoiceViewModel.Tag,
                    TaxCode = saleInvoiceViewModel.TaxCode,
                    Term = saleInvoiceViewModel.Term,
                    VatTax = saleInvoiceViewModel.VatTax,
                    ClientId = serchData[0].ClientId,
                    TaxInvoiceNumber = saleInvoiceViewModel.TaxInvoiceNumber,
                    Check = saleInvoiceViewModel.Check
                };
                var saleInvoiceCreate = Mapper.Map<SaleInvoiceModelRequest, SaleInvoice>(saleInvoiceModelRequest);
                saveInv = _SaleInvoiceRepository.SaveSaleInvoice(saleInvoiceCreate);
                _uow.SaveChanges();
            }
            var createTaxIv = await CreateTaxIv(saleInvoiceModelRequest, saveInv);
            var saleInvoice = new List<SaleInvoiceViewModel>();
            saleInvoice.Add(saleInvoie);
            var saleInvoieLast = _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().LastOrDefault();
            var obj = new List<SaleInvoiceViewModel>()
            {
                new SaleInvoiceViewModel()
                {
                    VatTax = saleInvoieLast.VatTax,
                    AmountPaid = saleInvoieLast.VatTax,
                    ClientData = saleInvoieLast.ClientData,
                    ClientId = saleInvoieLast.ClientId,
                    Discount = saleInvoieLast.Discount,
                    DiscRate = saleInvoieLast.DiscRate,
                    DueDate = saleInvoieLast.DueDate,
                    InvoiceId = saleInvoieLast.InvoiceId,
                    InvoiceNumber = saleInvoieLast.InvoiceNumber,
                    InvoiceSerial = saleInvoieLast.InvoiceSerial,
                    IssueDate = saleInvoieLast.IssueDate,
                    Note = saleInvoieLast.Note,
                    PaymentView = saleInvoieLast.PaymentView,
                    Reference = saleInvoieLast.Reference,
                    SaleInvDetailView = saleInvoieLast.SaleInvDetailView,
                    Status =saleInvoieLast.Status,
                    SubTotal = saleInvoieLast.SubTotal,
                    Term = saleInvoieLast.Term,
                }
            };
            var listData = GetAllSaleInv(obj);
            var objData = new SaleInvoiceViewModel()
            {
                VatTax = listData[0].VatTax,
                AmountPaid = listData[0].VatTax,
                ClientData = listData[0].ClientData,
                ClientId = listData[0].ClientId,
                Discount = listData[0].Discount == null ? 0 : listData[0].Discount,
                DiscRate = listData[0].DiscRate == null ? 0 : listData[0].DiscRate,
                DueDate = listData[0].DueDate,
                InvoiceId = listData[0].InvoiceId,
                InvoiceNumber = listData[0].InvoiceNumber,
                InvoiceSerial = listData[0].InvoiceSerial,
                IssueDate = listData[0].IssueDate,
                Note = listData[0].Note,
                PaymentView = listData[0].PaymentView,
                Reference = listData[0].Reference,
                SaleInvDetailView = listData[0].SaleInvDetailView,
                Status = listData[0].Status,
                SubTotal = listData[0].SubTotal,
                Term = listData[0].Term,
                TaxInvoiceNumber = listData[0].TaxInvoiceNumber
            };
            try
            {
                var saleInvoiceGL = new SaleInvoiceGL(_uow);
                saleInvoiceGL.Insert(objData);
            }
            catch (Exception ex)
            {

            }


            return true;
        }

        public void Update(SaleInvoiceViewModel saleInvoiceViewModel)
        {
            var clientData = new Client();
            if (saleInvoiceViewModel.ClientId > 0)
            {
                _uow.BeginTransaction();
                var saleInvoiceList = _uow.GetRepository<IRepository<SaleInvoice>>();
                var saleInvoice = Mapper.Map<SaleInvoiceViewModel, SaleInvoice>(saleInvoiceViewModel);
                var updateSaleInvoice = _SaleInvoiceRepository.UpdateSaleInv(saleInvoiceViewModel);
                _uow.SaveChanges();
                 _uow.CommitTransaction();
                if (saleInvoiceViewModel.ClientData.Count() > 0)
                {
                    var requetsCl = new ClientCreateRequet
                    {
                        Address = saleInvoiceViewModel.ClientData[0].Address,
                        ClientID = saleInvoiceViewModel.ClientData[0].ClientId,
                        ClientName = saleInvoiceViewModel.ClientData[0].ClientName,
                        ContactName = saleInvoiceViewModel.ClientData[0].ContactName,
                        Email = saleInvoiceViewModel.ClientData[0].Email,
                        // Note = saleInvoiceViewModel.ClientData[0].Note,
                        Tag = saleInvoiceViewModel.ClientData[0].Tag,
                        TaxCode = saleInvoiceViewModel.ClientData[0].TaxCode,
                    };
                    _uow.BeginTransaction();
                    _ClientRepository.UpdateCl(requetsCl);
                    _uow.SaveChanges();
                    _uow.CommitTransaction();
                }
                if (updateSaleInvoice == true && saleInvoiceViewModel.Check)
                {
                    _uow.BeginTransaction();
                    UpdateTaxInv(saleInvoice, saleInvoiceViewModel);
                    _uow.SaveChanges();
                    _uow.CommitTransaction();
                }
            }
            else if (saleInvoiceViewModel.ClientId == 0 && saleInvoiceViewModel.ClientData.Count() > 0)
            {
                var requetsCl = new ClientCreateRequet
                {
                    Address = saleInvoiceViewModel.ClientData[0].Address,
                    ClientID = saleInvoiceViewModel.ClientData[0].ClientId,
                    ClientName = saleInvoiceViewModel.ClientData[0].ClientName,
                    ContactName = saleInvoiceViewModel.ClientData[0].ContactName,
                    Email = saleInvoiceViewModel.ClientData[0].Email,
                    Note = saleInvoiceViewModel.ClientData[0].Note,
                    Tag = saleInvoiceViewModel.ClientData[0].Tag,
                    TaxCode = saleInvoiceViewModel.ClientData[0].TaxCode,
                };
                _uow.BeginTransaction();
                var clientdata = _iClientService.CreateClientInv(requetsCl);
                clientData = clientdata;
                var saleInvoiceList = _uow.GetRepository<IRepository<SaleInvoice>>();
                var saleInvoice = Mapper.Map<SaleInvoiceViewModel, SaleInvoice>(saleInvoiceViewModel);
                saleInvoice.clientID = clientdata.clientID;
                saleInvoiceList.Update(saleInvoice);
             //   _uow.CommitTransaction();

             //   _uow.BeginTransaction();
                UpdateTaxInv(saleInvoice, saleInvoiceViewModel);
                _uow.SaveChanges();
                _uow.CommitTransaction();
            }
            if (saleInvoiceViewModel.SaleInvDetailView.Count() > 0)
            {
                for (int i = 0; i < saleInvoiceViewModel.SaleInvDetailView.Count; i++)
                {
                    if (saleInvoiceViewModel.SaleInvDetailView[i].Id > 0)
                    {
                        SaleInvDetailViewModel rs = null;
                        if (saleInvoiceViewModel.SaleInvDetailView[i].ProductName.Split("(").Length > 1)
                        {
                            rs = new SaleInvDetailViewModel
                            {
                                Amount = saleInvoiceViewModel.SaleInvDetailView[i].Amount,
                                ProductName = Regex.Replace(saleInvoiceViewModel.SaleInvDetailView[i].ProductName.Split("(")[0], @"\s+$", "") ,
                                Description = saleInvoiceViewModel.SaleInvDetailView[i].Description,
                                Id = saleInvoiceViewModel.SaleInvDetailView[i].Id,
                                InvoiceId = saleInvoiceViewModel.SaleInvDetailView[i].InvoiceId,
                                Price = saleInvoiceViewModel.SaleInvDetailView[i].Price,
                                ProductId = saleInvoiceViewModel.SaleInvDetailView[i].ProductId,
                                Qty = saleInvoiceViewModel.SaleInvDetailView[i].Qty,
                                Vat = saleInvoiceViewModel.SaleInvDetailView[i].Vat
                            };
                        }
                        else
                        {
                            rs = new SaleInvDetailViewModel
                            {
                                Amount = saleInvoiceViewModel.SaleInvDetailView[i].Amount,
                                ProductName = saleInvoiceViewModel.SaleInvDetailView[i].ProductName,
                                Description = saleInvoiceViewModel.SaleInvDetailView[i].Description,
                                Id = saleInvoiceViewModel.SaleInvDetailView[i].Id,
                                InvoiceId = saleInvoiceViewModel.SaleInvDetailView[i].InvoiceId,
                                Price = saleInvoiceViewModel.SaleInvDetailView[i].Price,
                                ProductId = saleInvoiceViewModel.SaleInvDetailView[i].ProductId,
                                Qty = saleInvoiceViewModel.SaleInvDetailView[i].Qty,
                                Vat = saleInvoiceViewModel.SaleInvDetailView[i].Vat
                            };
                        }
                        var update =_SaleInvoiceDetailRepository.UpdateSaleInvDetail(rs);
                        _uow.SaveChanges();
                        if (saleInvoiceViewModel.Check && !saleInvoiceViewModel.OldCheck)
                        {
                            UpdateTaxDetail(update);
                        }
                    }
                    else
                    {
                        if (saleInvoiceViewModel.SaleInvDetailView[i].ProductId == 0)
                        {
                            ProductViewModel product = null; ;
                            if (saleInvoiceViewModel.SaleInvDetailView[i].ProductName.Split("(").Length > 1)
                            {
                                product = new ProductViewModel()
                                {
                                    description = saleInvoiceViewModel.SaleInvDetailView[i].Description,
                                    productID = saleInvoiceViewModel.SaleInvDetailView[i].ProductId,
                                    productName = saleInvoiceViewModel.SaleInvDetailView[i].ProductName.Split("(")[0],
                                    unitPrice = saleInvoiceViewModel.SaleInvDetailView[i].Price,
                                    Unit = saleInvoiceViewModel.SaleInvDetailView[i].ProductName.Split("(")[1].Split(")")[0],
                                    categoryID = 1
                                };
                            }
                            else
                            {
                                product = new ProductViewModel()
                                {
                                    description = saleInvoiceViewModel.SaleInvDetailView[i].Description,
                                    productID = saleInvoiceViewModel.SaleInvDetailView[i].ProductId,
                                    productName = saleInvoiceViewModel.SaleInvDetailView[i].ProductName.Split("(")[0],
                                    unitPrice = saleInvoiceViewModel.SaleInvDetailView[i].Price,
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
                        // var serchData = _iProductRepository.GetLDFProduct();
                        var saleDetailPrd = new SaleInvDetailViewModel
                        {
                            Amount = saleInvoiceViewModel.SaleInvDetailView[i].Price * saleInvoiceViewModel.SaleInvDetailView[i].Qty,
                            Qty = saleInvoiceViewModel.SaleInvDetailView[i].Qty,
                            Price = saleInvoiceViewModel.SaleInvDetailView[i].Price,
                            Description = saleInvoiceViewModel.SaleInvDetailView[i].Description,
                            Id = saleInvoiceViewModel.SaleInvDetailView[i].Id,
                            InvoiceId = saleInvoiceViewModel.SaleInvDetailView[i].InvoiceId,
                            ProductId = saleInvoiceViewModel.SaleInvDetailView[i].ProductId != 0 ? saleInvoiceViewModel.SaleInvDetailView[i].ProductId : _iProductRepository.GetLDFProduct().LastOrDefault().productID,
                            ProductName = saleInvoiceViewModel.SaleInvDetailView[i].ProductName.Split("(")[0],
                            Vat = saleInvoiceViewModel.SaleInvDetailView[i].Vat
                        };
                        var createData = _SaleInvoiceDetailRepository.CreateSaleIvDetail(saleDetailPrd);
                        _uow.SaveChanges();
                        SaveTaxDetail(createData);
                    }
                }
            }
            var sale = new List<SaleInvoiceViewModel>()
            {
                new SaleInvoiceViewModel()
                {
                    VatTax = saleInvoiceViewModel.VatTax,
                    AmountPaid = saleInvoiceViewModel.VatTax,
                    ClientData = saleInvoiceViewModel.ClientData,
                    ClientId = saleInvoiceViewModel.ClientId,
                    Discount = saleInvoiceViewModel.Discount,
                    DiscRate = saleInvoiceViewModel.DiscRate,
                    DueDate = saleInvoiceViewModel.DueDate,
                    InvoiceId = saleInvoiceViewModel.InvoiceId,
                    InvoiceNumber = saleInvoiceViewModel.InvoiceNumber,
                    InvoiceSerial = saleInvoiceViewModel.InvoiceSerial,
                    IssueDate = saleInvoiceViewModel.IssueDate,
                    Note = saleInvoiceViewModel.Note,
                    PaymentView = saleInvoiceViewModel.PaymentView,
                    Reference = saleInvoiceViewModel.Reference,
                    SaleInvDetailView = saleInvoiceViewModel.SaleInvDetailView,
                    Status = saleInvoiceViewModel.Status,
                    SubTotal = saleInvoiceViewModel.SubTotal,
                    Term = saleInvoiceViewModel.Term,
                    TaxInvoiceNumber = saleInvoiceViewModel.TaxInvoiceNumber
                }
            };
            var listData = GetAllSaleInv(sale);
            var clienView = new List<ClientViewModel>();
            if (listData[0].ClientData.Count() == 0)
            {
                var obj = new ClientViewModel
                {
                    Address = clientData.address,
                    bankAccount = clientData.bankAccount,
                    ClientId = clientData.clientID,
                    ClientName = clientData.clientName,
                    ContactName = clientData.contactName,
                    Email = clientData.email,
                    Note = clientData.note,
                    Tag = clientData.Tag,
                    TaxCode = clientData.taxCode
                };
                clienView.Add(obj);
            }
            var objData = new SaleInvoiceViewModel()
            {
                VatTax = listData[0].VatTax,
                AmountPaid = listData[0].VatTax,
                ClientData = listData[0].ClientData.Count() == 0 ? clienView : listData[0].ClientData,
                ClientId = listData[0].ClientId == 0 ? clientData.clientID : listData[0].ClientId,
                Discount = listData[0].Discount == null ? 0 : listData[0].Discount,
                DiscRate = listData[0].DiscRate == null ? 0 : listData[0].DiscRate,
                DueDate = listData[0].DueDate,
                InvoiceId = listData[0].InvoiceId,
                InvoiceNumber = listData[0].InvoiceNumber,
                InvoiceSerial = listData[0].InvoiceSerial,
                IssueDate = listData[0].IssueDate,
                Note = listData[0].Note,
                PaymentView = listData[0].PaymentView,
                Reference = listData[0].Reference,
                SaleInvDetailView = listData[0].SaleInvDetailView,
                Status = listData[0].Status,
                SubTotal = listData[0].SubTotal,
                Term = listData[0].Term,
                TaxInvoiceNumber = listData[0].TaxInvoiceNumber
            };
            var saleInvoiceGL = new SaleInvoiceGL(_uow);
            _uow.BeginTransaction();
            saleInvoiceGL.update(objData);
            _uow.CommitTransaction();
        }

        private void SaveTaxDetail(SaleInvDetail saleDetailData)
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
                taxInvoiceID = 0,
                vat = saleDetailData.vat,
                SaleInvDetailID = saleDetailData.ID
            };
            var invData = _SaleInvoiceRepository.GetSaleInvoiceById(saleDetailData.invoiceID).Result;
            var libTaxInv = _libTaxSaleInvoiceRepository.GetTaxInvoiceBySaleInvId(invData.ToList()[0].TaxInvoiceNumber).Result;
            taxSaleInvoiceModelRequest.taxInvoiceID = libTaxInv.ToList()[0].taxInvoiceID;
            var saveTaxInv = _libTaxSaleDetailInvoiceRepository.CreateTaxSaleIvDetail(taxSaleInvoiceModelRequest).Result;
        }
        private void UpdateTaxDetail(SaleInvDetail saleDetailPrd)
        {
            var taxInvDetailViewModel = new TaxInvDetailViewModel()
            {
                vat = saleDetailPrd.vat,
                taxInvoiceID = 0,
                ID = 0,
                qty = saleDetailPrd.qty,
                productName = saleDetailPrd.productName,
                amount = saleDetailPrd.amount,
                description = saleDetailPrd.description,
                price = saleDetailPrd.price,
                productID = saleDetailPrd.productID,
                SaleInvDetailID = saleDetailPrd.ID
            };
            var invData = _SaleInvoiceRepository.GetSaleInvoiceById(saleDetailPrd.invoiceID).Result;
             var libTaxInv = _libTaxSaleInvoiceRepository.GetTaxInvoiceBySaleInvId(invData.ToList()[0].TaxInvoiceNumber).Result;
            taxInvDetailViewModel.taxInvoiceID = libTaxInv.ToList()[0].taxInvoiceID;
            var getDetailId = _libTaxSaleDetailInvoiceRepository.GetTaxInvoiceBySaleInvDetailId(saleDetailPrd.ID).Result;
            if (getDetailId != null)
            {
                taxInvDetailViewModel.ID = getDetailId.ID;
                var saveTaxInv = _libTaxSaleDetailInvoiceRepository.UpdateTaxSaleInvDetail(taxInvDetailViewModel);
            }else
            {

                if (libTaxInv != null)
                {
                    var taxSaleInvoiceModelRequest = new TaxInvDetailViewModel()
                    {
                        amount = saleDetailPrd.amount,
                        description = saleDetailPrd.description,
                        ID = 0,
                        price = saleDetailPrd.price,
                        productID = saleDetailPrd.productID,
                        productName = saleDetailPrd.productName,
                        qty = saleDetailPrd.qty,
                        taxInvoiceID = libTaxInv.ToList()[0].taxInvoiceID,
                        vat = saleDetailPrd.vat,
                        SaleInvDetailID = saleDetailPrd.ID,
                    };

                    var save = _libTaxSaleDetailInvoiceRepository.CreateTaxSaleIvDetail(taxSaleInvoiceModelRequest).Result;
                    _uow.SaveChanges();
                }
            }
            
        }

        private void UpdateTaxInv(SaleInvoice saleInvoice, SaleInvoiceViewModel saleInvoiceViewModel)
        {
            if (saleInvoiceViewModel.Check == true && saleInvoiceViewModel.OldTaxInvoiceNumber != "" && saleInvoiceViewModel.OldCheck ==  true)
            {
                var taxSaleInvoiceModelRequest = new TaxSaleInvoiceModelRequest()
                {
                    amountPaid = saleInvoice.amountPaid,
                    vatTax = saleInvoice.vatTax,
                    term = saleInvoice.term,
                    clientID = Convert.ToInt32(saleInvoice.clientID),
                    discount = saleInvoice.discount,
                    taxInvoiceID = 0,
                    discRate = saleInvoice.discRate,
                    dueDate = saleInvoice.dueDate,
                    invoiceNumber = saleInvoice.invoiceNumber,
                    invoiceSerial = saleInvoice.invoiceSerial,
                    issueDate = saleInvoice.issueDate,
                    note = saleInvoice.note,
                    reference = saleInvoice.reference,
                    status = saleInvoice.status,
                    subTotal = saleInvoice.subTotal,
                    taxInvoiceNumber = saleInvoice.TaxInvoiceNumber,
                };

                var ud = _libTaxSaleInvoiceRepository.UpdateTaxInvoice(taxSaleInvoiceModelRequest, saleInvoiceViewModel.OldTaxInvoiceNumber).Result;
                if (ud == true)
                {
                    var rq = new Invoice_TaxInvoiceViewModel()
                    {
                        amount = saleInvoice.subTotal,
                        invoiceNumber = saleInvoice.invoiceNumber,
                        isSale = true,
                        taxInvoiceNumber = saleInvoice.TaxInvoiceNumber,
                    };
                    var save = _invoice_TaxInvoiceRepository.UpdateInvoiceTaxInvoice(rq, saleInvoiceViewModel.OldTaxInvoiceNumber, saleInvoiceViewModel.OldInvoiceNumber).Result;
                }
            } else if (saleInvoiceViewModel.Check  && !saleInvoiceViewModel.OldCheck)
            {
                var saleInvoiceModelRequest = new SaleInvoiceModelRequest()
                {
                    AmountPaid = saleInvoiceViewModel.AmountPaid,
                    Discount = saleInvoiceViewModel.Discount,
                    DiscRate = saleInvoiceViewModel.DiscRate,
                    DueDate = saleInvoiceViewModel.DueDate,
                    InvoiceId = saleInvoiceViewModel.InvoiceId,
                    InvoiceNumber = saleInvoiceViewModel.InvoiceNumber,
                    InvoiceSerial = saleInvoiceViewModel.InvoiceSerial,
                    IssueDate = saleInvoiceViewModel.IssueDate,
                    Note = saleInvoiceViewModel.Note,
                    Reference = saleInvoiceViewModel.Reference,
                    Status = saleInvoiceViewModel.Status,
                    SubTotal = saleInvoiceViewModel.SubTotal,
                    Term = saleInvoiceViewModel.Term,
                    VatTax = saleInvoiceViewModel.VatTax,
                    ClientId = Convert.ToInt32(saleInvoiceViewModel.ClientId),
                    TaxInvoiceNumber = saleInvoiceViewModel.TaxInvoiceNumber,
                    Check = saleInvoiceViewModel.Check
                };
                var save = CreateTaxIv(saleInvoiceModelRequest, saleInvoice).Result;
            }
            
        }

        private IEnumerable<PaymentViewModel> GetByIDPay(long id)
        {
            var payList = _uow.GetRepository<IRepository<Payments>>();
            var listPay = payList.GetAll().ProjectTo<PaymentViewModel>().Where(x => x.InvoiceId == id).ToList();
            return listPay;
        }

        private IEnumerable<SaleInvDetailViewModel> GetByIDInDetail(long id)
        {
            var payList = _uow.GetRepository<IRepository<SaleInvDetail>>();
            var listInDetail = payList.GetAll().ProjectTo<SaleInvDetailViewModel>().Where(x => x.InvoiceId == id).ToList();
            var dataList = new List<SaleInvDetailViewModel>();
            foreach (var item in listInDetail)
            {
                var data = new SaleInvDetailViewModel()
                {
                    Amount = item.Amount,
                    Description = item.Description,
                    Id = item.Id,
                    InvoiceId = item.InvoiceId,
                    Price = item.Price,
                    ProductId = item.ProductId,
                    ProductName = (_iProductRepository.GetByProductId(Int32.Parse(item.ProductId.ToString())).Unit != null) ? item.ProductName + " " + "(" + _iProductRepository.GetByProductId(Int32.Parse(item.ProductId.ToString())).Unit + ")" : item.ProductName,
                    Qty = item.Qty,
                    Vat = item.Vat,
                };
                dataList.Add(data);
            }
            return dataList;
        }

        private IEnumerable<ClientViewModel> GetClientByID(int? id)
        {
            var payList = _uow.GetRepository<IRepository<Client>>();
            var listInDetail = payList.GetAll().ProjectTo<ClientViewModel>().Where(x => x.ClientId == id).ToList();
            return listInDetail;
        }

        private List<SaleInvoiceViewModel> GetAllSaleInv(List<SaleInvoiceViewModel> saleInvoie)
        {
            var listData = new List<SaleInvoiceViewModel>();
            foreach (var item in saleInvoie)
            {
                var listInvo = new SaleInvoiceViewModel()
                {
                    Check = item.TaxInvoiceNumber== null || item.TaxInvoiceNumber == "" ? false : _libTaxSaleInvoiceRepository.GetTaxInvoiceBySaleInvId(item.TaxInvoiceNumber).Result.Any(),
                    InvoiceId = item.InvoiceId,
                    AmountPaid = item.AmountPaid,
                    ClientId = item.ClientId,
                    Discount = item.Discount,
                    DiscRate = item.DiscRate,
                    DueDate = item.DueDate,
                    InvoiceNumber = item.InvoiceNumber,
                    InvoiceSerial = item.InvoiceSerial,
                    TaxInvoiceNumber = item.TaxInvoiceNumber,
                    IssueDate = item.IssueDate,
                    Note = item.Note,
                    Reference = item.Reference,
                    SaleInvDetailView = GetByIDInDetail(item.InvoiceId).ToList(),
                    Status = item.Status,
                    SubTotal = item.SubTotal,
                    Term = item.Term,
                    VatTax = item.VatTax,
                    PaymentView = GetByIDPay(item.InvoiceId).ToList(),
                    ClientData = (item.ClientId != null) ? GetClientByID(item.ClientId).ToList() : null
                };
                listData.Add(listInvo);
            }

            return listData;
        }

        public async Task<IEnumerable<SaleInvoiceViewModel>> GetSaleInvoiceById(long id)
        {
            var saleInvoie = await _SaleInvoiceRepository.GetSaleInvoiceById(id);
            List<SaleInvoiceViewModel> listData = GetAllSaleInv(saleInvoie.ToList());
            return listData;
        }
        //public async Task<TaxSaleInvoice> CheckSaleInvoiceById(string taxNum)
        //{
        //    var saleInvoie = await _libTaxSaleInvoiceRepository.GetTaxInvoiceBySaleInvId(taxNum);
        //    return saleInvoie.ToList()[0];
        //}

        public async Task<bool> DeletedSaleInv(List<requestDeleted> deleted)
        {
            foreach (var item in deleted)
            {
                var saleInvViewModel = await GetSaleInvoiceById(item.id);
                var saleInvoiceGL = new SaleInvoiceGL(_uow);
                saleInvoiceGL.delete(saleInvViewModel.ToList()[0]);
                var getSaleInVDt = await _SaleInvoiceDetailRepository.GetSaleInvByinID(item.id);
                _SaleInvoiceDetailRepository.RemoveAll(getSaleInVDt);
                var rmIv = _SaleInvoiceRepository.removeInv(item.id);
                if (rmIv)
                   await _invoice_TaxInvoiceRepository.UpdateInvoiceTaxInvoiceRecordInvoice(item.id);
                _uow.SaveChanges();
            }
           
            return await Task.FromResult(true);
        }

        public SaleInvoiceViewModel GetALlDF()
        {
            var data = _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().LastOrDefault();
            return data;
        }

        public SaleInvoiceViewModel GetLastInvoice()
        {
            var data = _SaleInvoiceRepository.GetLastInvoice();
            var lastInvoice = new SaleInvoiceViewModel();
            if (data.Result != null && data.Result.InvoiceId > 0)
            {
                lastInvoice = data.Result;
                lastInvoice.InvoiceNumber = MethodCommon.InputString(lastInvoice.InvoiceNumber);
                return lastInvoice;
            }
            else
            {
                return lastInvoice;
            }

        }

        public async Task<bool> CreateTaxIv(SaleInvoiceModelRequest saleInvoiceModelRequest, SaleInvoice sale)
        {
            var taxSaleLib = new TaxSaleInvoice();
            if(saleInvoiceModelRequest.Check)
            {
                var taxSaleInvoiceModelRequest = Mapper.Map<SaleInvoiceModelRequest, TaxSaleInvoiceModelRequest>(saleInvoiceModelRequest);
                if (taxSaleInvoiceModelRequest.taxInvoiceNumber != "" && taxSaleInvoiceModelRequest.taxInvoiceNumber != null)
                    taxSaleLib = _libTaxSaleInvoiceRepository.CreateTaxInvoice(taxSaleInvoiceModelRequest);
                
                var request = new Invoice_TaxInvoiceViewModel()
                {
                    amount = (sale.subTotal + sale.vatTax) - sale.discount,
                    ID = 0,
                    invoiceNumber = saleInvoiceModelRequest.InvoiceNumber,
                    isSale = true,
                    taxInvoiceNumber = saleInvoiceModelRequest.TaxInvoiceNumber,
                    invoiceID = sale.invoiceID,
                    taxInvoiceID = taxSaleLib.taxInvoiceID,
                    invoiceAmount = sale.subTotal,
                };
                await _invoice_TaxInvoiceRepository.SaveInvoiceTaxInvoice(request, true);
                _uow.SaveChanges();
            }
            return await Task.FromResult(true);
        }
    }
}

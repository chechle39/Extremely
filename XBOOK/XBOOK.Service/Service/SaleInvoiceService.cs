using AutoMapper;
using AutoMapper.QueryableExtensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
// using XAccLib.SaleInvoice;
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
        private readonly IRepository<EntryPattern> _entryUowRepository;
        public SaleInvoiceService(IProductRepository iProductRepository, ISaleInvoiceRepository saleInvoiceRepository, XBookContext context, IUnitOfWork uow, IClientRepository ClientRepository, IClientService iClientService, ISaleInvDetailService iSaleInvDetailService, ISaleInvoiceDetailRepository saleInvoiceDetailRepository)
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
            _entryUowRepository = _uow.GetRepository<IRepository<EntryPattern>>();
        }

        bool ISaleInvoiceService.CreateSaleInvoice(SaleInvoiceModelRequest saleInvoiceViewModel)
        {
            var saleInvoie = _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().LastOrDefault();
            var clientUOW = _uow.GetRepository<IRepository<Client>>();
            if (saleInvoiceViewModel.ClientId != 0)
            {
                var saleInvoiceModelRequest = new SaleInvoiceModelRequest()
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
                };
                var saleInvoiceCreate = Mapper.Map<SaleInvoiceModelRequest, SaleInvoice>(saleInvoiceModelRequest);
                try
                {
                    _uow.BeginTransaction();
                    _saleInvoiceUowRepository.AddData(saleInvoiceCreate);
                    _uow.SaveChanges();
                    _uow.CommitTransaction();
                }
                catch (Exception ex)
                {

                }

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
                    ClientId = saleInvoiceViewModel.ClientId
                };
                _iClientService.CreateClient(ClientViewModel);

                var serchData = clientUOW.GetAll().ProjectTo<ClientViewModel>().Where(x => x.ClientName == saleInvoiceViewModel.ClientName).ToList();
                var saleInvoiceModelRequest = new SaleInvoiceModelRequest()
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
                };
                var saleInvoiceCreate = Mapper.Map<SaleInvoiceModelRequest, SaleInvoice>(saleInvoiceModelRequest);
                _saleInvoiceUowRepository.AddData(saleInvoiceCreate);
                _uow.SaveChanges();
            }
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
                Discount = listData[0].Discount,
                DiscRate = listData[0].DiscRate,
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
            };
            try
            {
                //var saleInvoiceGL = new SaleInvoiceGL(_uow);
                //saleInvoiceGL.InvoiceGL(objData);
            }
            catch (Exception ex)
            {

            }


            return true;
        }

        public void Update(SaleInvoiceViewModel saleInvoiceViewModel)
        {
            if (saleInvoiceViewModel.ClientId > 0)
            {
                _uow.BeginTransaction();
                var saleInvoiceList = _uow.GetRepository<IRepository<SaleInvoice>>();
                var saleInvoice = Mapper.Map<SaleInvoiceViewModel, SaleInvoice>(saleInvoiceViewModel);
                _SaleInvoiceRepository.UpdateSaleInv(saleInvoiceViewModel);
                _uow.SaveChanges();
                _uow.CommitTransaction();
                if (saleInvoiceViewModel.ClientData.Count() > 0)
                {
                    var requetsCl = new ClientCreateRequet
                    {
                        Address = saleInvoiceViewModel.ClientData[0].Address,
                        ClientId = saleInvoiceViewModel.ClientData[0].ClientId,
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

            }
            else if (saleInvoiceViewModel.ClientId == 0 && saleInvoiceViewModel.ClientData.Count() > 0)
            {
                var requetsCl = new ClientCreateRequet
                {
                    Address = saleInvoiceViewModel.ClientData[0].Address,
                    ClientId = saleInvoiceViewModel.ClientData[0].ClientId,
                    ClientName = saleInvoiceViewModel.ClientData[0].ClientName,
                    ContactName = saleInvoiceViewModel.ClientData[0].ContactName,
                    Email = saleInvoiceViewModel.ClientData[0].Email,
                    Note = saleInvoiceViewModel.ClientData[0].Note,
                    Tag = saleInvoiceViewModel.ClientData[0].Tag,
                    TaxCode = saleInvoiceViewModel.ClientData[0].TaxCode,
                };
                var clientdata = _iClientService.CreateClient(requetsCl);
                var saleInvoiceList = _uow.GetRepository<IRepository<SaleInvoice>>();
                var saleInvoice = Mapper.Map<SaleInvoiceViewModel, SaleInvoice>(saleInvoiceViewModel);
                saleInvoice.clientID = clientdata.clientID;
                saleInvoiceList.Update(saleInvoice);
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
                        _SaleInvoiceDetailRepository.UpdateSaleInvDetail(rs);
                        _uow.SaveChanges();
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
                        var serchData = _iProductRepository.GetLDFProduct();
                        var saleDetailPrd = new SaleInvDetailViewModel
                        {
                            Amount = saleInvoiceViewModel.SaleInvDetailView[i].Price * saleInvoiceViewModel.SaleInvDetailView[i].Qty,
                            Qty = saleInvoiceViewModel.SaleInvDetailView[i].Qty,
                            Price = saleInvoiceViewModel.SaleInvDetailView[i].Price,
                            Description = saleInvoiceViewModel.SaleInvDetailView[i].Description,
                            Id = saleInvoiceViewModel.SaleInvDetailView[i].Id,
                            InvoiceId = saleInvoiceViewModel.SaleInvDetailView[i].InvoiceId,
                            ProductId = serchData.LastOrDefault().productID,
                            ProductName = saleInvoiceViewModel.SaleInvDetailView[i].ProductName.Split("(")[0],
                            Vat = saleInvoiceViewModel.SaleInvDetailView[i].Vat
                        };
                        try
                        {
                            _SaleInvoiceDetailRepository.CreateSaleIvDetail(saleDetailPrd);
                            _uow.SaveChanges();
                        }
                        catch (Exception ex)
                        {

                        }

                    }
                }
            }
        }

        //public async Task<IEnumerable<SaleInvoiceViewModel>> GetAllSaleInvoice(SaleInvoiceListRequest request)
        //{
        //    var saleInvoie = new List<SaleInvoiceViewModel>();
        //    if (string.IsNullOrEmpty(request.EndDate) && string.IsNullOrEmpty(request.StartDate) && string.IsNullOrEmpty(request.Keyword))
        //    {
        //        saleInvoie = await _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().Take(200).ToListAsync();
        //    }
        //    else
        //    {
        //        saleInvoie = await _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().ToListAsync();
        //    }
        //    List<SaleInvoiceViewModel> listData = GetAllSaleInv(saleInvoie);
        //    saleInvoie = SerchData(request.Keyword, request.StartDate, request.EndDate, listData, request.isIssueDate);
        //    return saleInvoie;
        //}

        //private static List<SaleInvoiceViewModel> SerchData(string keyword, string startDate, string endDate, List<SaleInvoiceViewModel> saleInvoie, bool? searchConditions)
        //{
        //    if (searchConditions == true)
        //    {
        //        if (!string.IsNullOrEmpty(keyword))
        //        {
        //            var lisSerch = new List<SaleInvoiceViewModel>();
        //            var fill = saleInvoie.Where(x => x.InvoiceNumber.ToLowerInvariant().Contains(keyword) || x.Note.ToLowerInvariant().Contains(keyword)).ToList();
        //            foreach (var item in saleInvoie)
        //            {
        //                var serchItem = item.ClientData.Where(x => x.ClientName.ToLowerInvariant().Contains(keyword) || x.ContactName.ToLowerInvariant().Contains(keyword) || x.Email.ToLowerInvariant().Contains(keyword));
        //                if (serchItem.Count() > 0 || fill.Count() > 0)
        //                {
        //                    lisSerch.Add(item);
        //                }
        //            }
        //            saleInvoie = lisSerch;
        //        }

        //        if (!string.IsNullOrEmpty(startDate) && !string.IsNullOrEmpty(endDate))
        //        {
        //            DateTime start = DateTime.ParseExact(startDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
        //            DateTime end = DateTime.ParseExact(endDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
        //            saleInvoie = saleInvoie.Where(x => x.IssueDate >= start && x.IssueDate <= end).ToList();
        //        }
        //        else
        //        if (!string.IsNullOrEmpty(startDate) && endDate == null)
        //        {
        //            DateTime start = DateTime.ParseExact(startDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
        //            saleInvoie = saleInvoie.Where(x => x.IssueDate >= start).ToList();
        //        }
        //        else
        //        if (!string.IsNullOrEmpty(endDate) && startDate == null)
        //        {
        //            DateTime end = DateTime.ParseExact(endDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
        //            saleInvoie = saleInvoie.Where(x => x.IssueDate <= end).ToList();
        //        }

        //    }
        //    else
        //    if (searchConditions == false)
        //    {
        //        if (!string.IsNullOrEmpty(keyword))
        //        {
        //            saleInvoie = saleInvoie.Where(x => x.InvoiceNumber.Contains(keyword) || x.Note.Contains(keyword)).ToList();
        //        }

        //        if (!string.IsNullOrEmpty(startDate) && !string.IsNullOrEmpty(endDate))
        //        {
        //            DateTime start = DateTime.ParseExact(startDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
        //            DateTime end = DateTime.ParseExact(endDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
        //            saleInvoie = saleInvoie.Where(x => x.DueDate >= start && x.DueDate <= end).ToList();
        //        }
        //        else
        //        if (!string.IsNullOrEmpty(startDate) && endDate == null)
        //        {
        //            DateTime start = DateTime.ParseExact(startDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
        //            saleInvoie = saleInvoie.Where(x => x.DueDate >= start).ToList();
        //        }
        //        else
        //        if (!string.IsNullOrEmpty(endDate) && startDate == null)
        //        {
        //            DateTime end = DateTime.ParseExact(endDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
        //            saleInvoie = saleInvoie.Where(x => x.DueDate <= end).ToList();
        //        }
        //    }
        //    else
        //    {
        //        return saleInvoie;
        //    }

        //    return saleInvoie.ToList();
        //}

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
                    InvoiceId = item.InvoiceId,
                    AmountPaid = item.AmountPaid,
                    ClientId = item.ClientId,
                    Discount = item.Discount,
                    DiscRate = item.DiscRate,
                    DueDate = item.DueDate,
                    InvoiceNumber = item.InvoiceNumber,
                    InvoiceSerial = item.InvoiceSerial,
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

            //  var saleInvoie=await _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().Where(x => x.InvoiceId == id).ToListAsync();
            var saleInvoie = await _SaleInvoiceRepository.GetSaleInvoiceById(id);
            /*saleInvoie = SerchData(null, null, null, saleInvoie.ToList(), null)*/;
            List<SaleInvoiceViewModel> listData = GetAllSaleInv(saleInvoie.ToList());
            return listData;
        }

        public async Task<bool> DeletedSaleInv(List<requestDeleted> deleted)
        {
            foreach (var item in deleted)
            {
                var saleInvViewModel = await GetSaleInvoiceById(item.id);
               // var saleInvoiceGL = new SaleInvoiceGL(_uow);
               // saleInvoiceGL.deleteGL(saleInvViewModel.ToList()[0]);
                var getSaleInVDt = _SaleInvoiceDetailRepository.GetAll().ProjectTo<SaleInvDetailViewModel>();
                var getByIdSaleInVDetail = getSaleInVDt.Where(x => x.InvoiceId == item.id);
                _SaleInvoiceDetailRepository.RemoveAll(getByIdSaleInVDetail.ToList());
                //_uow.SaveChanges();
                _SaleInvoiceRepository.removeInv(item.id);
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
    }
}

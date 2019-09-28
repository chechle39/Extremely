using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;
using XBOOK.Service.ViewModels;

namespace XBOOK.Service.Service
{

    public class SaleInvoiceService : ISaleInvoiceService
    {
        private readonly IRepository<SaleInvoice> _saleInvoiceUowRepository;
        private readonly IClientRepository _ClientRepository;
        private readonly IUnitOfWork _uow;
        public readonly IClientService _iClientService;
        public readonly ISaleInvDetailService _iSaleInvDetailService;
        public SaleInvoiceService(IUnitOfWork uow, IClientRepository ClientRepository, IClientService iClientService, ISaleInvDetailService iSaleInvDetailService)
        {
            _iClientService = iClientService;
            _iSaleInvDetailService = iSaleInvDetailService;
            _uow = uow;
            _ClientRepository = ClientRepository;
            _saleInvoiceUowRepository = _uow.GetRepository<IRepository<SaleInvoice>>();
        }

        public bool CreateSaleInvoice(SaleInvoiceModelRequest saleInvoiceViewModel)
        {
            var xx = _uow.GetRepository<IRepository<Client>>();
            var clientById = xx.GetAll().ProjectTo<ClientViewModel>().Where(x => x.ClientName == saleInvoiceViewModel.ClientName).ToList();
            if (clientById.Count > 0)
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
                    InvoiceNumber = saleInvoiceViewModel.InvoiceNumber,
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
                    ClientId = clientById[0].ClientId,
                };
                var saleInvoiceCreate = Mapper.Map<SaleInvoiceModelRequest, SaleInvoice>(saleInvoiceModelRequest);
                _saleInvoiceUowRepository.Add(saleInvoiceCreate);
            }
            else if (clientById.Count == 0 && saleInvoiceViewModel.ClientName != null)
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
                    ClientId = 0
                };
                _iClientService.CreateClient(ClientViewModel);

                var serchData = xx.GetAll().ProjectTo<ClientViewModel>().Where(x => x.ClientName == saleInvoiceViewModel.ClientName).ToList();
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
                    InvoiceNumber = saleInvoiceViewModel.InvoiceNumber,
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
                _saleInvoiceUowRepository.Add(saleInvoiceCreate);
            }


            return true;
        }
        public async Task<IEnumerable<SaleInvoiceViewModel>> GetAllSaleInvoice(SaleInvoiceListRequest request)
        {
            var saleInvoie = await _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().ToListAsync();
            saleInvoie = SerchData(request.Keyword, request.StartDate, request.EndDate, saleInvoie, request.SearchConditions);
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
                    ClientData = (item.ClientId != null)? GetClientByID(item.ClientId).ToList():null
                };
                listData.Add(listInvo);
            }
            return listData;
        }

        private static List<SaleInvoiceViewModel> SerchData(string keyword, string startDate, string endDate, List<SaleInvoiceViewModel> saleInvoie,bool searchConditions)
        {
            if (searchConditions == true)
            {
                if (!string.IsNullOrEmpty(keyword))
                {
                    saleInvoie = saleInvoie.Where(x => x.InvoiceNumber.Contains(keyword) || x.Note.Contains(keyword)).ToList();
                }

                if (!string.IsNullOrEmpty(startDate) && !string.IsNullOrEmpty(endDate))
                {
                    DateTime start = DateTime.ParseExact(startDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                    DateTime end = DateTime.ParseExact(endDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                    saleInvoie = saleInvoie.Where(x => x.IssueDate >= start && x.IssueDate <= end).ToList();
                }
                else
                if (!string.IsNullOrEmpty(startDate) && endDate == null)
                {
                    DateTime start = DateTime.ParseExact(startDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                    saleInvoie = saleInvoie.Where(x => x.IssueDate >= start).ToList();
                }
                else
                if (!string.IsNullOrEmpty(endDate) && startDate == null)
                {
                    DateTime end = DateTime.ParseExact(endDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                    saleInvoie = saleInvoie.Where(x => x.IssueDate <= end).ToList();
                }
            }else
            {
                if (!string.IsNullOrEmpty(keyword))
                {
                    saleInvoie = saleInvoie.Where(x => x.InvoiceNumber.Contains(keyword) || x.Note.Contains(keyword)).ToList();
                }

                if (!string.IsNullOrEmpty(startDate) && !string.IsNullOrEmpty(endDate))
                {
                    DateTime start = DateTime.ParseExact(startDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                    DateTime end = DateTime.ParseExact(endDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                    saleInvoie = saleInvoie.Where(x => x.DueDate >= start && x.DueDate <= end).ToList();
                }
                else
                if (!string.IsNullOrEmpty(startDate) && endDate == null)
                {
                    DateTime start = DateTime.ParseExact(startDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                    saleInvoie = saleInvoie.Where(x => x.DueDate >= start).ToList();
                }
                else
                if (!string.IsNullOrEmpty(endDate) && startDate == null)
                {
                    DateTime end = DateTime.ParseExact(endDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                    saleInvoie = saleInvoie.Where(x => x.DueDate <= end).ToList();
                }
            }
            

            return saleInvoie;
        }

        private IEnumerable<PaymentViewModel> GetByIDPay(long id)
        {
            var payList = _uow.GetRepository<IRepository<Payments>>();
            var listPay = payList.GetAll().ProjectTo<PaymentViewModel>().ToList().Where(x=>x.InvoiceId == id);
            return listPay;
        }

        private IEnumerable<SaleInvDetailViewModel> GetByIDInDetail(long id)
        {
            var payList = _uow.GetRepository<IRepository<SaleInvDetail>>();
            var listInDetail = payList.GetAll().ProjectTo<SaleInvDetailViewModel>().ToList().Where(x => x.InvoiceId == id);
            return listInDetail;
        }

        private IEnumerable<ClientViewModel> GetClientByID(int? id)
        {
            var payList = _uow.GetRepository<IRepository<Client>>();
            var listInDetail = payList.GetAll().ProjectTo<ClientViewModel>().ToList().Where(x => x.ClientId == id);
            return listInDetail;
        }

        public async Task Update(SaleInvoiceViewModel saleInvoiceViewModel)
        {
            var saleInvoiceList = _uow.GetRepository<IRepository<SaleInvoice>>();
            var saleInvoice = Mapper.Map<SaleInvoiceViewModel, SaleInvoice>(saleInvoiceViewModel);
            await saleInvoiceList.Update(saleInvoice);
        }
    }
}

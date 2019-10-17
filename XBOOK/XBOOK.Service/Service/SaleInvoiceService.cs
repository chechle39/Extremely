using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
// using XAccLib.SaleInvoice;
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
        private readonly IUnitOfWork _uow;
        public readonly IClientService _iClientService;
        public readonly ISaleInvDetailService _iSaleInvDetailService;
        private readonly XBookContext _context;
        public SaleInvoiceService(XBookContext context,IUnitOfWork uow, IClientRepository ClientRepository, IClientService iClientService, ISaleInvDetailService iSaleInvDetailService)
        {
            _context = context;
            _iClientService = iClientService;
            _iSaleInvDetailService = iSaleInvDetailService;
            _uow = uow;
            _ClientRepository = ClientRepository;
            _saleInvoiceUowRepository = _uow.GetRepository<IRepository<SaleInvoice>>();
        }

        bool ISaleInvoiceService.CreateSaleInvoice(SaleInvoiceModelRequest saleInvoiceViewModel)
        {
            var saleInvoie = _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().LastOrDefault();
            //var countZero = saleInvoie.InvoiceNumber.Count(x => x == matchChar);
            //string DZr = "D" + (countZero + 1);
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
                    InvoiceNumber = InputString(saleInvoie.InvoiceNumber),
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
                _saleInvoiceUowRepository.AddData(saleInvoiceCreate);
                _uow.SaveChanges();
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
                    InvoiceNumber = InputString(saleInvoie.InvoiceNumber),
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
            // var saleInvoiceGL = new SaleInvoiceGL(_uow);
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
            //saleInvoiceGL.InvoiceGL(objData);

            return true;
        }

        public async Task Update(SaleInvoiceViewModel saleInvoiceViewModel)
        {
            var saleInvoiceList = _uow.GetRepository<IRepository<SaleInvoice>>();
            var saleInvoice = Mapper.Map<SaleInvoiceViewModel, SaleInvoice>(saleInvoiceViewModel);
            await saleInvoiceList.Update(saleInvoice);
        }

        public async Task<IEnumerable<SaleInvoiceViewModel>> GetAllSaleInvoice(SaleInvoiceListRequest request)
        {
            var saleInvoie = await _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().ToListAsync();
            saleInvoie = SerchData(request.Keyword, request.StartDate, request.EndDate, saleInvoie, request.isIssueDate);
            List<SaleInvoiceViewModel> listData = GetAllSaleInv(saleInvoie);
            return listData;
        }

        private static List<SaleInvoiceViewModel> SerchData(string keyword, string startDate, string endDate, List<SaleInvoiceViewModel> saleInvoie,bool? searchConditions)
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

        public static string InputString(string value)
        {
            int carry = 1;
            string res = "";
            for (int i = value.Length - 1; i > 0; i--)
            {
                int chars = 0;
                chars += ((int)value[i]);
                chars += carry;
                if (chars > 90)
                {
                    chars = 65;
                    carry = 1;
                }
                else
                {
                    carry = 0;
                }

                if (chars > 57 && chars < 65)
                {
                    carry = 1;
                }

                res = Convert.ToChar(chars) + res;

                if (carry != 1)
                {
                    res = value.Substring(0, i) + res;
                    break;
                }
            }
            if (carry == 1)
            {
                res = 'A' + res;
            }
            string resStr = res.Replace(":", "0");
            return resStr;
        }

        public async Task<IEnumerable<SaleInvoiceViewModel>> GetSaleInvoiceById(long id)
        {

            var saleInvoie=await _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().Where(x => x.InvoiceId == id).ToListAsync();
            saleInvoie = SerchData(null, null, null, saleInvoie, null);
            List<SaleInvoiceViewModel> listData = GetAllSaleInv(saleInvoie);
            return listData;
        }

        public async Task DeletedSaleInv(long id)
        {
            await _saleInvoiceUowRepository.Remove(id);
        }

        public SaleInvoiceViewModel GetALlDF()
        {
            var data =  _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().LastOrDefault();
            return data;
        }
    }
}

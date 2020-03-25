using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class MoneyReceiptService : IMoneyReceiptService
    {
        private readonly IPaymentsService _paymentsService;
        private readonly ISaleInvoiceService _saleInvoiceService;
        private readonly IMoneyReceiptRepository _iMoneyReceiptRepository;
        private readonly ISaleInvoiceRepository _saleInvoiceRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IUnitOfWork _uow;
        public MoneyReceiptService(IPaymentRepository paymentRepository, ISaleInvoiceRepository saleInvoiceRepository,IUnitOfWork uow, IMoneyReceiptRepository iMoneyReceiptRepository, IPaymentsService paymentsService, ISaleInvoiceService saleInvoiceService)
        {
            _uow = uow;
            _iMoneyReceiptRepository = iMoneyReceiptRepository;
            _paymentsService = paymentsService;
            _saleInvoiceService = saleInvoiceService;
            _saleInvoiceRepository = saleInvoiceRepository;
            _paymentRepository = paymentRepository;
        }

        public async Task<bool> CreateMoneyReceipt(MoneyReceiptViewModel request)
        {
            var save = await _iMoneyReceiptRepository.CreateMoneyReceipt(request);
            _uow.SaveChanges();
            return save;
        }

        public async Task<bool> CreateMoneyReceiptPaymentAsync(MoneyReceiptPayment request)
        {
            Payments payMent = null;
            foreach (var item in request.InvoiceId)
            {
                if (item.AmountIv > 0)
                {
                    payMent = new Payments
                    {
                        invoiceID = item.InvoiceId,
                        amount = item.AmountIv,
                        ID = 0,
                        note = request.Note,
                        payDate = request.PayDate,
                        payType = request.PayType,
                        payName = request.PayName,
                        receiptNumber = request.ReceiptNumber,
                    };
                    var payUw = _uow.GetRepository<IRepository<Payments>>();
                    payUw.AddData(payMent);
                    _uow.SaveChanges();
                    var payMentById = _paymentsService.GetAllPaymentsByInv(item.InvoiceId).Result;
                    var sumPayMent = payMentById.AsEnumerable().Sum(x => x.Amount);
                   _saleInvoiceRepository.UpdateSaleInvEn(item, sumPayMent);
                    _uow.SaveChanges();
                }
                
            }

            var rs = new MoneyReceiptViewModel()
            {
                Amount = request.Amount,
                BankAccount = request.BankAccount,
                ClientID = request.ClientID,
                ClientName = request.ClientName,
                EntryType = request.EntryType,
                ID = 0,
                Note = request.Note,
                PayDate = request.PayDate,
                PayType = request.PayType,
                PayName = request.PayName,
                ReceiptNumber = request.ReceiptNumber,
                ReceiverName = request.ReceiverName
            };
            return await CreateMoneyReceipt(rs);
        }

        public async Task<bool> DeletedMoneyReceipt(List<requestDeleted> request)
        {
            var remove = await _iMoneyReceiptRepository.Deleted(request);
            foreach(var item in request)
            {
                await _paymentRepository.DeletedPaymentAsync(item.receiptNumber);
            }
            _uow.SaveChanges();
            return remove;
        }

        public async Task<MoneyReceiptViewModel> GetLastMoneyReceipt()
        {
            var data = await _iMoneyReceiptRepository.GetLastMoneyReceipt();
            return data;
        }

        public async Task<MoneyReceiptViewModel> GetMoneyById(MoneyReceiptID request)
        {
            var data = await _iMoneyReceiptRepository.GetMoneyByIdAsync(request);
            return data;
        }

        public async Task<MoneyReceiptByIdViewModel> GetMoneyByIdObject(long id)
        {
            var data = await _iMoneyReceiptRepository.GetMoneyByIdObject(id);
            return data;
        }

        public async Task<bool> Update(MoneyReceiptViewModel request)
        {
            var data = await _iMoneyReceiptRepository.Update(request);
            _uow.SaveChanges();
            return data;
        }
    }
}

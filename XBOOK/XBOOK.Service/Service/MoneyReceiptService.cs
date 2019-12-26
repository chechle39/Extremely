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
        private readonly IUnitOfWork _uow;
        public MoneyReceiptService(IUnitOfWork uow, IMoneyReceiptRepository iMoneyReceiptRepository, IPaymentsService paymentsService, ISaleInvoiceService saleInvoiceService)
        {
            _uow = uow;
            _iMoneyReceiptRepository = iMoneyReceiptRepository;
            _paymentsService = paymentsService;
            _saleInvoiceService = saleInvoiceService;
        }

        public async Task<bool> CreateMoneyReceipt(MoneyReceiptViewModel request)
        {
            var save = await _iMoneyReceiptRepository.CreateMoneyReceipt(request);
            _uow.SaveChanges();
            return save;
        }

        public Task<bool> CreateMoneyReceiptPayment(MoneyReceiptPayment request)
        {
            PaymentViewModel payMent = null;
            foreach(var item in request.InvoiceId)
            {
                payMent = new PaymentViewModel
                {
                    InvoiceId = item.InvoiceId,
                    Amount = item.AmountIv,
                    Id = 0,
                    Note = request.Note,
                    PayDate = request.PayDate,
                    PayType = request.PayType,
                    PayTypeID = request.PayTypeID,
                    ReceiptNumber = request.ReceiptNumber,
                };
                _paymentsService.SavePayMent(payMent);
                var payMentById = _paymentsService.GetAllPaymentsByInv(item.InvoiceId).Result;
                var sumPayMent = payMentById.AsEnumerable().Sum(x => x.Amount);
                var invoiceById = _saleInvoiceService.GetSaleInvoiceById(item.InvoiceId).Result;
                var saleInRq = new SaleInvoice()
                {
                    amountPaid = sumPayMent,
                    clientID = invoiceById.ToList()[0].ClientId,
                    discount = invoiceById.ToList()[0].Discount,
                    discRate = invoiceById.ToList()[0].DiscRate,
                    dueDate = invoiceById.ToList()[0].DueDate,
                    invoiceID = invoiceById.ToList()[0].InvoiceId,
                    invoiceNumber = invoiceById.ToList()[0].InvoiceNumber,
                    invoiceSerial = invoiceById.ToList()[0].InvoiceSerial,
                    issueDate = invoiceById.ToList()[0].IssueDate,
                    note = invoiceById.ToList()[0].Note,
                    reference = invoiceById.ToList()[0].Reference,
                    status = invoiceById.ToList()[0].Status,
                    subTotal = invoiceById.ToList()[0].SubTotal,
                    term = invoiceById.ToList()[0].Term,
                    vatTax = invoiceById.ToList()[0].VatTax,
                };
                _saleInvoiceService.UpdateSaleInvPay(saleInRq);
            }

            

            throw new NotImplementedException();
        }

        public async Task<bool> DeletedMoneyReceipt(List<requestDeleted> request)
        {
            var remove = await _iMoneyReceiptRepository.Deleted(request);
            _uow.SaveChanges();
            return remove;
        }

        public async  Task<MoneyReceiptViewModel> GetLastMoneyReceipt()
        {
            var data = await _iMoneyReceiptRepository.GetLastMoneyReceipt();
            return data;
        }
    }
}

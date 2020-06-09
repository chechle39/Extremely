using AutoMapper.QueryableExtensions;
using System;
using System.Collections.Generic;
using System.Linq;
using XAccLib.GL;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class PaymentReceiptService : IPaymentReceiptService
    {
        private readonly IRepository<PaymentReceipt> _paymentReceiptUowRepository;
        private readonly IBuyInvoiceRepository _buyInvoiceRepository;
        private readonly IPaymentReceiptRepository _iPaymentReceiptRepository;
        private readonly IPayments2Service _payments2Service;
        private readonly IPayment2Repository _paymentRepository;
        private readonly IUnitOfWork _uow;
        public PaymentReceiptService(IPayment2Repository paymentRepository, IBuyInvoiceRepository buyInvoiceRepository, IUnitOfWork uow, IPaymentReceiptRepository iPaymentReceiptRepository, IPayments2Service payments2Service, IBuyInvoiceService buyInvoiceService)
        {
            _uow = uow;
            _iPaymentReceiptRepository = iPaymentReceiptRepository;
            _payments2Service = payments2Service;
            _paymentRepository = paymentRepository;
            _buyInvoiceRepository = buyInvoiceRepository;
            _paymentReceiptUowRepository = _uow.GetRepository<IRepository<PaymentReceipt>>();
        }

        public async Task<bool> CreatePaymentReceipt(PaymentReceiptViewModel request)
        {
            var save = await _iPaymentReceiptRepository.CreatePayMentReceipt(request);
            CreateGL();
            _uow.SaveChanges();
            return save;
        }

        private void CreateGL()
        {
            var paymentReceipt = _paymentReceiptUowRepository.GetAll().ProjectTo<PaymentReceiptViewModel>().LastOrDefault();

            var paymentGL = new PaymentReceiptGL(_uow);
            paymentGL.Insert(paymentReceipt);
        }

        public async Task<bool> CreatePaymentReceiptPaymentAsync(PaymentReceiptPayment request)
        {
            Payments_2 payMent = null;
            foreach (var item in request.InvoiceId)
            {
                if (item.AmountIv > 0)
                {
                    payMent = new Payments_2
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
                    var payUw = _uow.GetRepository<IRepository<Payments_2>>();
                    payUw.AddData(payMent);
                    _uow.SaveChanges();
                    //  _paymentsService.SavePayMent(payMent);

                    var payMentById = _payments2Service.GetAllPaymentsByInv(item.InvoiceId).Result;
                    var sumPayMent = payMentById.AsEnumerable().Sum(x => x.amount);
                    //var data = _saleInvoiceService.GetSaleInvoiceById(item.InvoiceId).Result;

                    try
                    {
                        // _saleInvoiceService.Update(data.ToList()[0]);
                        _buyInvoiceRepository.UpdateSaleInvEn(item, sumPayMent);
                    }
                    catch (Exception ex)
                    {

                    }
                    _uow.SaveChanges();


                }

            }

            var rs = new PaymentReceiptViewModel()
            {
                Amount = request.Amount,
                BankAccount = request.BankAccount,
                SupplierID = request.SupplierID,
                SupplierName = request.SupplierName,
                EntryType = request.EntryType,
                ID = 0,
                Note = request.Note,
                PayDate = request.PayDate,
                PayType = request.PayType,
                PayName= request.PayName,
                ReceiptNumber = request.ReceiptNumber,
                ReceiverName = request.ReceiverName
            };
            var create = await CreatePaymentReceipt(rs);
            //if (create == true)
            //    CreateGL();

            return create;
        }

        public async Task<bool> DeletedPaymentReceipt(List<requestDeleted> request)
        {
            var paymentGL = new PaymentReceiptGL(_uow);
            foreach (var item in request)
            {
                await _paymentRepository.DeletedPaymentAsync(item.receiptNumber);
                var data = _paymentReceiptUowRepository.GetAll().Where(x => x.ID == item.id).ProjectTo<PaymentReceiptViewModel>().ToList();
                paymentGL.Delete(data[0]);

            }
            var remove = await _iPaymentReceiptRepository.Deleted(request);
   

    

            _uow.SaveChanges();
            return remove;
        }

        public async Task<PaymentReceiptViewModel> GetLastPaymentReceipt()
        {
            var data = await _iPaymentReceiptRepository.GetLastPayMentReceipt();
            return data;
        }

        public async Task<PaymentReceiptByIdViewModel> GetPaymentReceiptById(long id)
        {
            return await _iPaymentReceiptRepository.GetPaymentReceiptById(id);
        }

        public async Task<bool> Update(PaymentReceiptViewModel request)
        {
            var data = await _iPaymentReceiptRepository.Update(request);
            var payUw = _uow.GetRepository<IRepository<Payments_2>>();
            await _paymentRepository.UpdatePaymentByReceiptNumber(request);
            var paymentGL = new PaymentReceiptGL(_uow);
            paymentGL.Update(request);
            _uow.SaveChanges();
            return data;
        }
    }
}

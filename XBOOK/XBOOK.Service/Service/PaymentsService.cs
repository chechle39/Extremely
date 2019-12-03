using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
//using XAccLib.Payment;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class PaymentsService : IPaymentsService
    {
        private readonly IRepository<Payments> _paymentUowRepository;
        private readonly IUnitOfWork _uow;
        public PaymentsService(IUnitOfWork uow)
        {
            _uow = uow;
            _paymentUowRepository = _uow.GetRepository<IRepository<Payments>>();
        }

        public async Task<IEnumerable<PaymentViewModel>> GetAllPayments()
        {
            return await _paymentUowRepository.GetAll().ProjectTo<PaymentViewModel>().ToListAsync();
        }

        public async Task<IEnumerable<PaymentViewModel>> GetAllPaymentsByInv(long id)
        {
            var listData = await _paymentUowRepository.GetAll().ProjectTo<PaymentViewModel>().Where(x=>x.InvoiceId == id).ToListAsync();
            return listData;
        }

        public async Task<PaymentViewModel> GetPaymentByIdAsync(long id)
        {
            var listData = await _paymentUowRepository.GetByIdDataAsync(id);
            var payment = new PaymentViewModel()
            {
                Amount = listData.amount,
                BankAccount = listData.bankAccount,
                InvoiceId = listData.invoiceID,
                Id = listData.ID,
                Note = listData.note,
                PayDate = listData.payDate,
                PayType = listData.payType,
                PayTypeID = listData.payTypeID,
            };
            return payment;
        }

        public async Task RemovePayMent(long id)
        {
            var listData = _paymentUowRepository.GetAll().ProjectTo<PaymentViewModel>().Where(x=>x.Id == id).ToList();
            await _paymentUowRepository.Remove(id);
           // var paymentGL = new PaymentGL(_uow);
          //  paymentGL.Delete(listData[0]);
        }

        public bool SavePayMent(PaymentViewModel saleInvoiceViewModel)
        {
            _uow.BeginTransaction();
            var saleInvoice = Mapper.Map<PaymentViewModel, Payments>(saleInvoiceViewModel);
             _paymentUowRepository.AddData(saleInvoice);
            _uow.SaveChanges();
            var dataAsign = _paymentUowRepository.GetAll().ProjectTo<PaymentViewModel>().LastOrDefault();
            _uow.CommitTransaction();
           // var paymentGL = new PaymentGL(_uow);
          //  paymentGL.Insert(dataAsign);
            return true;
        }

        public async Task UpdatePayMent(PaymentViewModel request)
        {
            var listData = _paymentUowRepository.GetAll().ProjectTo<PaymentViewModel>().Where(x => x.Id == request.Id).ToList();
            var payments = Mapper.Map<PaymentViewModel, Payments>(request);
            await _paymentUowRepository.Update(payments);
         //   var paymentGL = new PaymentGL(_uow);
         //   paymentGL.Update(listData[0]);
        }
    }
}

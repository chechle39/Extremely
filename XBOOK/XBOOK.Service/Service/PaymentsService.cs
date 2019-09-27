using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Service.Interfaces;
using XBOOK.Service.ViewModels;

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
             await _paymentUowRepository.Remove(id);
        }

        public async Task SavePayMent(PaymentViewModel saleInvoiceViewModel)
        {
            var saleInvoice = Mapper.Map<PaymentViewModel, Payments>(saleInvoiceViewModel);
            await _paymentUowRepository.Add(saleInvoice);
        }

        public async Task UpdatePayMent(PaymentViewModel request)
        {
            var payments = Mapper.Map<PaymentViewModel, Payments>(request);
            await _paymentUowRepository.Update(payments);
        }
    }
}

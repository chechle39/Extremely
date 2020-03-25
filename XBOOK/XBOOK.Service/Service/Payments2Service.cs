using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class Payments2Service : IPayments2Service
    {
        private readonly IRepository<Payments_2> _paymentUowRepository;
        private readonly IUnitOfWork _uow;
        public Payments2Service(IUnitOfWork uow)
        {
            _uow = uow;
            _paymentUowRepository = _uow.GetRepository<IRepository<Payments_2>>();
        }

        public async Task<IEnumerable<Payment2ViewModel>> GetAllPayments()
        {
            return await _paymentUowRepository.GetAll().ProjectTo<Payment2ViewModel>().ToListAsync();
        }

        public async Task<IEnumerable<Payment2ViewModel>> GetAllPaymentsByInv(long id)
        {
            var listData = await _paymentUowRepository.GetAll().ProjectTo<Payment2ViewModel>().AsNoTracking().Where(x => x.invoiceID == id).ToListAsync();
            return listData;
        }

        public async Task<Payment2ViewModel> GetPaymentByIdAsync(long id)
        {
            var listData = await _paymentUowRepository.GetByIdDataAsync(id);
            var payment = new Payment2ViewModel()
            {
                amount = listData.amount,
                receiptNumber = listData.receiptNumber,
                invoiceID = listData.invoiceID,
                ID = listData.ID,
                note = listData.note,
                payDate = listData.payDate,
                payType = listData.payType,
                payName = listData.payName,
            };
            return payment;
        }

        public async Task RemovePayMent(long id)
        {
            var listData = _paymentUowRepository.GetAll().ProjectTo<Payment2ViewModel>().Where(x => x.ID == id).ToList();
            await _paymentUowRepository.Remove(id);
        }

        public bool SavePayMent(Payment2ViewModel saleInvoiceViewModel)
        {
            _uow.BeginTransaction();
            var buyInvoice = Mapper.Map<Payment2ViewModel, Payments_2>(saleInvoiceViewModel);
            _paymentUowRepository.AddData(buyInvoice);
            _uow.SaveChanges();
            var dataAsign = _paymentUowRepository.GetAll().ProjectTo<Payment2ViewModel>().LastOrDefault();
            _uow.CommitTransaction();
            return true;
        }

        public async Task UpdatePayMent(Payment2ViewModel request)
        {
            var listData = _paymentUowRepository.GetAll().ProjectTo<Payment2ViewModel>().Where(x => x.ID == request.ID).ToList();
            var payments = Mapper.Map<Payment2ViewModel, Payments_2>(request);
            await _paymentUowRepository.Update(payments);
        }
    }
}

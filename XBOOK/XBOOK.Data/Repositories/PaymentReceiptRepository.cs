using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Common.Method;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class PaymentReceiptRepository : Repository<PaymentReceipt>, IPaymentReceiptRepository
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly IUnitOfWork _uow;
        public PaymentReceiptRepository(XBookContext context, ISupplierRepository supplierRepository, IUnitOfWork uow) : base(context)
        {
            _supplierRepository = supplierRepository;
            _uow = uow;
        }

        public async Task<bool> CreatePayMentReceipt(PaymentReceiptViewModel request)
        {
            var saveMoneyReceipt = AutoMapper.Mapper.Map<PaymentReceiptViewModel, PaymentReceipt>(request);
            Entities.Add(saveMoneyReceipt);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<bool> Deleted(List<requestDeleted> request)
        {
            foreach (var item in request)
            {
                var rs = Entities.Find(item.id);
                Entities.Remove(rs);
            }
            return await Task.FromResult(true);
        }

        public async Task<PaymentReceiptViewModel> GetLastPayMentReceipt()
        {
            if (Entities.Count() > 1)
            {
                var data = await Entities.ProjectTo<PaymentReceiptViewModel>().OrderByDescending(xx => xx.ID).Take(1).LastOrDefaultAsync();
                data.ReceiptNumber = MethodCommon.InputString(data.ReceiptNumber);
                return data;
            }
            else if (Entities.Count() == 1)
            {
                var data = await Entities.ProjectTo<PaymentReceiptViewModel>().ToListAsync();
                data[0].ReceiptNumber = MethodCommon.InputString(data[0].ReceiptNumber);
                return data[0];
            }
            else
            {
                return null;
            }
        }

        public Task<PaymentReceiptViewModel> GetPayMentId(long Id)
        {
            throw new NotImplementedException();
        }

        public async Task<PaymentReceiptByIdViewModel> GetPaymentReceiptById(long id)
        {
            var data = await Entities.ProjectTo<PaymentReceiptViewModel>().Where(x=>x.ID == id).AsNoTracking().ToListAsync();
            var dataPayment = new PaymentReceiptByIdViewModel()
            {
                Address = await _supplierRepository.GetSupplierByID(data[0].SupplierID),
                Amount = data[0].Amount,
                SupplierID = data[0].SupplierID,
                SupplierName = data[0].SupplierName,
                BankAccount = data[0].BankAccount,
                EntryType = data[0].EntryType,
                ID = data[0].ID,
                Note = data[0].Note,
                PayDate = data[0].PayDate,
                PayName = data[0].PayName,
                PayType = data[0].PayType,
                ReceiptNumber = data[0].ReceiptNumber,
                ReceiverName = data[0].ReceiverName,
            };
            return dataPayment;
        }

        public async Task<bool> Update(PaymentReceiptViewModel request)
        {
            var mapRequest = AutoMapper.Mapper.Map<PaymentReceiptViewModel, PaymentReceipt>(request);
            if (mapRequest.ID == 0) return await Task.FromResult(false); ;
            Entities.Update(mapRequest);
            return await Task.FromResult(true);
        }
    }
}

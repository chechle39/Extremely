using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class MoneyReceiptService : IMoneyReceiptService
    {
        private readonly IMoneyReceiptRepository _iMoneyReceiptRepository;
        private readonly IUnitOfWork _uow;
        public MoneyReceiptService(IUnitOfWork uow, IMoneyReceiptRepository iMoneyReceiptRepository)
        {
            _uow = uow;
            _iMoneyReceiptRepository = iMoneyReceiptRepository;
        }

        public async Task<bool> CreateMoneyReceipt(MoneyReceiptViewModel request)
        {
            var save = await _iMoneyReceiptRepository.CreateMoneyReceipt(request);
            _uow.SaveChanges();
            return save;
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

using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
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
    public class MoneyReceiptRepository: Repository<MoneyReceipt>, IMoneyReceiptRepository
    {
        private readonly IClientRepository _clientRepository;
        public MoneyReceiptRepository(XBookContext context, IClientRepository clientRepository) : base(context)
        {
            _clientRepository = clientRepository;
        }

        public async Task<bool> CreateMoneyReceipt(MoneyReceiptViewModel request)
        {
            var saveMoneyReceipt = AutoMapper.Mapper.Map<MoneyReceiptViewModel, MoneyReceipt>(request);
            Entities.Add(saveMoneyReceipt);
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

        public async Task<MoneyReceiptViewModel> GetLastMoneyReceipt()
        {    
            if (Entities.Count() > 1)
            {
                var data = await Entities.ProjectTo<MoneyReceiptViewModel>().OrderByDescending(xx => xx.ID).Take(1).LastOrDefaultAsync();
                data.ReceiptNumber = MethodCommon.InputString(data.ReceiptNumber);
                return data;
            } else if (Entities.Count() == 1)
            {
                var data = await Entities.ProjectTo<MoneyReceiptViewModel>().ToListAsync();
                data[0].ReceiptNumber = MethodCommon.InputString(data[0].ReceiptNumber);
                return data[0];
            } else
            {
                return null;
            }
           
        }

        public async Task<MoneyReceiptViewModel> GetMoneyByIdAsync(MoneyReceiptID request)
        {

            var data = await Entities.ProjectTo<MoneyReceiptViewModel>().Where(x=> x.ID == request.ID).LastOrDefaultAsync();
            return data;
        }

        public async Task<MoneyReceiptByIdViewModel> GetMoneyByIdObject(long id)
        {
            var data = await Entities.ProjectTo<MoneyReceiptViewModel>().Where(x => x.ID == id).AsNoTracking().ToListAsync();
            var dataMoney = new MoneyReceiptByIdViewModel()
            {
                Address = await _clientRepository.GetAllClientByID(data[0].ClientID),
                Amount = data[0].Amount,
                ClientID = data[0].ClientID,
                ClientName = data[0].ClientName,
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
            return dataMoney;
        }

        public async Task<bool> Update(MoneyReceiptViewModel request)
        {
            var mapRequest = AutoMapper.Mapper.Map<MoneyReceiptViewModel, MoneyReceipt>(request);
            if (mapRequest.ID == 0) return await Task.FromResult(false); ;
            Entities.Update(mapRequest);
            return await Task.FromResult(true);
        }
    }
}

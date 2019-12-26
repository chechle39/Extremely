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
        public MoneyReceiptRepository(DbContext context) : base(context)
        {
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
    }
}

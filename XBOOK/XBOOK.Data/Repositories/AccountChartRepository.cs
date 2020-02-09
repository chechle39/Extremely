using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class AccountChartRepository: Repository<AccountChart>, IAccountChartRepository
    {
        private readonly IUnitOfWork _uow;
        public AccountChartRepository(DbContext context, IUnitOfWork uow) : base(context)
        {
            _uow = uow;
        }

        public async Task<bool> CreateAccountChartAsync(AccountChartViewModel accountChartViewModel)
        {
            var updateData = Entities.Where(x => x.accountNumber == accountChartViewModel.parentAccount).AsNoTracking().ToList();
            var acc = new AccountChart()
            {
                accountName = updateData[0].accountName,
                isParent = true,
                parentAccount = updateData[0].parentAccount,
                accountNumber = updateData[0].accountNumber,
                accountType = updateData[0].accountType,
                closingBalance = updateData[0].closingBalance,
                openingBalance = updateData[0].openingBalance
            };
            try
            {
                Entities.Update(acc);
            } catch (Exception ex)
            {

            }
            
            var accountChart = Mapper.Map<AccountChartViewModel, AccountChart>(accountChartViewModel);

            Entities.Add(accountChart);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<bool> DeleteAccount(Acc accountNumber)
        {
            var data = Entities.Where(x => x.parentAccount == accountNumber.AccNumber).ToList();
            if (data.Count > 0) return await Task.FromResult(false);
            if (data.Count == 0)
                Entities.Remove(Entities.Where(x => x.accountNumber == accountNumber.AccNumber).ToList()[0]);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<bool> Update(AccountChartViewModel accountChartViewModel)
        {
            var accountChart = Mapper.Map<AccountChartViewModel, AccountChart>(accountChartViewModel);
            var update = new AccountChart()
            {
                accountName = accountChart.accountName,
                accountNumber = accountChart.accountNumber,
                accountType = accountChart.accountType,
                closingBalance = accountChart.closingBalance,
                isParent = accountChart.isParent,
                openingBalance = accountChart.openingBalance,
                parentAccount = accountChart.parentAccount,
            };

            Entities.Update(update);
            _uow.SaveChanges();      
            return await Task.FromResult(true);
        }
    }
}

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
        public AccountChartRepository(XBookContext context, IUnitOfWork uow) : base(context)
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

        public async Task<bool> DeleteAccount(AccRequest accountNumber)
        {
            var data = Entities.Where(x => x.parentAccount == accountNumber.AccNumber).AsNoTracking().ToList();
            var dataParent = Entities.Where(x => x.accountNumber == accountNumber.ParentAccNumber).AsNoTracking().ToList();
            if (data.Count > 0) return await Task.FromResult(false);
            if (data.Count == 0)
                Entities.Remove(Entities.Where(x => x.accountNumber == accountNumber.AccNumber).AsNoTracking().ToList()[0]);
            _uow.SaveChanges();
            var data3 = Entities.Where(x => x.parentAccount == accountNumber.ParentAccNumber).AsNoTracking().ToList();
            if (data3.Count == 0)
            {
                var update = new AccountChartViewModel()
                {
                    accountName = dataParent[0].accountName,
                    accountNumber = dataParent[0].accountNumber,
                    accountType = dataParent[0].accountType,
                    closingBalance = dataParent[0].closingBalance,
                    isParent = false,
                    openingBalance = dataParent[0].openingBalance,
                    parentAccount = dataParent[0].parentAccount,
                };
                try
                {
                    await Update(update);

                }
                catch (Exception ex)
                {

                }
               // _uow.SaveChanges();
            }
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

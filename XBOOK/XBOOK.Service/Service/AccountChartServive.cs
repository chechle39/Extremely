using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;


namespace XBOOK.Service.Service
{
    public class AccountChartSerVice : IAcountChartService
    {
        private readonly IRepository<AccountChart> _accountUowRepository;
        private readonly IUnitOfWork _uow;
        private readonly IAccountChartRepository _accountChartRepository;
        public AccountChartSerVice(IRepository<AccountChart> accountUowRepository, IUnitOfWork uow, IAccountChartRepository accountChartRepository)
        {
            _accountUowRepository = accountUowRepository;
            _uow = uow;
            _accountChartRepository = accountChartRepository;
        }

        public async Task<bool> CreateAccountChartAsync(AccountChartViewModel accountChartViewModel)
        {
            return await _accountChartRepository.CreateAccountChartAsync(accountChartViewModel);
        }

        public async Task<bool> DeleteAccount(AccRequest accountNumber)
        {
            return await _accountChartRepository.DeleteAccount(accountNumber);
        }

        public async Task<List<AccountChartViewModel>> GetAllAccount()
        {
            var listData = await _accountUowRepository.GetAll().ProjectTo<AccountChartViewModel>().Where(x => x.isParent == false).ToListAsync();
            return listData.ToList();
        }

        public async Task<List<TreeNode>> GetAllTreeAccountAsync()
        {
            var listData = await _accountUowRepository.GetAll().ProjectTo<TreeNode>().ToListAsync();
            return listData;
        }

        public async Task<bool> Update(AccountChartViewModel accountChartViewModel)
        {
            return await _accountChartRepository.Update(accountChartViewModel);
        }
    }
}

using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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
        public AccountChartSerVice(IRepository<AccountChart> accountUowRepository, IUnitOfWork uow)
        {
            _accountUowRepository = accountUowRepository;
            _uow = uow;
        }

      

        public async Task<List<AccountChartViewModel>> GetAllAccount()
        {
            var listData = await _accountUowRepository.GetAll().ProjectTo<AccountChartViewModel>().Where(x => x.isParent == false).ToListAsync();
            return listData.ToList();
        }
    }
}

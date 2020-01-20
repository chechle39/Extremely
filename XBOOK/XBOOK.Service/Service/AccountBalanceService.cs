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
    public class AccountBalanceService : IAccountBalanceService
    {
        private readonly IRepository<AccountBalance> _accountBalanceUowRepository;
        private readonly IUnitOfWork _uow;
        private readonly IAccountBalanceRepository _iAccountBalanceRepository;
        private readonly XBookContext _context;

        public AccountBalanceService(IUnitOfWork uow, XBookContext context, IAccountBalanceRepository iAccountBalanceRepository)
        {
            _uow = uow;
            _accountBalanceUowRepository = _uow.GetRepository<IRepository<AccountBalance>>();
            _context = context;
            _iAccountBalanceRepository = iAccountBalanceRepository;
        }

        public async Task<IEnumerable<AccountBalanceViewModel>> GetAllAccountBalanceAsync(AccountBalanceSerchRequest request)
        {
            var data = await _iAccountBalanceRepository.GetAllAccountBalanceAsync(request);
            return data;
        }

    

      
    }
}

﻿using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class MasterParamRepository : Repository<MasterParam>, IMasterParamRepository
    {
        public MasterParamRepository(DbContext context) : base(context)
        {
        }
        public bool DeleteMaster(List<requestDeletedMaster> request)
        {
            if (request[0].keydelete != null) {
                var listTax = Entities.Where(x => ((x.paramType == request[0].paramTypedelete && x.key == request[0].keydelete && x.name == request[0].nameDelete))).ToList();
                if (listTax.Count > 0) { Entities.Remove(listTax[0]); }                

            }

            return true;

        }

        public async Task<IEnumerable<MasterParamViewModel>> GetMasTerByMoneyReceipt()
        {
           return await Entities.ProjectTo<MasterParamViewModel>().Where(x => x.paramType == "MoneyReceipt").ToListAsync();
        }

        public async Task<IEnumerable<MasterParamViewModel>> GetMasTerByPaymentReceipt()
        {
            return await Entities.ProjectTo<MasterParamViewModel>().Where(x => x.paramType == "PaymentReceipt").ToListAsync();
        }

        public async Task<IEnumerable<MasterParamViewModel>> GetMasTerByPaymentType()
        {
            return await Entities.ProjectTo<MasterParamViewModel>().Where(x => x.paramType == "PaymentType").ToListAsync();
        }
    }
}
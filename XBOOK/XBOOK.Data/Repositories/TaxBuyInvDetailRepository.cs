using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class TaxBuyInvDetailRepository : Repository<TaxBuyInvDetail>, ITaxBuyInvDetailRepository
    {
        public TaxBuyInvDetailRepository(XBookContext db) : base(db)
        {
        }
        public async Task<bool> CreateTaxInvDetail(TaxInvDetailViewModel taxInvDetailViewModel)
        {
            var taxInvCreate = Mapper.Map<TaxInvDetailViewModel, TaxBuyInvDetail>(taxInvDetailViewModel);
            Entities.Add(taxInvCreate);
            return await Task.FromResult(true);
        }

        public Task<bool> UpdateTaxInvDetail(TaxInvDetailViewModel taxInvDetailViewModel)
        {
            throw new NotImplementedException();
        }
    }
}

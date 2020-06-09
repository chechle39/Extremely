using AutoMapper;
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
    public class TaxInvDetailRepository: Repository<TaxSaleInvDetail>, ITaxInvDetailRepository
    {
        public TaxInvDetailRepository(XBookContext db): base(db)
        {
        }

        public async Task<bool> CreateTaxInvDetail(TaxInvDetailViewModel taxInvDetailViewModel)
        {
            var taxInvCreate = Mapper.Map<TaxInvDetailViewModel, TaxSaleInvDetail>(taxInvDetailViewModel);
            Entities.Add(taxInvCreate);
            return await Task.FromResult(true);
        }

        public async Task<TaxSaleInvDetail> GetTaxInvoiceBySaleInvDetailId(long Id)
        {
            var data = await Entities.Where(x => x.SaleInvoiceDetailId == Id).AsNoTracking().ToListAsync();
            return data[0];
        }

        public async Task<bool> RemoveTaxSale(long id)
        {
            var data = await Entities.Where(x => x.SaleInvoiceDetailId == id).AsNoTracking().ToListAsync();
            Entities.Remove(data[0]);
            return await Task.FromResult(true);
        }

        public async Task<bool> UpdateTaxInvDetail(TaxInvDetailViewModel taxInvDetailViewModel)
        {
            var taxInvCreate = Mapper.Map<TaxInvDetailViewModel, TaxSaleInvDetail>(taxInvDetailViewModel);
            Entities.Update(taxInvCreate);
            return await Task.FromResult(true);
        }
    }
}

using AutoMapper;
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
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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

  

        public async Task<bool> RemoveTaxSale(long id)
        {
            var data = await Entities.Where(x => x.SaleInvDetailID == id).AsNoTracking().ToListAsync();
            if (data.Count() > 0)
                Entities.Remove(data[0]);

            return await Task.FromResult(true);
        }

        public async Task<bool> UpdateTaxInvDetail(TaxInvDetailViewModel taxInvDetailViewModel)
        {
            var taxInvCreate = Mapper.Map<TaxInvDetailViewModel, TaxSaleInvDetail>(taxInvDetailViewModel);
            Entities.Update(taxInvCreate);
            return await Task.FromResult(true);
        }
        public async Task<bool> RemoveTaxSaleInvByTaxInvoiceID(Deleted taxInvoiceId)
        {
            //Entities.FromSql("DELETE FROM dbo.TaxSaleInvDetail WHERE taxInvoiceID == {0}", taxInvoiceId.id);

            try
            {
                var list = await Entities.Where(item => item.taxInvoiceID == taxInvoiceId.id).ToListAsync();
                Entities.RemoveRange(list);
            }
            catch(Exception ex)
            {

            }
           
           
            return await Task.FromResult(true);
        }
    }
}

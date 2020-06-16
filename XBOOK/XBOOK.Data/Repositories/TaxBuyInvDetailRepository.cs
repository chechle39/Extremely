using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class TaxBuyInvDetailRepository : Repository<TaxBuyInvDetail>, ITaxBuyInvDetailRepository
    {
        public TaxBuyInvDetailRepository(XBookContext db) : base(db)
        {
        }
        public async Task<bool> CreateTaxInvDetail(TaxBuyInvDetailViewModel taxInvDetailViewModel)
        {
            var taxInvCreate = Mapper.Map<TaxBuyInvDetailViewModel, TaxBuyInvDetail>(taxInvDetailViewModel);
            Entities.Add(taxInvCreate);
            return await Task.FromResult(true);
        }

        public Task<bool> UpdateTaxInvDetail(TaxBuyInvDetailViewModel taxInvDetailViewModel)
        {
            throw new NotImplementedException();
        }
        public async Task<bool> RemoveTaxSaleInvByTaxInvoiceID(Deleted taxInvoiceId)
        {
            //Entities.FromSql("DELETE FROM dbo.TaxSaleInvDetail WHERE taxInvoiceID == {0}", taxInvoiceId.id);

            try
            {
                var list = await Entities.Where(item => item.invoiceID == taxInvoiceId.id).ToListAsync();
                Entities.RemoveRange(list);
            }
            catch (Exception ex)
            {

            }


            return await Task.FromResult(true);
        }
    }
}

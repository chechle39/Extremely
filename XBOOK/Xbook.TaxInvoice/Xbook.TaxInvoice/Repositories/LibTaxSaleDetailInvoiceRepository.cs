using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xbook.TaxInvoice.Interfaces;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace Xbook.TaxInvoice.Repositories
{
    public class LibTaxSaleDetailInvoiceRepository : Repository<TaxSaleInvDetail>, ILibTaxSaleDetailInvoiceRepository
    {
        public LibTaxSaleDetailInvoiceRepository(XBookContext db) : base(db)
        {

        }

        public async Task<bool> CreateTaxSaleIvDetail(TaxInvDetailViewModel request)
        {
            var saleInvoiceDetailCreate = Mapper.Map<TaxInvDetailViewModel, TaxSaleInvDetail>(request);
            var createData = Entities.Add(saleInvoiceDetailCreate);
            return await Task.FromResult(true);
        }

        public async Task<TaxSaleInvDetail> GetTaxInvoiceBySaleInvDetailId(long Id)
        {
            var data = await Entities.Where(x => x.SaleInvDetailID == Id).AsNoTracking().ToListAsync();
            if (data.Count() > 0)
                return data[0];
            return null;
        }

        public bool RemoveAll(List<TaxInvDetailViewModel> request)
        {
            throw new NotImplementedException();
        }

        public Task<bool> RemoveSale(List<Deleted> id)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> RemoveTaxSale(long id)
        {
            var data = await Entities.Where(x => x.SaleInvDetailID == id).AsNoTracking().ToListAsync();
            Entities.Remove(data[0]);
            return await Task.FromResult(true);
        }

        public bool UpdateTaxSaleInvDetail(TaxInvDetailViewModel rs)
        {
            var dataRm = Mapper.Map<TaxInvDetailViewModel, TaxSaleInvDetail>(rs);
            Entities.Update(dataRm);
            return true;
        }
    }
}

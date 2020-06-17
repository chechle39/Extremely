using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xbook.TaxInvoice.Interfaces;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace Xbook.TaxInvoice.Repositories
{
    public class LibTaxBuyDetailInvoiceRepository : Repository<TaxBuyInvDetail>, ILibTaxBuyDetailInvoiceRepository
    {
        public LibTaxBuyDetailInvoiceRepository(XBookContext db) : base(db)
        {

        }

        public async Task<bool> CreateTaxBuyIvDetail(TaxInvDetailViewModel request)
        {
            var taxBuyInvDetail = new TaxBuyInvDetail()
            {
                amount = request.amount,
                invoiceID = request.InvoiceID,
                description = request.description,
                ID = 0,
                price = request.price,
                productID = request.productID,
                productName = request.productName,
                qty = request.qty,
                vat = request.vat
            };
            var createData = Entities.Add(taxBuyInvDetail);
            return await Task.FromResult(true);
        }

        public Task<TaxBuyInvDetail> GetTaxBuyInvoiceBySaleInvDetailId(long Id)
        {
            throw new NotImplementedException();
        }

        public bool RemoveAll(List<TaxInvDetailViewModel> request)
        {
            throw new NotImplementedException();
        }

        public Task<bool> RemoveSale(List<Deleted> id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> RemoveTaxSale(long id)
        {
            throw new NotImplementedException();
        }

        public bool UpdateTaxBuyInvDetail(TaxInvDetailViewModel rs)
        {
            throw new NotImplementedException();
        }
    }
}

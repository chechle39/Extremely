using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class TaxSaleInvoiceRepository : Repository<TaxSaleInvoice>, ITaxSaleInvoiceRepository
    {
        public TaxSaleInvoiceRepository(XBookContext db): base(db)
        {

        }
        public async Task<bool> CreateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel)
        {
            var taxInvoiceCreate = Mapper.Map<TaxSaleInvoiceModelRequest, TaxSaleInvoice>(taxInvoiceViewModel);
            var invoiceNumber = taxInvoiceCreate.invoiceSerial;
            var swap = taxInvoiceCreate;
            taxInvoiceCreate.invoiceSerial = swap.invoiceNumber;
            taxInvoiceCreate.invoiceNumber = invoiceNumber;
            Entities.Add(taxInvoiceCreate);
            return await Task.FromResult(true);
        }

        public async Task<IEnumerable<TaxSaleInvoice>> GetTaxInvoiceBySaleInvId(string taxInvoiceNumber)
        {
            return await Entities.Where(x => x.TaxInvoiceNumber == taxInvoiceNumber).ToListAsync();
        }

        public async Task<bool> UpdateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel)
        {
            var getId =  Entities.Where(x => x.TaxInvoiceNumber == taxInvoiceViewModel.TaxInvoiceNumber).AsNoTracking().ToList();
            var taxInvoiceUpdate = Mapper.Map<TaxSaleInvoiceModelRequest, TaxSaleInvoice>(taxInvoiceViewModel);
            var invoiceNumber = taxInvoiceUpdate.invoiceNumber;
            taxInvoiceUpdate.TaxInvoiceNumber = taxInvoiceUpdate.TaxInvoiceNumber;
            taxInvoiceUpdate.invoiceNumber = invoiceNumber;
            taxInvoiceUpdate.taxInvoiceID = getId[0].taxInvoiceID;
            Entities.Update(taxInvoiceUpdate);
            return await Task.FromResult(true);
        }


        public async Task<IEnumerable<TaxSaleInvoice>> GetTaxSaleInvoiceById(long id)
        {
            var data = await Entities.Where(x => x.taxInvoiceID == id).ToListAsync();
            return data;
        }


        public async Task<TaxSaleInvoice> GetLastInvoice()
        {
            if (Entities.Count() > 1)
            {
                var data = await Entities.OrderByDescending(xx => xx.taxInvoiceID).Take(1).LastOrDefaultAsync();
                return data;
            }
            else if (Entities.Count() == 1)
            {
                var data = await Entities.ToListAsync();
                return data[0];
            }
            else
            {
                return null;
            }
        }
    }
}

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
using XBOOK.Data.ViewModels;

namespace Xbook.TaxInvoice.Repositories
{
    public class LibTaxBuyInvoiceRepository : Repository<TaxBuyInvoice>, ILibTaxBuyInvoiceRepository
    {
        private readonly IUnitOfWork _uow;
        public LibTaxBuyInvoiceRepository(XBookContext db, IUnitOfWork uow) :base(db)
        {
            _uow = uow;
        }
        public TaxBuyInvoice CreateTaxBuyInvoice(TaxBuyInvoiceModelRequest taxInvoiceViewModel)
        {
            var taxInvoiceCreate = Mapper.Map<TaxBuyInvoiceModelRequest, TaxBuyInvoice>(taxInvoiceViewModel);
            Entities.Add(taxInvoiceCreate);
            _uow.SaveChanges();
            return taxInvoiceCreate;
        }

        public Task<TaxBuyInvoice> GetLastInvoice()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<TaxBuyInvoice>> GetTaxBuyInvoiceById(long id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TaxBuyInvoice>> GetTaxBuyInvoiceBySaleInvId(string taxInvoiceNumber)
        {
            if (!string.IsNullOrEmpty(taxInvoiceNumber))
            {
                var data = await Entities.AsNoTracking().Where(x => x.TaxInvoiceNumber == taxInvoiceNumber).ToListAsync();
                return data;
            }
            else
            {
                return null;

            }
        }

        public Task<bool> UpdateTaxBuyInvoice(TaxBuyInvoiceModelRequest taxInvoiceViewModel, string oldTaxInvoiceNumber)
        {
            throw new NotImplementedException();
        }
    }
}

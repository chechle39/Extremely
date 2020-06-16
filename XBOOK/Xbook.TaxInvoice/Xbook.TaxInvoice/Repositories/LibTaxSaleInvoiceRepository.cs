using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xbook.TaxInvoice.Interfaces;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.ViewModels;

namespace Xbook.TaxInvoice.Repositories
{
    public class LibTaxSaleInvoiceRepository : Repository<TaxSaleInvoice>, ILibTaxSaleInvoiceRepository
    {
        private readonly IUnitOfWork _uow;
        public LibTaxSaleInvoiceRepository(XBookContext db, IUnitOfWork uow) : base(db)
        {
            _uow = uow;
        }

        public TaxSaleInvoice CreateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel)
        {
            var taxInvoiceCreate = Mapper.Map<TaxSaleInvoiceModelRequest, TaxSaleInvoice>(taxInvoiceViewModel);
            Entities.Add(taxInvoiceCreate);
            _uow.SaveChanges();
            return  taxInvoiceCreate;
        }

        public Task<TaxSaleInvoice> GetLastInvoice()
        {
            throw new System.NotImplementedException();
        }

        public async Task<IEnumerable<TaxSaleInvoice>> GetTaxInvoiceBySaleInvId(string taxInvoiceNumber)
        {
            if (!string.IsNullOrEmpty(taxInvoiceNumber))
            {
                var data = await Entities.AsNoTracking().Where(x => x.TaxInvoiceNumber == taxInvoiceNumber).ToListAsync();
                return data;
            } else
            {
                return null;

            }
        }

        public Task<IEnumerable<TaxSaleInvoice>> GetTaxSaleInvoiceById(long id)
        {
            throw new System.NotImplementedException();
        }

        public async Task<bool> UpdateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel, string oldTaxInvoiceNumber)
        {
            var getId = Entities.Where(x => x.TaxInvoiceNumber == oldTaxInvoiceNumber).AsNoTracking().ToList();
            var taxInvoiceUpdate = Mapper.Map<TaxSaleInvoiceModelRequest, TaxSaleInvoice>(taxInvoiceViewModel);
            taxInvoiceUpdate.taxInvoiceID = getId[0].taxInvoiceID;
            taxInvoiceUpdate.TaxInvoiceNumber = oldTaxInvoiceNumber;
            Entities.Update(taxInvoiceUpdate);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }
    }
}

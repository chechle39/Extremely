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
        private readonly IUnitOfWork _unitOfWork;
        public TaxSaleInvoiceRepository(XBookContext db, IUnitOfWork unitOfWork) : base(db)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<bool> CreateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel)
        {
            var taxInvoiceCreate = Mapper.Map<TaxSaleInvoiceModelRequest, TaxSaleInvoice>(taxInvoiceViewModel);
            _unitOfWork.BeginTransaction();
            Entities.Add(taxInvoiceCreate);
            try
            {
                _unitOfWork.SaveChanges();
                _unitOfWork.CommitTransaction();

            }
            catch (Exception ex)
            {

            }
            return await Task.FromResult(true);
        }

        public async Task<IEnumerable<TaxSaleInvoice>> GetTaxInvoiceBySaleInvId(string taxInvoiceNumber)
        {
            return await Entities.Where(x => x.TaxInvoiceNumber == taxInvoiceNumber).ToListAsync();
        }

        public async Task<bool> UpdateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel)
        {
            var getId =  Entities.Where(x => x.taxInvoiceID == taxInvoiceViewModel.taxInvoiceID).AsNoTracking().ToList();
            var taxInvoiceUpdate = Mapper.Map<TaxSaleInvoiceModelRequest, TaxSaleInvoice>(taxInvoiceViewModel);
           
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

        public async Task<bool> removeTaxSaleInv(long id)
        {
            //Entities.FromSql("DELETE FROM dbo.TaxSaleInvDetail WHERE taxInvoiceID == {0}", id);

            try
            {
                var invoice = await Entities.FindAsync(id);
                Entities.Remove(invoice);
            }
            catch(Exception ex)
            {
                return await Task.FromResult(false);
            }
            return await Task.FromResult(true);
        }
    }
}

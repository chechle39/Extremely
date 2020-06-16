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
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class TaxBuyInvoiceRepository : Repository<TaxBuyInvoice>, ITaxBuyInvoiceRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        public TaxBuyInvoiceRepository(XBookContext db, IUnitOfWork unitOfWork) : base(db)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<bool> CreateTaxBuyInvoice(TaxBuyInvoiceModelRequest taxBuyInvoiceViewModel)
        {
            var taxInvoiceCreate = Mapper.Map<TaxBuyInvoiceModelRequest, TaxBuyInvoice>(taxBuyInvoiceViewModel);
            _unitOfWork.BeginTransaction();
            Entities.Add(taxInvoiceCreate);
            _unitOfWork.SaveChanges();
            _unitOfWork.CommitTransaction();
            return await Task.FromResult(true);
        }

        public async Task<TaxBuyInvoice> GetLastInvoice()
        {
            
            if (Entities.Count() > 1)
            {
                var data = await Entities.OrderByDescending(xx => xx.invoiceID).Take(1).LastOrDefaultAsync();
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

        public async Task<IEnumerable<TaxBuyInvoice>> GetTaxBuyInvoiceByBuyInvId(string taxInvoiceNumber)
        {
            return await Entities.Where(x => x.TaxInvoiceNumber == taxInvoiceNumber).ToListAsync();
        }

        public async Task<IEnumerable<TaxBuyInvoice>> GetTaxBuyInvoiceById(long id)
        {
            return await Entities.Where(x => x.invoiceID == id).ToListAsync();
        }

        public async Task<bool> removeTaxBuyInv(long id)
        {
            try
            {
                var invoice = await Entities.FindAsync(id);
                Entities.Remove(invoice);
            }
            catch (Exception ex)
            {
                return await Task.FromResult(false);
            }
            return await Task.FromResult(true);
        }

        public async Task<bool> UpdateTaxBuyInvoice(TaxBuyInvoiceModelRequest taxInvoiceViewModel)
        {
            var getId = Entities.Where(x => x.invoiceID == taxInvoiceViewModel.invoiceID).AsNoTracking().ToList();
            var taxInvoiceUpdate = Mapper.Map<TaxBuyInvoiceModelRequest, TaxBuyInvoice>(taxInvoiceViewModel);

            Entities.Update(taxInvoiceUpdate);
            return await Task.FromResult(true);
        }
    }
}

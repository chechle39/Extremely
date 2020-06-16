﻿using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Xbook.TaxInvoice.Interfaces;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace Xbook.TaxInvoice.Repositories
{
    public class Invoice_TaxInvoiceRepository: Repository<Invoice_TaxInvoice>, IInvoice_TaxInvoiceRepository
    {
        private readonly ISaleInvoiceRepository _saleInvoiceRepository;
        public Invoice_TaxInvoiceRepository(XBookContext db, ISaleInvoiceRepository saleInvoiceRepository) : base(db)
        {
            _saleInvoiceRepository = saleInvoiceRepository;
        }

        public async Task<bool> SaveInvoiceTaxInvoice(Invoice_TaxInvoiceViewModel requestSave, bool isSale)
        {
            var request = new Invoice_TaxInvoice();
            if(isSale)
            {
                request = new Invoice_TaxInvoice()
                {
                    amount = requestSave.amount,
                    ID = requestSave.ID,
                    invoiceNumber = requestSave.invoiceNumber,
                    isSale = isSale,
                    taxInvoiceNumber = requestSave.taxInvoiceNumber,
                    invoiceID = requestSave.invoiceID,
                    taxInvoiceID = requestSave.taxInvoiceID,
                    invoiceAmount = requestSave.invoiceAmount
                };
            } else
            {
                request = new Invoice_TaxInvoice()
                {
                    amount = requestSave.amount,
                    ID = requestSave.ID,
                    invoiceNumber = requestSave.invoiceNumber,
                    isSale = isSale,
                    taxInvoiceNumber = requestSave.taxInvoiceNumber,
                    invoiceID = requestSave.invoiceID,
                    taxInvoiceID = requestSave.taxInvoiceID,
                    invoiceAmount = requestSave.invoiceAmount
                };
            }
            
            Entities.Add(request);

            return await Task.FromResult(true);
        }

        public async Task<bool> UpdateInvoiceTaxInvoice(Invoice_TaxInvoiceViewModel requestSave, string oldTaxInvoice, string oldInvoceNumber)
        {
            var getIdEntity = await Entities.AsNoTracking().Where(x => x.taxInvoiceNumber == oldTaxInvoice && x.invoiceNumber == oldInvoceNumber).ToListAsync();
            var request = new Invoice_TaxInvoice()
            {
                amount = requestSave.amount,
                ID = getIdEntity[0].ID,
                invoiceNumber = requestSave.invoiceNumber,
                isSale = requestSave.isSale,
                taxInvoiceNumber = requestSave.taxInvoiceNumber,
                invoiceID = requestSave.invoiceID,
                taxInvoiceID = requestSave.taxInvoiceID
            };
            Entities.Update(request);
            return await Task.FromResult(true);
        }

        public async Task<bool> DeleteInvoiceTaxInvoiceByTaxInvoiceNumber(string taxInvoiceNumber)
        {
            var getIdEntity = await Entities.Where(x => x.taxInvoiceNumber == taxInvoiceNumber).ToListAsync();
            Entities.RemoveRange(getIdEntity);
            foreach (var item in getIdEntity)
            {
                await _saleInvoiceRepository.UpdateItemTaxNum(item.invoiceID, null);
            }

            return await Task.FromResult(true);
        }

        public async Task<bool> UpdateInvoiceTaxInvoiceRecordInvoice(long invId)
        {
            var getIdEntity = await Entities.AsNoTracking().Where(x => x.invoiceID == invId).ToListAsync();
            if (getIdEntity.Count() > 0)
            {
                getIdEntity[0].invoiceID = 0;
                getIdEntity[0].invoiceNumber = "";
                getIdEntity[0].invoiceAmount = 0;
                Entities.Update(getIdEntity[0]);
            }
          
            return await Task.FromResult(true);
        }
    }
}

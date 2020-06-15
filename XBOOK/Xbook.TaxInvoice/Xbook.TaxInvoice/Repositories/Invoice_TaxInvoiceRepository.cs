using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Xbook.TaxInvoice.Interfaces;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.ViewModels;

namespace Xbook.TaxInvoice.Repositories
{
    public class Invoice_TaxInvoiceRepository: Repository<Invoice_TaxInvoice>, IInvoice_TaxInvoiceRepository
    {
        public Invoice_TaxInvoiceRepository(XBookContext db) : base(db)
        {
        }

        public async Task<bool> SaveInvoiceTaxInvoice(Invoice_TaxInvoiceViewModel requestSave)
        {
            var request = new Invoice_TaxInvoice()
            {
                amount = requestSave.amount,
                ID = requestSave.ID,
                invoiceNumber = requestSave.invoiceNumber,
                isSale = requestSave.isSale,
                taxInvoiceNumber = requestSave.taxInvoiceNumber,
                invoiceID = requestSave.invoiceID,
                taxInvoiceID = requestSave.taxInvoiceID
            };
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
            return await Task.FromResult(true);
        }
    }
}

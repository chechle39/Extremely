using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace Xbook.TaxInvoice.Interfaces
{
    public interface IInvoice_TaxInvoiceRepository
    {
        Task<bool> SaveInvoiceTaxInvoice(Invoice_TaxInvoiceViewModel requestSave);
        Task<bool> UpdateInvoiceTaxInvoice(Invoice_TaxInvoiceViewModel requestSave, string oldTaxInvoice, string oldInvoceNumber);
    }
}

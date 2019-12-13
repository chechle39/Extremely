using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class InVoiceReportViewModel
    {
        public string Address { get; set; }
        public string AmountPaid { get; set; }
        public long ClientId { get; set; }
        public string ClientName { get; set; }
        public string ContactName { get; set; }
        public string DueDate { get; set; }
        public string Email { get; set; }
        public long InvoiceId { get; set; }
        public string InvoiceNumber { get; set; }
        public string InvoiceSerial { get; set; }
        public string IssueDate { get; set; }
        /*--------------------------------------*/
        public string Amount { get; set; }
        public string Description { get; set; }
        public long Id { get; set; }
        public string Price { get; set; }
        public string ProductId { get; set; }
        public string ProductName { get; set; }
        public long Qty { get; set; }
        public int Vat { get; set; }
        public string VatAmount { get; set; }

        /*----------------------------------------------------*/

        public string Notes { get; set; }
        public string Reference { get; set; }
        public string TaxCode { get; set; }
        public string TermCondition { get; set; }
        public string TotalDiscount { get; set; }
        public string YourBankAccount { get; set; }
        public string YourCompanyAddress { get; set; }
        public string YourCompanyId { get; set; }
        public string YourCompanyName { get; set; }
        public string YourTaxCode { get; set; } 
    }
}
